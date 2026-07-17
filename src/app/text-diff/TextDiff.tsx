'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, GitCompare, ArrowLeftRight, Trash2, Columns2, AlignJustify } from 'lucide-react';
import DarkModeToggle from '@/components/DarkModeToggle';
import { computeDiff, type DiffRow, type DiffStats, type WordToken } from '@/lib/diff';
import { detectClipboardSource } from '@/lib/clipboardSource';

type ViewMode = 'split' | 'unified';

const DEFAULT_LEFT_NAME = 'Text A';
const DEFAULT_RIGHT_NAME = 'Text B';

function WordTokens({ tokens, kind }: { tokens: WordToken[]; kind: 'delete' | 'insert' }) {
  return (
    <>
      {tokens.map((t, i) =>
        t.type === 'equal' ? (
          <span key={i}>{t.value}</span>
        ) : (
          <span
            key={i}
            className={
              kind === 'delete'
                ? 'rounded bg-rose-200/70 dark:bg-rose-500/30 text-rose-900 dark:text-rose-100'
                : 'rounded bg-emerald-200/70 dark:bg-emerald-500/30 text-emerald-900 dark:text-emerald-100'
            }
          >
            {t.value}
          </span>
        )
      )}
    </>
  );
}

function Cell({
  num,
  content,
  words,
  wordKind,
  tone,
}: {
  num: number | null;
  content: string | null;
  words?: WordToken[];
  wordKind?: 'delete' | 'insert';
  tone: 'equal' | 'insert' | 'delete' | 'empty';
}) {
  const bg =
    tone === 'insert'
      ? 'bg-emerald-50 dark:bg-emerald-500/10'
      : tone === 'delete'
        ? 'bg-rose-50 dark:bg-rose-500/10'
        : tone === 'empty'
          ? 'bg-slate-50/50 dark:bg-slate-900/30'
          : '';
  const marker =
    tone === 'insert'
      ? 'text-emerald-500'
      : tone === 'delete'
        ? 'text-rose-500'
        : 'text-transparent';

  return (
    <div className={`grid grid-cols-[3rem_1rem_minmax(0,1fr)] ${bg}`}>
      <div className="select-none px-2 py-0.5 text-right text-xs leading-6 text-slate-400 dark:text-slate-600 tabular-nums">
        {num ?? ''}
      </div>
      <div className={`select-none py-0.5 text-center leading-6 ${marker}`}>
        {tone === 'insert' ? '+' : tone === 'delete' ? '-' : ''}
      </div>
      <div className="whitespace-pre-wrap break-words py-0.5 pr-3 leading-6 text-slate-800 dark:text-slate-100">
        {words && wordKind ? (
          <WordTokens tokens={words} kind={wordKind} />
        ) : content === '' ? (
          <span className="text-transparent">.</span>
        ) : (
          content
        )}
      </div>
    </div>
  );
}

function StatsBadges({ stats }: { stats: DiffStats }) {
  return (
    <div className="flex items-center gap-3 text-xs font-medium tabular-nums shrink-0">
      <span className="text-emerald-600 dark:text-emerald-400">+{stats.added}</span>
      <span className="text-rose-600 dark:text-rose-400">−{stats.removed}</span>
      <span className="text-amber-600 dark:text-amber-400">~{stats.changed}</span>
    </div>
  );
}

function SplitView({ rows }: { rows: DiffRow[] }) {
  return (
    <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-800">
      <div>
        {rows.map((row, i) => {
          if (row.type === 'insert') return <Cell key={i} num={null} content={null} tone="empty" />;
          return (
            <Cell
              key={i}
              num={row.leftNum}
              content={row.left}
              words={row.type === 'replace' ? row.leftWords : undefined}
              wordKind="delete"
              tone={row.type === 'equal' ? 'equal' : 'delete'}
            />
          );
        })}
      </div>
      <div>
        {rows.map((row, i) => {
          if (row.type === 'delete') return <Cell key={i} num={null} content={null} tone="empty" />;
          return (
            <Cell
              key={i}
              num={row.rightNum}
              content={row.right}
              words={row.type === 'replace' ? row.rightWords : undefined}
              wordKind="insert"
              tone={row.type === 'equal' ? 'equal' : 'insert'}
            />
          );
        })}
      </div>
    </div>
  );
}

function UnifiedView({ rows }: { rows: DiffRow[] }) {
  return (
    <div>
      {rows.map((row, i) => {
        if (row.type === 'equal') {
          return <Cell key={i} num={row.leftNum} content={row.left} tone="equal" />;
        }
        if (row.type === 'insert') {
          return <Cell key={i} num={row.rightNum} content={row.right} tone="insert" />;
        }
        if (row.type === 'delete') {
          return <Cell key={i} num={row.leftNum} content={row.left} tone="delete" />;
        }
        // replace → show removed line then added line
        return (
          <div key={i}>
            <Cell num={row.leftNum} content={row.left} words={row.leftWords} wordKind="delete" tone="delete" />
            <Cell num={row.rightNum} content={row.right} words={row.rightWords} wordKind="insert" tone="insert" />
          </div>
        );
      })}
    </div>
  );
}

export default function TextDiff() {
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [leftName, setLeftName] = useState('');
  const [rightName, setRightName] = useState('');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  const { rows, stats } = useMemo(
    () => computeDiff(leftText, rightText, { ignoreWhitespace, ignoreCase }),
    [leftText, rightText, ignoreWhitespace, ignoreCase]
  );

  const hasInput = leftText !== '' || rightText !== '';
  const isIdentical = hasInput && stats.added === 0 && stats.removed === 0 && stats.changed === 0;

  // Auto-name a side from the paste source, but only if the user hasn't already
  // typed a name — we never clobber a manual label.
  const handlePaste =
    (setName: (v: string) => void, currentName: string) =>
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (currentName.trim() !== '') return;
      const source = detectClipboardSource(e.clipboardData);
      if (source) setName(source);
    };

  const swap = () => {
    setLeftText(rightText);
    setRightText(leftText);
    setLeftName(rightName);
    setRightName(leftName);
  };

  const clearAll = () => {
    setLeftText('');
    setRightText('');
    setLeftName('');
    setRightName('');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 bg-dot-pattern flex flex-col">
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="container mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2 truncate">
              <GitCompare className="w-5 h-5 text-indigo-500 shrink-0" />
              Text Diff
            </h1>
          </div>
          <DarkModeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            {
              name: leftName,
              setName: setLeftName,
              text: leftText,
              setText: setLeftText,
              placeholder: DEFAULT_LEFT_NAME,
              accent: 'focus:border-rose-400 dark:focus:border-rose-500',
            },
            {
              name: rightName,
              setName: setRightName,
              text: rightText,
              setText: setRightText,
              placeholder: DEFAULT_RIGHT_NAME,
              accent: 'focus:border-emerald-400 dark:focus:border-emerald-500',
            },
          ].map((side, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <input
                type="text"
                value={side.name}
                onChange={(e) => side.setName(e.target.value)}
                placeholder={`${side.placeholder} name (optional)`}
                className={`w-full px-3 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700/80 rounded-lg bg-white/80 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 focus:outline-none transition-colors ${side.accent}`}
              />
              <textarea
                value={side.text}
                onChange={(e) => side.setText(e.target.value)}
                onPaste={handlePaste(side.setName, side.name)}
                placeholder="Paste or type text here…"
                spellCheck={false}
                className="w-full h-64 p-4 border border-slate-200 dark:border-slate-700/80 rounded-xl bg-white/80 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 font-mono text-sm resize-y focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          ))}
        </div>

        {/* Options bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center p-1 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-sm gap-1">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'split'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Columns2 className="w-4 h-4" /> Split
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'unified'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <AlignJustify className="w-4 h-4" /> Unified
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
            />
            Ignore whitespace
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(e) => setIgnoreCase(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
            />
            Ignore case
          </label>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={swap}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4" /> Swap
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </div>
        </div>

        {/* Diff output */}
        <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm overflow-hidden">
          {/* Header row — column widths mirror the diff body so names sit above their columns */}
          {viewMode === 'split' ? (
            <div className="grid grid-cols-2 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-900/40 text-sm font-semibold">
              <div className="min-w-0 pl-16 pr-3 py-2.5">
                <span className="block truncate text-rose-600 dark:text-rose-400">{leftName.trim() || DEFAULT_LEFT_NAME}</span>
              </div>
              <div className="min-w-0 pl-16 pr-3 py-2.5 flex items-center justify-between gap-3">
                <span className="truncate text-emerald-600 dark:text-emerald-400">{rightName.trim() || DEFAULT_RIGHT_NAME}</span>
                <StatsBadges stats={stats} />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-900/40">
              <div className="flex-1 min-w-0 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <span className="text-rose-600 dark:text-rose-400">{leftName.trim() || DEFAULT_LEFT_NAME}</span>
                <span className="mx-2 text-slate-400">→</span>
                <span className="text-emerald-600 dark:text-emerald-400">{rightName.trim() || DEFAULT_RIGHT_NAME}</span>
              </div>
              <StatsBadges stats={stats} />
            </div>
          )}

          <div className="overflow-x-auto font-mono text-sm">
            {!hasInput ? (
              <div className="px-6 py-16 text-center text-slate-400 dark:text-slate-600">
                Enter text in both panels above to see the differences.
              </div>
            ) : isIdentical ? (
              <div className="px-6 py-16 text-center text-slate-500 dark:text-slate-400">
                The two texts are identical.
              </div>
            ) : viewMode === 'split' ? (
              <SplitView rows={rows} />
            ) : (
              <UnifiedView rows={rows} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
