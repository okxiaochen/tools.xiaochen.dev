// Line-level diff via longest common subsequence, with word-level detail on
// changed lines. Runs entirely in the browser — no dependencies.

export type ChangeType = 'equal' | 'insert' | 'delete' | 'replace';

export interface WordToken {
  value: string;
  type: 'equal' | 'insert' | 'delete';
}

export interface DiffRow {
  type: ChangeType;
  left: string | null;
  right: string | null;
  leftNum: number | null;
  rightNum: number | null;
  // Present only on `replace` rows: the same line split into word tokens so the
  // UI can highlight exactly what changed within the line.
  leftWords?: WordToken[];
  rightWords?: WordToken[];
}

export interface DiffStats {
  added: number;
  removed: number;
  changed: number;
}

export interface DiffOptions {
  ignoreWhitespace?: boolean;
  ignoreCase?: boolean;
}

interface Op<T> {
  type: 'equal' | 'delete' | 'insert';
  value: T;
}

// Backtrackable LCS table. O(n*m) space/time — fine for interactive text sizes.
function diffSequence<T>(a: T[], b: T[], eq: (x: T, y: T) => boolean): Op<T>[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = eq(a[i], b[j])
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const ops: Op<T>[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (eq(a[i], b[j])) {
      ops.push({ type: 'equal', value: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: 'delete', value: a[i] });
      i++;
    } else {
      ops.push({ type: 'insert', value: b[j] });
      j++;
    }
  }
  while (i < n) ops.push({ type: 'delete', value: a[i++] });
  while (j < m) ops.push({ type: 'insert', value: b[j++] });
  return ops;
}

// Keep separators so tokens can be concatenated back into the original line.
function tokenizeWords(s: string): string[] {
  return s.match(/\s+|\S+/g) ?? [];
}

function wordDiff(left: string, right: string): { leftWords: WordToken[]; rightWords: WordToken[] } {
  const ops = diffSequence(tokenizeWords(left), tokenizeWords(right), (x, y) => x === y);
  const leftWords: WordToken[] = [];
  const rightWords: WordToken[] = [];
  for (const op of ops) {
    if (op.type === 'equal') {
      leftWords.push({ value: op.value, type: 'equal' });
      rightWords.push({ value: op.value, type: 'equal' });
    } else if (op.type === 'delete') {
      leftWords.push({ value: op.value, type: 'delete' });
    } else {
      rightWords.push({ value: op.value, type: 'insert' });
    }
  }
  return { leftWords, rightWords };
}

export function computeDiff(
  leftText: string,
  rightText: string,
  opts: DiffOptions = {}
): { rows: DiffRow[]; stats: DiffStats } {
  const leftLines = leftText.split('\n');
  const rightLines = rightText.split('\n');

  const norm = (s: string): string => {
    let v = s;
    if (opts.ignoreWhitespace) v = v.trim().replace(/\s+/g, ' ');
    if (opts.ignoreCase) v = v.toLowerCase();
    return v;
  };

  const ops = diffSequence(leftLines, rightLines, (x, y) => norm(x) === norm(y));

  const rows: DiffRow[] = [];
  const stats: DiffStats = { added: 0, removed: 0, changed: 0 };
  let leftNum = 0;
  let rightNum = 0;

  let i = 0;
  while (i < ops.length) {
    if (ops[i].type === 'equal') {
      leftNum++;
      rightNum++;
      rows.push({ type: 'equal', left: ops[i].value, right: ops[i].value, leftNum, rightNum });
      i++;
      continue;
    }

    // Gather the whole changed block, then pair deletes with inserts so
    // adjacent modifications line up side by side as `replace` rows.
    const deletes: string[] = [];
    const inserts: string[] = [];
    while (i < ops.length && ops[i].type !== 'equal') {
      if (ops[i].type === 'delete') deletes.push(ops[i].value);
      else inserts.push(ops[i].value);
      i++;
    }

    const pairs = Math.max(deletes.length, inserts.length);
    for (let k = 0; k < pairs; k++) {
      const l = k < deletes.length ? deletes[k] : null;
      const r = k < inserts.length ? inserts[k] : null;
      if (l !== null && r !== null) {
        leftNum++;
        rightNum++;
        const { leftWords, rightWords } = wordDiff(l, r);
        rows.push({ type: 'replace', left: l, right: r, leftNum, rightNum, leftWords, rightWords });
        stats.changed++;
      } else if (l !== null) {
        leftNum++;
        rows.push({ type: 'delete', left: l, right: null, leftNum, rightNum: null });
        stats.removed++;
      } else if (r !== null) {
        rightNum++;
        rows.push({ type: 'insert', left: null, right: r, leftNum: null, rightNum });
        stats.added++;
      }
    }
  }

  return { rows, stats };
}
