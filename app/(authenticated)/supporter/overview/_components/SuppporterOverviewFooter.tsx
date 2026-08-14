export function SupporterOverviewFooter() {
  return (
    <footer className="px-6 md:px-8 lg:px-12 py-6 border-t dark:border-neutral-800 border-neutral-200 mt-16">
      <div className="max-w-334 mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs dark:text-neutral-600 text-neutral-400">
          © {new Date().getFullYear()}&nbsp; Boys &amp; Girls Club of Lynn. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="mailto:info@bgcl.org"
            className="text-xs dark:text-neutral-600 text-neutral-400 hover:dark:text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            info@bgcl.org
          </a>
          <span className="dark:text-neutral-800 text-neutral-300" aria-hidden="true">
            ·
          </span>

          <a
            href="tel:781-593-1772"
            className="text-xs dark:text-neutral-600 text-neutral-400 hover:dark:text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            (781) 593-1772
          </a>
        </div>
      </div>
    </footer>
  )
}
