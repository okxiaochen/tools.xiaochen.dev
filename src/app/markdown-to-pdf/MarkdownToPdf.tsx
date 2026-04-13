'use client';

import { useState, useEffect, useCallback } from 'react';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import Link from 'next/link';
import { ArrowLeft, FileText, Pencil, Eye, Printer } from 'lucide-react';

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

// Hex-only CSS for the print document (no lab/oklch from site theme).
const PRINT_MARKDOWN_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; border: 0; }
  body { font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background: #ffffff; }

  #markdown-preview {
    font-size: 16px;
    line-height: 1.7;
    color: #1e293b;
    overflow: visible;
    padding: 0;
  }
  #markdown-preview > *:first-child { margin-top: 0; }
  #markdown-preview h1 {
    font-size: 2em; font-weight: 800; line-height: 1.25; color: #0f172a;
    margin: 1.25em 0 0.5em;
  }
  #markdown-preview h2 {
    font-size: 1.5em; font-weight: 700; line-height: 1.3; color: #0f172a;
    margin: 1.25em 0 0.5em;
  }
  #markdown-preview h3 {
    font-size: 1.25em; font-weight: 600; line-height: 1.35; color: #0f172a;
    margin: 1.25em 0 0.5em;
  }
  #markdown-preview p { margin: 1em 0; }
  #markdown-preview a { color: #2563eb; text-decoration: underline; }
  #markdown-preview strong { font-weight: 700; color: inherit; }
  #markdown-preview em { font-style: italic; }
  #markdown-preview blockquote {
    margin: 1em 0; padding: 0.75em 1em;
    border-left: 4px solid #cbd5e1; color: #475569;
  }
  #markdown-preview hr { border-top: 1px solid #e2e8f0; margin: 2em 0; }
  #markdown-preview img { max-width: 100%; }
  #markdown-preview table { border-collapse: collapse; width: 100%; margin: 1em 0; }
  #markdown-preview th, #markdown-preview td { border: 1px solid #e2e8f0; padding: 0.5em 0.75em; text-align: left; }
  #markdown-preview th { background: #f8fafc; font-weight: 600; }

  #markdown-preview pre {
    margin: 1em 0; padding: 1em;
    background: #1e293b; color: #e2e8f0; border-radius: 6px;
    line-height: 1.5;
    white-space: pre-wrap; word-break: break-all; overflow-wrap: break-word;
    page-break-inside: avoid; break-inside: avoid;
  }
  #markdown-preview code { font-family: ui-monospace, monospace; font-size: 0.875em; }
  #markdown-preview :not(pre) > code { background: #f1f5f9; color: #0f172a; padding: 0.125em 0.375em; border-radius: 4px; }
  #markdown-preview pre code { background: none; color: inherit; padding: 0; border-radius: 0; }

  .hljs { color: #e6edf3; }
  .hljs-keyword, .hljs-selector-tag { color: #ff7b72; }
  .hljs-string, .hljs-addition { color: #a5d6ff; }
  .hljs-comment, .hljs-quote { color: #8b949e; font-style: italic; }
  .hljs-function .hljs-title, .hljs-title.function_ { color: #d2a8ff; }
  .hljs-number, .hljs-literal { color: #79c0ff; }
  .hljs-built_in { color: #ffa657; }
  .hljs-variable, .hljs-template-variable { color: #ffa657; }
  .hljs-type, .hljs-title.class_ { color: #ffa657; }
  .hljs-attr, .hljs-attribute { color: #79c0ff; }
  .hljs-symbol, .hljs-bullet { color: #f2cc60; }
  .hljs-meta { color: #8b949e; }
  .hljs-deletion { color: #ffa198; background: #490202; }
  .hljs-addition { background: #04260f; }

  #markdown-preview ul,
  #markdown-preview ol {
    display: block;
    margin: 1em 0;
    padding-left: 2em;
    overflow: visible;
    list-style-position: outside;
  }
  #markdown-preview ul { list-style-type: disc; }
  #markdown-preview ol { list-style-type: decimal; }
  #markdown-preview li {
    display: list-item;
    margin: 0.35em 0;
    overflow: visible;
  }
  #markdown-preview ul ul { list-style-type: circle; }
  #markdown-preview ul ul ul { list-style-type: square; }
  #markdown-preview ol ol { list-style-type: lower-alpha; }
  #markdown-preview ol ol ol { list-style-type: lower-roman; }
`;

function scopedPrintStylesForRoot(): string {
  return PRINT_MARKDOWN_STYLES.split('#markdown-preview').join('#markdown-print-root');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * No @page size — lets the system print dialog choose paper and orientation.
 * Only margins hint the printable area.
 */
async function openPrintableDocument(html: string, documentTitle: string): Promise<void> {
  const { default: DOMPurify } = await import('dompurify');
  const safe = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  const title = escapeHtml(documentTitle.trim() || 'document');
  const bodyCss = `
    @page { margin: 0.5in; }
    html, body { margin: 0; padding: 0; background: #ffffff; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    #markdown-print-root { max-width: 100%; }
  `;
  const fullHtml = `<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title}</title>
<style>${bodyCss}\n${scopedPrintStylesForRoot()}</style>
</head><body>
<div id="markdown-print-root" class="markdown-body">${safe}</div>
<script>
  addEventListener('load', function () {
    setTimeout(function () { print(); }, 150);
  });
</script>
</body></html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  // Do not pass `noopener` in the windowFeatures string: with it, many browsers
  // return `null` from window.open() even when the tab opened, which looks like a block.
  const win = window.open(url, '_blank');
  if (!win) {
    URL.revokeObjectURL(url);
    throw new Error('POPUP_BLOCKED');
  }
  win.opener = null;
  let revoked = false;
  const revokeTimer = window.setTimeout(() => {
    if (!revoked) {
      revoked = true;
      URL.revokeObjectURL(url);
    }
  }, 10 * 60 * 1000);
  const revokeOnce = () => {
    if (revoked) return;
    revoked = true;
    window.clearTimeout(revokeTimer);
    URL.revokeObjectURL(url);
  };
  win.addEventListener('afterprint', revokeOnce, { once: true });
  win.addEventListener('pagehide', revokeOnce, { once: true });
}

const DEFAULT_MARKDOWN = `# Markdown to PDF

Click **Print / Save as PDF**, then in the system dialog choose paper size, orientation, and “Save as PDF” if you want a file.

## Features
- **Code Highlighting**: Syntax highlighting for code blocks.
- **Support Long Code**: Code blocks are wrapped for printing so they won't truncate.

\`\`\`javascript
function example() {
  console.log("Hello, world!");
}
\`\`\`

## Markdown Features
* Lists
* **Bold** and *Italic* text
* [Links](https://xiaochen.dev)
> Blockquotes
`;

export default function MarkdownToPdf() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [htmlPreview, setHtmlPreview] = useState('');
  const [documentTitle, setDocumentTitle] = useState('document');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const parsed = marked.parse(markdown, { async: false });
      setHtmlPreview(parsed as string);
    } catch {
      setHtmlPreview('<p class="text-red-500">Failed to parse markdown</p>');
    }
  }, [markdown]);

  const handlePrintPdf = useCallback(async () => {
    setError(null);
    try {
      await openPrintableDocument(htmlPreview, documentTitle);
    } catch (err) {
      if (err instanceof Error && err.message === 'POPUP_BLOCKED') {
        setError('Pop-up blocked. Allow pop-ups for this site to print.');
      } else {
        console.error('Print PDF failed:', err);
        setError('Could not open print view.');
      }
    }
  }, [htmlPreview, documentTitle]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-slate-900 overflow-hidden">
      <header className="h-16 flex-none bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 flex items-center justify-between z-10 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 py-1.5 px-3 rounded-md shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">Back to Tools</span>
          </Link>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 shrink-0">
            <FileText className="w-5 h-5 text-blue-500" />
            Markdown to PDF
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2 mr-1 sm:mr-2 border-r border-slate-200 dark:border-slate-700 pr-2 sm:pr-4">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
              Title:
            </span>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="w-24 sm:w-36 px-2.5 py-1.5 text-sm bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-slate-200 placeholder-slate-400"
              placeholder="document"
              title="Browser tab title; some systems use it as the suggested PDF name."
            />
          </div>
          {error && (
            <span className="text-sm text-red-500 dark:text-red-400 max-w-[140px] sm:max-w-xs truncate">
              {error}
            </span>
          )}
          <button
            onClick={() => setMarkdown('')}
            className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => void handlePrintPdf()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2"
            title="Opens print — choose paper and “Save as PDF” in the system dialog."
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="w-1/2 min-w-0 flex flex-col border-r border-slate-200 dark:border-slate-700 bg-[#fafafa] dark:bg-slate-900/50">
          <div className="flex-none px-6 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Pencil className="w-4 h-4 text-slate-400" />
            Markdown Editor
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full p-6 bg-transparent text-slate-800 dark:text-slate-200 font-mono text-sm resize-none focus:outline-none focus:ring-0 leading-relaxed"
            placeholder="Type your markdown here..."
          />
        </div>

        <div className="w-1/2 min-w-0 flex flex-col bg-white dark:bg-slate-900 transition-colors duration-200">
          <div className="flex-none px-6 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2 shadow-sm z-10">
            <Eye className="w-4 h-4 text-slate-400" />
            Live Preview
          </div>
          <div className="flex-1 min-w-0 overflow-auto p-10">
            <div
              id="markdown-preview"
              className="markdown-body prose prose-slate dark:prose-invert max-w-3xl mx-auto break-words"
              dangerouslySetInnerHTML={{ __html: htmlPreview }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
