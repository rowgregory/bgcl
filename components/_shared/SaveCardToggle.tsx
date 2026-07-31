import { setInputs } from '@/lib/store/slices/formSlice'
import { store, useFormSelector } from '@/lib/store/store'
import { CreditCard } from 'lucide-react'
import { useSession } from 'next-auth/react'

export function SaveCardToggle({ formName }: { formName: string }) {
  const session = useSession()
  const isAuthed = session.status === 'authenticated'
  const { forms } = useFormSelector()
  const inputs = forms?.[formName]?.inputs
  const checked = !!inputs?.saveCard
  const usingExistingCard = !!inputs?.selectedCardId && !inputs?.useNewCard
  const isRecurring = inputs?.donationType === 'monthly' || inputs?.donationType === 'yearly'

  if (!isAuthed || usingExistingCard || isRecurring) return null

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => store.dispatch(setInputs({ formName, data: { saveCard: !checked } }))}
      className={`w-full flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 transition-all ${
        checked
          ? 'dark:bg-sky-500/10 dark:border-sky-500/50 bg-sky-500/10 border-sky-500/50'
          : 'dark:bg-zinc-800/50 dark:border-zinc-700/50 dark:hover:border-zinc-600/50 bg-neutral-100 border-neutral-200 hover:border-neutral-300'
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3 flex-1 text-left min-w-0">
        <CreditCard
          className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-colors ${
            checked ? 'dark:text-sky-400 text-sky-600' : 'dark:text-zinc-500 text-neutral-600'
          }`}
        />
        <div className="min-w-0 flex-1">
          <p
            className={`text-xs sm:text-sm font-medium truncate ${checked ? 'dark:text-white text-neutral-900' : 'dark:text-zinc-300 text-neutral-700'}`}
          >
            Save card for future payments
          </p>
          <p className="text-[10px] sm:text-xs dark:text-zinc-500 text-neutral-500 truncate">
            One-click checkout next time
          </p>
        </div>
      </div>

      {/* Switch Toggle */}
      <div
        className={`w-10 h-6 sm:w-12 sm:h-7 rounded-full relative shrink-0 border transition-colors ${
          checked
            ? 'dark:bg-sky-500 dark:border-sky-500 bg-sky-600 border-sky-600'
            : 'dark:bg-zinc-700 dark:border-zinc-600 bg-neutral-200 border-neutral-300'
        }`}
      >
        <div
          className={`w-4 h-4 sm:w-5 sm:h-5 -mt-px rounded-full absolute top-1 transition-all ${
            checked ? 'dark:bg-zinc-200 bg-white left-5 sm:left-6' : 'dark:bg-zinc-600 bg-neutral-400 left-1'
          }`}
        />
      </div>
    </button>
  )
}
