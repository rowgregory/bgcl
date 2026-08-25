export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-cyan-400">
      <span className="text-[#9b1b3c]" aria-hidden="true">
        [
      </span>{' '}
      {children}{' '}
      <span className="text-[#9b1b3c]" aria-hidden="true">
        ]
      </span>
    </p>
  )
}
