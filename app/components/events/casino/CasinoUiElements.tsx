// ── Gradients (can't be done in Tailwind) ─────────────────────────────────────
export const GRADIENTS: Record<string, { card: string; glow: string; shimmer: string }> = {
  RAFFLE: {
    card: 'linear-gradient(135deg, #7f0000 0%, #c0392b 45%, #e74c3c 65%, #922b21 100%)',
    glow: 'rgba(231,76,60,0.65)',
    shimmer: 'rgba(255,120,120,0.3)'
  },
  TOURNAMENT: {
    card: 'linear-gradient(135deg, #3d006e 0%, #7b2fbe 45%, #a855f7 65%, #5b0fa8 100%)',
    glow: 'rgba(168,85,247,0.65)',
    shimmer: 'rgba(200,150,255,0.3)'
  },
  SPONSORSHIP: {
    card: 'linear-gradient(135deg, #6b2d00 0%, #d4af37 45%, #f5e678 65%, #b8860b 100%)',
    glow: 'rgba(212,175,55,0.75)',
    shimmer: 'rgba(245,230,120,0.4)'
  },
  GENERAL: {
    card: 'linear-gradient(135deg, #003060 0%, #0ea5e9 45%, #38bdf8 65%, #0284c7 100%)',
    glow: 'rgba(14,165,233,0.65)',
    shimmer: 'rgba(125,211,252,0.3)'
  }
}
export const SUITS: Record<string, string> = { RAFFLE: '♠', TOURNAMENT: '♣', SPONSORSHIP: '♦', GENERAL: '♥' }

// ── Gold divider ──────────────────────────────────────────────────────────────
export function GoldDivider() {
  return (
    <div
      className="w-full h-px my-12 sm:my-16"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)' }}
      aria-hidden="true"
    />
  )
}

// ── Section heading ───────────────────────────────────────────────────────────
export function SectionHeading({ suit, id, children }: { suit: string; id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="flex items-baseline gap-3 mb-8 sm:mb-10">
      <span
        className="text-3xl font-black leading-none suit"
        style={{
          background: 'linear-gradient(135deg, #d4af37, #f5e678)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
        aria-hidden="true"
      >
        {suit}
      </span>
      <span className="oswald text-[clamp(26px,5vw,40px)] font-black uppercase tracking-[0.05em] text-white leading-none">
        {children}
      </span>
    </h2>
  )
}

// ── Metadata label+value pair ─────────────────────────────────────────────────
export function MetaItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="oswald text-[9px] font-black uppercase tracking-[0.25em] text-amber-600/50 mb-2">✦ {label}</p>
      <div className="text-[15px] text-white/45 leading-relaxed">{children}</div>
    </div>
  )
}

export const CasinoStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
  .casino-page { font-family: 'DM Sans', sans-serif; }
  .casino-page .oswald, .oswald { font-family: 'Oswald', sans-serif !important; }
  @keyframes cardShine { 0% { transform: translateX(-100%) skewX(-15deg); } 60% { transform: translateX(200%) skewX(-15deg); } 100% { transform: translateX(200%) skewX(-15deg); } }
  @keyframes btnShine  { 0% { transform: translateX(-50%); } 100% { transform: translateX(50%); } }
  @keyframes floatUp   { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  @keyframes goldPulse { 0%,100% { text-shadow: 0 0 20px rgba(212,175,55,0.4); } 50% { text-shadow: 0 0 60px rgba(212,175,55,0.9), 0 0 100px rgba(212,175,55,0.5); } }
`
