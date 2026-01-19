import { FC } from 'react'
import Link from 'next/link'

interface ISubNavLink {
  handleNav: () => void
  item: { linkKey: string; textKey: string; isActive: boolean }
}

const SubNavLink: FC<ISubNavLink> = ({ handleNav, item }) => {
  return (
    <Link
      onClick={handleNav}
      href={item.linkKey}
      key={item.textKey}
      className={`text-[10px] xs:text-xs sm:text-sm font-medium transition-all duration-200 relative group whitespace-nowrap px-1.5 xs:px-2 py-1 rounded touch-manipulation shrink-0 ${
        item.isActive
          ? 'dark:text-white dark:bg-linear-to-r dark:from-sky-500/10 dark:to-sky-600/10 dark:border dark:border-sky-500/20 text-sky-700 bg-linear-to-r from-sky-100 to-sky-100 border border-sky-400/50'
          : 'dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800/30 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/30'
      }`}
    >
      {item.textKey}

      <div
        className={`absolute -bottom-3 sm:-bottom-4 left-0 right-0 h-0.5 bg-linear-to-r from-sky-500 to-sky-600 transition-transform hidden sm:block ${
          item.isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      ></div>

      {item.isActive && (
        <div className="absolute -top-0.5 xs:-top-1 -right-0.5 xs:-right-1 w-1.5 h-1.5 xs:w-2 xs:h-2 bg-linear-to-r from-sky-500 to-sky-600 rounded-full sm:hidden"></div>
      )}
    </Link>
  )
}

export default SubNavLink
