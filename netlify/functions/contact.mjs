// POST /api/contact: validates a message from the contact form and emails it to me through Resend.
// Env: RESEND_API_KEY (required), CONTACT_TO (defaults to profile.email), CONTACT_FROM (a sender on a domain verified in
// Resend; the default onboarding@resend.dev only delivers to the Resend account's own address).
import { profile } from "../../src/data/profile.js";
import { CONTACT_LIMITS as LIMITS } from "../../src/utils/contact.js";

const MIN_FILL_MS = 2500; // Humans take longer than this to fill the form; most bots don't.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** Returns { error } or { data } with the fields trimmed and the topic resolved. */
function validate(input) {
  const name = clean(input.name, LIMITS.name);
  const email = clean(input.email, LIMITS.email);
  const message = typeof input.message === "string" ? input.message.trim() : "";
  const topic = profile.openTo.find((t) => t.id === input.topic);

  if (!topic) return { error: "Pick what this is about." };
  if (!EMAIL_RE.test(email)) return { error: "Add an email address I can reply to." };
  if (message.length < 2) return { error: "Write a message first." };
  if (message.length > LIMITS.message) return { error: `Keep the message under ${LIMITS.message} characters.` };
  return { data: { name, email, message, topic } };
}

async function send({ name, email, message, topic }) {
  const subject = `[Portfolio] ${topic.subject}${name ? ` from ${name}` : ""}`;
  const sender = name ? `${name} <${email}>` : email;
  const text = `${message}\n\n— ${sender}\nTopic: ${topic.label}`;
  const html = `<div style="font:15px/1.6 system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(message)}</div>
<hr style="border:0;border-top:1px solid #ddd;margin:20px 0">
<p style="font:13px/1.5 system-ui,sans-serif;color:#666">${escapeHtml(sender)}<br>Topic: ${escapeHtml(topic.label)}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Portfolio contact <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO || profile.email],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed." });
  if (!process.env.RESEND_API_KEY) {
    console.error("contact: RESEND_API_KEY is not set");
    return json(503, { error: "The mail service isn't configured." });
  }

  let input;
  try {
    input = await req.json();
  } catch {
    return json(400, { error: "Invalid request." });
  }

  // Spam traps: a hidden field only bots fill in, and a form submitted faster than a person could type.
  // Answer as if it worked so bots don't learn to adapt.
  const elapsed = Date.now() - Number(input.startedAt);
  if (input.company || !(elapsed >= MIN_FILL_MS)) return json(200, { ok: true });

  const { error, data } = validate(input);
  if (error) return json(422, { error });

  try {
    await send(data);
  } catch (err) {
    console.error("contact:", err);
    return json(502, { error: "The message couldn't be sent." });
  }
  return json(200, { ok: true });
};

export const config = { path: "/api/contact" };
