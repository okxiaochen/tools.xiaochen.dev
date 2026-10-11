// Canonicalize JSON text so structurally-equal documents diff as equal:
// consistent 2-space indentation and (optionally) recursively sorted object keys.
// Array order is preserved — it's semantically meaningful in JSON.

export type JsonNormalizeResult = { ok: true; text: string } | { ok: false; error: string };

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(obj).sort()) sorted[key] = sortKeysDeep(obj[key]);
    return sorted;
  }
  return value;
}

export function normalizeJson(text: string, opts: { sortKeys?: boolean } = {}): JsonNormalizeResult {
  if (text.trim() === '') return { ok: true, text: '' };
  try {
    const parsed: unknown = JSON.parse(text);
    return { ok: true, text: JSON.stringify(opts.sortKeys ? sortKeysDeep(parsed) : parsed, null, 2) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

// Cheap check used to suggest JSON mode: only objects/arrays count, so plain
// text like `42` or `"hi"` doesn't trigger the hint.
export function looksLikeJson(text: string): boolean {
  const t = text.trim();
  if (!(t.startsWith('{') || t.startsWith('['))) return false;
  try {
    JSON.parse(t);
    return true;
  } catch {
    return false;
  }
}
