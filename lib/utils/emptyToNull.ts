export function emptyToNull<T extends Record<string, any>>(obj: T, keys: readonly (keyof T)[]) {
  const out = { ...obj }
  for (const k of keys) if (!out[k]) out[k] = null as any
  return out
}
