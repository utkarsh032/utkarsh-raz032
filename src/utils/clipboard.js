/** Copies text to the clipboard. Resolves false when the browser refuses. */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
