import Base64Tool from '@/components/Base64Tool';
import QueryJsonTool from '@/components/QueryJsonTool';
import UrlEncodeTool from '@/components/UrlEncodeTool';
import DarkModeToggle from '@/components/DarkModeToggle';
import FloatingMenu from '@/components/FloatingMenu';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/60 dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              Developer Tools
            </h1>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-slate-800 dark:text-slate-100 mb-3">
              Essential Utilities
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Streamlined encoding and conversion tools for developers
            </p>
          </div>

          {/* Tools Grid */}
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow duration-300">
              <Base64Tool />
            </div>
            
            <div className="bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow duration-300">
              <QueryJsonTool />
            </div>
            
            <div className="bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow duration-300">
              <UrlEncodeTool />
            </div>
          </div>
        </div>
      </main>
      
      {/* Floating Navigation Menu */}
      <FloatingMenu position="right" />
    </div>
  );
}
