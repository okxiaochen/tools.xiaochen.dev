import Base64Tool from '@/components/Base64Tool';
import QueryJsonTool from '@/components/QueryJsonTool';
import UrlEncodeTool from '@/components/UrlEncodeTool';
import DarkModeToggle from '@/components/DarkModeToggle';
import FloatingMenu from '@/components/FloatingMenu';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-200 to-gray-150 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/60 dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              Developer Tools
            </h1>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/okxiaochen/tools.xiaochen.dev" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200"
                title="View source code"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium">Open Source</span>
              </a>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-12">
            
            
            {/* Privacy & Security Notice */}
            <div className="max-w-3xl mx-auto bg-green-50/50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-700/30 rounded-lg px-4 py-3 mb-8">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-sm text-green-700 dark:text-green-300">
                  <strong>100% Client-Side</strong> • No data sent to servers • <strong><a href="https://github.com/okxiaochen/tools.xiaochen.dev" target="_blank" rel="noopener noreferrer" className="hover:underline">Open Source</a></strong>
                </span>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-white/80 via-white/70 to-slate-50/80 dark:from-slate-800/40 dark:via-slate-800/40 dark:to-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow duration-300">
              <Base64Tool />
            </div>
            
            <div className="bg-gradient-to-br from-white/80 via-white/70 to-slate-50/80 dark:from-slate-800/40 dark:via-slate-800/40 dark:to-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow duration-300">
              <QueryJsonTool />
            </div>
            
            <div className="bg-gradient-to-br from-white/80 via-white/70 to-slate-50/80 dark:from-slate-800/40 dark:via-slate-800/40 dark:to-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow duration-300">
              <UrlEncodeTool />
            </div>
          </div>
        </div>
      </main>
      
      {/* Floating Navigation Menu */}
      <FloatingMenu position="right" />

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
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
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