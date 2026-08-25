import Script from 'next/script'

const STORAGE_KEY = 'bgcl-preferences'

const script = `
(function() {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}')
    var theme = stored ? JSON.parse(stored).state.theme : 'system'
    var dark = theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    if (dark) document.documentElement.classList.add('dark')
  } catch (e) {}
})()
`

// Runs before first paint to set the `dark` class and avoid a theme flash.
// React warns about script tags in components; this one is in the initial
// server-rendered <head>, so it does execute.
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} suppressHydrationWarning />
}
