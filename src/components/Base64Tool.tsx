'use client';

import { useState } from 'react';

export default function Base64Tool() {
  const [plainText, setPlainText] = useState('');
  const [encodedText, setEncodedText] = useState('');

  const encodeText = (text: string) => {
    try {
      if (text.trim() === '') {
        setEncodedText('');
        return;
      }
      const encoded = btoa(unescape(encodeURIComponent(text)));
      setEncodedText(encoded);
    } catch {
      setEncodedText('Error: Invalid input for encoding');
    }
  };

  const decodeText = (text: string) => {
    try {
      if (text.trim() === '') {
        setPlainText('');
        return;
      }
      const decoded = decodeURIComponent(escape(atob(text)));
      setPlainText(decoded);
    } catch {
      setPlainText('Error: Invalid Base64 string');
    }
  };

  const clearAll = () => {
    setPlainText('');
    setEncodedText('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div id="base64" className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Base64 Encode/Decode</h2>
          <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Client-side</span>
          </div>
        </div>
        <button 
          onClick={clearAll}
          className="px-4 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors text-sm font-medium"
        >
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-3">
          <label htmlFor="plain-text" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Plain Text:
          </label>
          <textarea
            id="plain-text"
            value={plainText}
            onChange={(e) => {
              setPlainText(e.target.value);
              encodeText(e.target.value);
            }}
            placeholder="Enter plain text here"
            className="w-full h-48 p-4 border border-slate-200 dark:border-slate-600 rounded-lg bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-mono text-sm resize-vertical focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors backdrop-blur-sm"
          />
          <button
            onClick={() => copyToClipboard(plainText)}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors text-sm font-medium border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Copy
          </button>
        </div>

        <div className="space-y-3">
          <label htmlFor="encoded-text" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Base64 Encoded:
          </label>
          <textarea
            id="encoded-text"
            value={encodedText}
            onChange={(e) => {
              setEncodedText(e.target.value);
              decodeText(e.target.value);
            }}
            placeholder="Enter Base64 encoded text here"
            className="w-full h-48 p-4 border border-slate-200 dark:border-slate-600 rounded-lg bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-mono text-sm resize-vertical focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors backdrop-blur-sm"
          />
          <button
            onClick={() => copyToClipboard(encodedText)}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors text-sm font-medium border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
