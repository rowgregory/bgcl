export const sentenceCase = (v?: string | null) => (v ? v.charAt(0) + v.slice(1).toLowerCase() : '—')
