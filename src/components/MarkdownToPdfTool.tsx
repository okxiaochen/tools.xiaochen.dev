'use client';

import { useState, useEffect } from 'react';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

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

export default function MarkdownToPdfTool() {
  const [markdown, setMarkdown] = useState(`# Markdown to PDF

Write your markdown here, and click **Save as PDF** to generate a PDF document.

## Features
- **Code Highlighting**: Syntax highlighting for code blocks.
- **Support Long Code**: Code blocks are wrapped for printing so they won't truncate.

\`\`\`javascript
// This is a very long line of code that should wrap appropriately when printed to PDF so that it does not get truncated on the right side of the page and remains completely readable on standard A4 paper.
function example() {
  console.log("Hello, world!");
  return Array.from({ length: 100 }, (_, i) => i * 2).filter(n => n % 3 === 0).map(n => n.toString(16)).join('-');
}
\`\`\`

## Markdown Features
* Lists
* **Bold** and *Italic* text
* [Links](https://xiaochen.dev)
> Blockquotes
`);
  const [htmlPreview, setHtmlPreview] = useState('');

  useEffect(() => {
    try {
      const parsed = marked.parse(markdown, { async: false });
      setHtmlPreview(parsed as string);
    } catch (e) {
      console.error('Error parsing markdown', e);
    }
  }, [markdown]);

  const handlePrint = () => {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document;
    if (doc) {
      const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map(el => el.outerHTML)
        .join('');

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Markdown Document</title>
            ${styles}
            <style>
              body {
                background-color: white !important;
                color: black !important;
                margin: 0;
                padding: 20mm;
              }
              .markdown-body {
                max-width: none !important;
                padding: 0 !important;
              }
              /* Specifically reset colors to print nicely */
              .markdown-body, .prose {
                --tw-prose-body: #334155 !important;
                --tw-prose-headings: #0f172a !important;
                --tw-prose-code: #0f172a !important;
              }
              .markdown-body pre {
                background-color: #f8f9fa !important;
                border: 1px solid #dee2e6 !important;
                color: #212529 !important;
                white-space: pre-wrap !important;
                word-break: break-word !important;
              }
              .markdown-body code {
                color: #212529 !important;
                white-space: pre-wrap !important;
                word-break: break-word !important;
              }
            </style>
          </head>
          <body class="bg-white">
            <div class="markdown-body prose prose-slate max-w-none">
              ${htmlPreview}
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 100);
              }
            </script>
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        if (document.body.contains(printFrame)) {
          // Cleanup after 3 seconds assuming print dialog is triggered by then
          setTimeout(() => {
            if (document.body.contains(printFrame)) {
              document.body.removeChild(printFrame);
            }
          }, 3000);
        }
      }, 100);
    }
  };

  const clearAll = () => {
    setMarkdown('');
  };

  return (
    <div id="markdown-to-pdf" className="p-6">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Markdown to PDF</h2>
          <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Client-side</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={clearAll}
            className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors text-sm font-medium border border-slate-300 dark:border-slate-600 rounded-lg"
          >
            Clear All
          </button>
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm font-medium rounded-lg shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Save as PDF
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Editor - hidden during print */}
        <div className="space-y-3 print:hidden">
          <label htmlFor="markdown-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Markdown Input:
          </label>
          <textarea
            id="markdown-input"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Enter markdown here"
            className="w-full h-[600px] p-4 border border-slate-200 dark:border-slate-600 rounded-lg bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-mono text-sm resize-y focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors backdrop-blur-sm"
          />
        </div>

        {/* Preview - taking full width during print */}
        <div className="space-y-3 print:w-full print:block print:absolute print:top-0 print:left-0 print:m-0 print:p-8 print:bg-white">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 print:hidden">
            Preview:
          </label>
          <div
            className="markdown-body w-full min-h-[600px] h-[600px] overflow-y-auto p-6 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 prose prose-slate dark:prose-invert max-w-none print:h-auto print:overflow-visible print:p-0 print:border-none print:shadow-none print:text-black print:prose-slate"
            dangerouslySetInnerHTML={{ __html: htmlPreview }}
          />
        </div>
      </div>

    </div>
  );
}
