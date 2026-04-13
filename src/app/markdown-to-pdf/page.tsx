'use client';

import { useState, useEffect } from 'react';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import Link from 'next/link';

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

export default function MarkdownToPdfPage() {
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
  const [fileName, setFileName] = useState('document');

  useEffect(() => {
    try {
      const parsed = marked.parse(markdown, { async: false });
      setHtmlPreview(parsed as string);
    } catch (e) {
      console.error('Error parsing markdown', e);
    }
  }, [markdown]);

  const handleDownloadPdf = async () => {
    try {
      // @ts-ignore
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = document.getElementById('markdown-preview');
      if (!element) return;
      
      // To guarantee 100% no "blank pdf" bugs, we operate directly on the live, visible DOM element.
      // We will temporarily mutate it for the screenshot, and instantly revert it afterwards.
      const isDarkMode = element.classList.contains('dark:prose-invert');
      const hasMaxWidth = element.classList.contains('max-w-3xl');
      const originalWidth = element.style.width;
      const originalMinWidth = element.style.minWidth;

      if (hasMaxWidth) {
        element.classList.remove('max-w-3xl');
        element.classList.add('max-w-none');
      }
      if (isDarkMode) {
        element.classList.remove('dark:prose-invert');
      }
      
      // Force Landscape width temporarily so it doesn't wrap awkwardly based on browser window split 
      element.style.width = '1000px';
      element.style.minWidth = '1000px';
      
      // CRITICAL FIX: To prevent the "text cut off on the right" bug, we must ensure NO parent container 
      // uses overflow: auto or overflow: hidden, otherwise html2canvas will literally crop the 1000px width 
      // down to the screen's visual boundaries.
      const parentsOverflow: { el: HTMLElement, overflow: string, priority: string }[] = [];
      let currentParent = element.parentElement;
      while (currentParent) {
        parentsOverflow.push({ 
          el: currentParent, 
          overflow: currentParent.style.getPropertyValue('overflow'),
          priority: currentParent.style.getPropertyPriority('overflow')
        });
        currentParent.style.setProperty('overflow', 'visible', 'important');
        currentParent = currentParent.parentElement;
      }

      // Inject PDF-specific CSS directly to document head for html2canvas to apply
      const pdfStyle = document.createElement('style');
      pdfStyle.id = 'temp-pdf-export-style';
      pdfStyle.innerHTML = `
        /* HACK: html2canvas has a devastating bug where native list-style-type (disc, decimal) is drawn floating above the text baseline. 
           We must force list-style to none, and construct text-based inline bullets! */
        #markdown-preview ul, #markdown-preview ol { 
          list-style: none !important; 
          padding-left: 2em !important; 
        }
        #markdown-preview li { 
          list-style: none !important; 
          position: relative !important; 
          padding-left: 0 !important;
        }

        /* Unordered Lists Text Bullets */
        #markdown-preview ul > li::before {
          content: "•";
          position: absolute !important;
          left: -1em !important;
          top: 0 !important;
          display: block !important;
          background: transparent !important;
          width: auto !important;
          height: auto !important;
          font-family: inherit !important;
          font-size: 1.2em !important;
          line-height: inherit !important;
          color: currentColor !important;
          border-radius: 0 !important; /* overrides tailwind */
        }

        /* Ordered Lists Text Numbers */
        #markdown-preview ol {
          counter-reset: custom-li-counter !important;
        }
        #markdown-preview ol > li {
          counter-increment: custom-li-counter !important;
        }
        #markdown-preview ol > li::before {
          content: counter(custom-li-counter) ".";
          position: absolute !important;
          left: -1.5em !important;
          top: 0 !important;
          display: block !important;
          background: transparent !important;
          width: auto !important;
          height: auto !important;
          font-weight: 400 !important;
          line-height: inherit !important;
          color: currentColor !important;
          border-radius: 0 !important;
        }
        
        /* Prevent vertical text-chopping across page bounds */
        #markdown-preview p, #markdown-preview li, #markdown-preview pre,
        #markdown-preview blockquote, #markdown-preview h1, #markdown-preview h2, #markdown-preview h3 {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
      `;
      document.head.appendChild(pdfStyle);

      const opt = {
        margin:       0.5,
        filename:     `${fileName.trim() || 'document'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(element).save();
      
      // Revert UI changes immediately so the user never notices anything changed
      if (hasMaxWidth) {
        element.classList.add('max-w-3xl');
        element.classList.remove('max-w-none');
      }
      if (isDarkMode) {
        element.classList.add('dark:prose-invert');
      }
      element.style.width = originalWidth;
      element.style.minWidth = originalMinWidth;
      
      // Restore all parent overflows
      parentsOverflow.forEach(p => {
        if (p.priority || p.overflow) {
          p.el.style.setProperty('overflow', p.overflow, p.priority);
        } else {
          p.el.style.removeProperty('overflow');
        }
      });
      
      const tempStyle = document.getElementById('temp-pdf-export-style');
      if (tempStyle) tempStyle.remove();
      
    } catch (err) {
      console.error('Failed to generate PDF download', err);
    }
  };

  const clearAll = () => {
    setMarkdown('');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-slate-900 overflow-hidden">
      {/* Header */}
      <header className="h-16 flex-none bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 flex items-center justify-between z-10 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 py-1.5 px-3 rounded-md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="font-medium text-sm">Back to Tools</span>
          </Link>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Markdown to PDF
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-2 border-r border-slate-200 dark:border-slate-700 pr-3 sm:pr-5">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:block">Name:</span>
            <div className="relative">
              <input 
                type="text" 
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-28 sm:w-40 px-3 py-1.5 pr-10 text-sm bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 font-medium"
                placeholder="document"
              />
              <span className="absolute right-3 top-1.5 text-sm text-slate-400 dark:text-slate-500 pointer-events-none font-mono">.pdf</span>
            </div>
          </div>
          <button 
            onClick={clearAll}
            className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
          >
            Clear
          </button>
          <button 
            onClick={handleDownloadPdf}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download PDF
          </button>
        </div>
      </header>

      {/* Main split view */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side: Editor */}
        <div className="w-1/2 min-w-0 flex flex-col border-r border-slate-200 dark:border-slate-700 bg-[#fafafa] dark:bg-slate-900/50">
          <div className="flex-none px-6 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
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

        {/* Right Side: Preview */}
        <div className="w-1/2 min-w-0 flex flex-col bg-white dark:bg-slate-900 transition-colors duration-200">
          <div className="flex-none px-6 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2 shadow-sm z-10">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
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
