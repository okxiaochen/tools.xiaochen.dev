// Best-effort detection of where pasted text came from.
//
// Browsers do NOT expose the source application (macOS pasteboard owner, etc.)
// for privacy reasons, so there is no reliable "which app" signal. What we can
// do is inspect the `text/html` flavor of the clipboard, which several apps
// stamp with recognizable fingerprints. When nothing matches we return null and
// the caller falls back to a user-editable name.

export function detectClipboardSource(dataTransfer: DataTransfer | null): string | null {
  if (!dataTransfer) return null;

  const types = Array.from(dataTransfer.types);

  // VS Code (and forks) attach a custom clipboard flavor when copying editor text.
  if (types.includes('vscode-editor-data')) return 'VS Code';

  const html = types.includes('text/html') ? dataTransfer.getData('text/html') : '';
  if (html) {
    if (/docs-internal-guid-/.test(html)) return 'Google Docs';
    if (/content=["']?Word\.Document|urn:schemas-microsoft-com:office:word/i.test(html)) return 'Microsoft Word';
    if (/content=["']?Excel\.Sheet|urn:schemas-microsoft-com:office:excel/i.test(html)) return 'Microsoft Excel';
    if (/content=["']?PowerPoint|urn:schemas-microsoft-com:office:powerpoint/i.test(html)) return 'PowerPoint';
    if (/class=["'][^"']*notion-|data-block-id=/.test(html)) return 'Notion';

    // Some platforms surface the originating page URL inside CF_HTML.
    const sourceUrl = html.match(/SourceURL:\s*(\S+)/i);
    if (sourceUrl) {
      try {
        return new URL(sourceUrl[1]).hostname.replace(/^www\./, '');
      } catch {
        // fall through
      }
    }
  }

  return null;
}
