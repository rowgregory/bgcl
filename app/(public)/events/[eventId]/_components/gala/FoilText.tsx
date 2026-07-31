import { useId, useLayoutEffect, useRef, useState } from 'react'

export function FoilText({ children, className = '', height = 160, letterSpacing = '0.02em', weight = 600 }) {
  const uid = useId().replace(/:/g, '')
  const probeRef = useRef(null)
  const [box, setBox] = useState(null)

  const fontSize = height * 0.92
  const fontFamily = "'Bodoni Moda', Didot, 'Bodoni MT', Georgia, serif"
  const PAD = fontSize * 0.16 // breathing room so the glow/bevel isn't clipped

  useLayoutEffect(() => {
    const measure = () => {
      const b = probeRef.current?.getBBox()
      if (b && b.width > 0) {
        setBox({ x: b.x - PAD, y: b.y - PAD, w: b.width + PAD * 2, h: b.height + PAD * 2 })
      }
    }
    measure()
    // re-measure after webfonts load, else we'd be sized to the fallback serif
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measure)
    }
  }, [children, height, weight, letterSpacing, PAD])

  const textProps = {
    x: 0,
    y: 0,
    fontFamily,
    fontWeight: weight,
    fontSize,
    letterSpacing
  }

  return (
    <svg
      className={className}
      viewBox={box ? `${box.x} ${box.y} ${box.w} ${box.h}` : `0 0 ${height * 3} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={children}
      style={{
        display: 'block',
        width: '100%',
        height: 'auto',
        visibility: box ? 'visible' : 'hidden' // avoid the pre-measure flash
      }}
    >
      <title>{children}</title>

      <defs>
        <linearGradient id={`metal-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#f4f5f7" />
          <stop offset="36%" stopColor="#ffffff" />
          <stop offset="53%" stopColor="#b4b9c1" />
          <stop offset="64%" stopColor="#f8f9fa" />
          <stop offset="82%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#c6cad0" />
        </linearGradient>

        <pattern id={`plate-${uid}`} width="18" height="18" patternUnits="userSpaceOnUse">
          <path
            d="M9 1.5 L16.5 9 L9 16.5 L1.5 9 Z"
            fill="none"
            stroke="#ffffff"
            strokeOpacity=".55"
            strokeWidth="1.1"
          />
          <path d="M9 3 L15 9 L9 15 L3 9 Z" fill="none" stroke="#5c6068" strokeOpacity=".45" strokeWidth="1.1" />
          <circle cx="9" cy="9" r="1.2" fill="#ffffff" fillOpacity=".5" />
        </pattern>

        <filter id={`bevel-${uid}`} x="-20%" y="-40%" width="140%" height="180%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000" floodOpacity=".55" />
          <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#fff" floodOpacity=".22" />
        </filter>

        <clipPath id={`clip-${uid}`}>
          <text {...textProps}>{children}</text>
        </clipPath>
      </defs>

      {/* invisible probe — exists purely so getBBox has something to measure */}
      <text {...textProps} ref={probeRef} fill="none" stroke="none" aria-hidden="true">
        {children}
      </text>

      {/* 1 — metal gradient */}
      <text {...textProps} fill={`url(#metal-${uid})`} filter={`url(#bevel-${uid})`}>
        {children}
      </text>

      {/* 2 — diamond plate, clipped to the glyphs */}
      {box && (
        <g clipPath={`url(#clip-${uid})`}>
          <rect x={box.x} y={box.y} width={box.w} height={box.h} fill={`url(#plate-${uid})`} opacity=".85" />
        </g>
      )}

      {/* 3 — crisp top highlight edge */}
      <text {...textProps} y={-1.5} fill="none" stroke="#ffffff" strokeOpacity=".45" strokeWidth="0.6">
        {children}
      </text>
    </svg>
  )
}
