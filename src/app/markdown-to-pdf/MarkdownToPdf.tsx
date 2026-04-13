'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import Link from 'next/link';
import { ArrowLeft, FileText, Pencil, Eye, Printer, Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';

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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const DEFAULT_MARKDOWN = `# Markdown to PDF

Click **Print / Save as PDF** or press **Cmd/Ctrl + P** to directly save or print the document without opening a new tab.

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

const DEBOUNCE_MS = 150;

export default function MarkdownToPdf() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [htmlPreview, setHtmlPreview] = useState('');
  const [documentTitle, setDocumentTitle] = useState('document');
  const [isPrinting, setIsPrinting] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced parsing to maintain smooth typing, especially on large documents
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        const parsed = marked.parse(markdown, { async: false });
        // Sanitize html for extra safety since it's user markdown
        const safeHtml = DOMPurify.sanitize(parsed as string, { USE_PROFILES: { html: true } });
        setHtmlPreview(safeHtml);
      } catch {
        setHtmlPreview('<p class="text-red-500">Failed to parse markdown</p>');
      }
    }, DEBOUNCE_MS);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [markdown]);

  const handlePrintPdf = useCallback(() => {
    setIsPrinting(true);
    const originalTitle = document.title;
    document.title = documentTitle.trim() || 'document';

    // Slight delay to ensure React state updates and the UI visually indicates 'Preparing' if needed
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
      setIsPrinting(false);
    }, 150);
  }, [documentTitle]);

  // Cmd/Ctrl + P keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        handlePrintPdf();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handlePrintPdf]);

  return (
    <>
      {/* Scope print styles so that it formats nicely and hides UI elements during native print */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body, html {
            background-color: white !important;
            color: black !important;
          }
          /* Hide app UI elements */
          header, nav, footer, .floating-menu, #markdown-editor-pane {
            display: none !important;
          }
          /* Ensure preview takes full space and removes app scroll constraints */
          #markdown-preview-pane {
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            background: white !important;
            display: block !important;
          }
          #markdown-preview-pane > :first-child {
            display: none !important; /* Hide "Live Preview" toolbar/header */
          }
          #markdown-preview {
            max-width: 100% !important;
            padding: 0 !important;
            color: black !important;
          }
          /* Ensure code blocks wrap properly, and preserve syntax colors */
          .markdown-body * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .markdown-body pre {
            white-space: pre-wrap !important;
            word-break: break-all !important;
            overflow-wrap: break-word !important;
            page-break-inside: avoid;
            /* Override prose padding and background to let hljs handle it beautifully */
            padding: 0 !important;
            background-color: transparent !important;
            border: none !important;
          }
          .markdown-body pre code.hljs {
            padding: 1.25em !important;
            border-radius: 0.5rem !important;
            display: block;
            /* Force hljs default background to ensure dark theme across prints */
            background-color: #0d1117 !important;
          }
        }
      `}} />

      <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-slate-900 overflow-hidden print:h-auto print:overflow-visible" id="markdown-to-pdf-root">
        <header className="h-16 flex-none bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 flex items-center justify-between z-10 shadow-sm transition-colors duration-200 print:hidden">
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
            <button
              onClick={() => { if (markdown.trim()) setMarkdown(''); }}
              disabled={!markdown.trim()}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handlePrintPdf}
              disabled={isPrinting || !htmlPreview.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:hover:shadow-md"
              title="Opens print — choose paper and “Save as PDF” in the system dialog. (⌘P)"
            >
              {isPrinting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              {isPrinting ? 'Preparing…' : 'Print / Save as PDF'}
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col md:flex-row overflow-hidden print:overflow-visible print:block">
          <div id="markdown-editor-pane" className="h-1/2 md:h-auto md:w-1/2 min-w-0 flex flex-col border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 bg-[#fafafa] dark:bg-slate-900/50 print:hidden">
            <div className="flex-none px-6 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Pencil className="w-4 h-4 text-slate-400" />
              Markdown Editor
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              spellCheck={false}
              aria-label="Markdown editor"
              className="flex-1 w-full p-6 bg-transparent text-slate-800 dark:text-slate-200 font-mono text-sm resize-none focus:outline-none focus:ring-0 leading-relaxed"
              placeholder="Type your markdown here..."
            />
          </div>

          <div id="markdown-preview-pane" className="h-1/2 md:h-auto md:w-1/2 min-w-0 flex flex-col bg-white dark:bg-slate-900 transition-colors duration-200 print:w-full print:block">
            <div className="flex-none px-6 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2 shadow-sm z-10 print:hidden">
              <Eye className="w-4 h-4 text-slate-400" />
              Live Preview
            </div>
            <div className="flex-1 min-w-0 overflow-auto p-6 md:p-10 print:overflow-visible print:p-0">
              <div
                id="markdown-preview"
                className="markdown-body prose prose-slate dark:prose-invert max-w-3xl mx-auto break-words print:max-w-none print:prose-slate"
                dangerouslySetInnerHTML={{ __html: htmlPreview }}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
