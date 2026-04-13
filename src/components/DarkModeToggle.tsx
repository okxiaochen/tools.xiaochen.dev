'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Next-themes hydration mismatch prevention
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Placeholder matching the same layout before hydration
    return (
      <div className="flex items-center p-1 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="w-7 h-7" />
        <div className="w-7 h-7" />
        <div className="w-7 h-7" />
      </div>
    );
  }

  return (
    <div className="flex items-center flex-row p-1 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-sm gap-1">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-md transition-all duration-200 flex items-center justify-center ${
          theme === 'light'
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/40'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border border-transparent'
        }`}
        aria-label="Light mode"
        title="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-md transition-all duration-200 flex items-center justify-center ${
          theme === 'system'
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/40'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border border-transparent'
        }`}
        aria-label="System mode"
        title="System mode"
      >
        <Monitor className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-md transition-all duration-200 flex items-center justify-center ${
          theme === 'dark'
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/40'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border border-transparent'
        }`}
        aria-label="Dark mode"
        title="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}