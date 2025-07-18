'use client';

import { useState } from 'react';

export default function QueryJsonTool() {
  const [queryString, setQueryString] = useState('');
  const [jsonObject, setJsonObject] = useState('');

  const convertQueryToJson = (query: string) => {
    try {
      if (query.trim() === '') {
        setJsonObject('');
        return;
      }
      
      const input = query.trim();
      const cleanInput = input.startsWith('?') ? input.substring(1) : input;
      
      const params = new URLSearchParams(cleanInput);
      const result: Record<string, string | string[]> = {};
      
      for (const [key, value] of params) {
        if (result[key]) {
          if (Array.isArray(result[key])) {
            (result[key] as string[]).push(value);
          } else {
            result[key] = [result[key] as string, value];
          }
        } else {
          result[key] = value;
        }
      }
      
      setJsonObject(JSON.stringify(result, null, 2));
    } catch {
      setJsonObject('Error: Invalid query string format');
    }
  };

  const convertJsonToQuery = (json: string) => {
    try {
      if (json.trim() === '') {
        setQueryString('');
        return;
      }
      
      const obj = JSON.parse(json);
      const params = new URLSearchParams();
      
      for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, String(v)));
        } else {
          params.append(key, String(value));
        }
      }
      
      setQueryString(params.toString());
    } catch {
      setQueryString('Error: Invalid JSON format');
    }
  };

  const clearAll = () => {
    setQueryString('');
    setJsonObject('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">URL Query ↔ JSON</h2>
        <button 
          onClick={clearAll}
          className="px-4 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors text-sm font-medium"
        >
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-3">
          <label htmlFor="query-string" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Query String:
          </label>
          <textarea
            id="query-string"
            value={queryString}
            onChange={(e) => {
              setQueryString(e.target.value);
              convertQueryToJson(e.target.value);
            }}
            placeholder="Enter query string (e.g., name=john&age=30)"
            className="w-full h-48 p-4 border border-slate-200 dark:border-slate-600 rounded-lg bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-mono text-sm resize-vertical focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors backdrop-blur-sm"
          />
          <button
            onClick={() => copyToClipboard(queryString)}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors text-sm font-medium border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Copy
          </button>
        </div>

        <div className="space-y-3">
          <label htmlFor="json-object" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            JSON Object:
          </label>
          <textarea
            id="json-object"
            value={jsonObject}
            onChange={(e) => {
              setJsonObject(e.target.value);
              convertJsonToQuery(e.target.value);
            }}
            placeholder="Enter JSON object here"
            className="w-full h-48 p-4 border border-slate-200 dark:border-slate-600 rounded-lg bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-mono text-sm resize-vertical focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors backdrop-blur-sm"
          />
          <button
            onClick={() => copyToClipboard(jsonObject)}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors text-sm font-medium border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
