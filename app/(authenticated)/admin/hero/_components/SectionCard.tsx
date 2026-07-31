export const SectionCard = ({
  icon: Icon,
  title,
  children,
  accent
}: {
  icon: any
  title: string
  children: React.ReactNode
  accent?: boolean
}) => (
  <div className="dark:bg-neutral-900 bg-white border dark:border-neutral-800 border-neutral-200 rounded-xl overflow-hidden">
    <div
      className={`flex items-center gap-3 px-5 py-4 border-b dark:border-neutral-800 border-neutral-100 ${accent ? 'dark:bg-sky-500/5 bg-sky-50/50' : ''}`}
    >
      <div className="w-7 h-7 rounded-lg dark:bg-neutral-800 bg-neutral-100 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 dark:text-sky-400 text-sky-600" aria-hidden="true" />
      </div>
      <h2 className="text-xs font-bold dark:text-white text-neutral-900 uppercase tracking-widest">{title}</h2>
    </div>
    <div className="p-5 space-y-5">{children}</div>
  </div>
)
