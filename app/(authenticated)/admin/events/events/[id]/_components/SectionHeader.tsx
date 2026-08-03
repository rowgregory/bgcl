import { sectionHeaderCls } from '@/lib/constants/form.constants'

export function SectionHeader({ icon: Icon, title, action }: { icon: any; title: string; action?: React.ReactNode }) {
  return (
    <div className={sectionHeaderCls}>
      <Icon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
      <span className="text-sm font-semibold text-neutral-900 dark:text-white flex-1">{title}</span>
      {action}
    </div>
  )
}
