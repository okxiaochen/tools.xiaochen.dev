import Base64Tool from '@/components/Base64Tool';
import QueryJsonTool from '@/components/QueryJsonTool';
import UrlEncodeTool from '@/components/UrlEncodeTool';
import DarkModeToggle from '@/components/DarkModeToggle';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 bg-dot-pattern flex flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-6 py-3.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Developer Tools
              </h1>

              <a
                href="https://github.com/okxiaochen/tools.xiaochen.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-500/10 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-500/20 hover:scale-105 hover:bg-emerald-100/80 dark:hover:bg-emerald-500/20 transition-all duration-300 shadow-sm"
                title="View source code"
              >
                <span><strong>100% Client-Side</strong> • No data sent to servers • Open Source</span>
              </a>
            </div>

            <div className="flex items-center gap-3">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-16 flex-1 flex flex-col z-10">
        <div className="container mx-auto px-6 relative">
          {/* Tools Grid */}
          <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 xl:grid-cols-2 gap-6 relative">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col overflow-hidden mix-blend-normal">
              <Base64Tool />
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col overflow-hidden mix-blend-normal">
              <QueryJsonTool />
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col overflow-hidden mix-blend-normal">
              <UrlEncodeTool />
            </div>

            <Link href="/markdown-to-pdf" className="h-full flex flex-col bg-linear-to-br from-indigo-50/80 to-blue-50/50 dark:from-indigo-950/40 dark:to-blue-900/20 backdrop-blur-xl rounded-2xl border border-indigo-200/50 dark:border-indigo-800/40 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 p-8 group overflow-hidden mix-blend-normal">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center h-full gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-3 tracking-tight">
                    <svg className="w-6 h-6 text-indigo-500 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Markdown to PDF
                  </h2>
                  <p className="text-indigo-700/80 dark:text-indigo-300/80 mt-2 font-medium max-w-xl leading-relaxed">Open the dedicated full-screen editor with live preview to instantly convert markdown documents into formatted PDFs.</p>
                </div>
                <div className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-[0_4px_14px_0_rgb(99,102,241,0.39)] transition-all duration-300 group-hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] group-hover:scale-105 shrink-0">
                  Try it out
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>



      {/* Contact info at bottom */}
      <div className="text-center pb-1">

        <div className="flex items-center justify-center gap-8">

          <a
            href="https://xiaochen.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200 no-underline"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              <span className="text-xs">xiaochen.dev</span>
            </div>
          </a>

          {/* Github */}
          <a
            href="https://github.com/okxiaochen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200 no-underline"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">okxiaochen</span>
            </div>
          </a>



          <a
            href="mailto:xiao@xiaochen.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200 no-underline"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
              </svg>
              <span className="text-xs">xiao@xiaochen.dev</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}