const linkCls = 'hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors'

export function SupporterFooter() {
  return (
    <footer className="mt-auto px-6 lg:px-8 h-12 flex items-center border-t border-neutral-200 dark:border-neutral-800">
      <div className="w-full max-w-3xl mx-auto flex items-center justify-between gap-4 text-xs text-neutral-400 dark:text-neutral-600">
        <p className="truncate">© {new Date().getFullYear()} Boys &amp; Girls Club of Lynn</p>

        <div className="flex items-center gap-3 shrink-0">
          <a href="mailto:info@bgcl.org" className={linkCls + ' hidden sm:inline'}>
            info@bgcl.org
          </a>
          <a href="tel:781-593-1772" className={linkCls + ' tabular-nums'}>
            (781) 593-1772
          </a>
        </div>
      </div>
    </footer>
  )
}
