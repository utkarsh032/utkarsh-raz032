// Client for the contact function (netlify/functions/contact.mjs), which imports these limits too.
export const CONTACT_LIMITS = { name: 80, email: 254, message: 5000 };

/**
 * Sends the contact form. Resolves { ok: true } or { ok: false, error, retryable }.
 * `retryable` is false for validation errors the visitor has to fix, true when the service failed or is unreachable
 * (e.g. under plain `vite` dev, which doesn't run functions), in which case the mail-app fallback makes sense.
 */
export async function sendMessage(payload) {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.ok) return { ok: true };
    return { ok: false, error: body.error ?? "The message couldn't be sent.", retryable: res.status !== 422 };
  } catch {
    return { ok: false, error: "Couldn't reach the mail service.", retryable: true };
  }
}
