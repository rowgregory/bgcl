import Link from 'next/link'
import { Download, Mail } from 'lucide-react'

export const ConfirmationActions = ({ isTicket }: { isTicket: boolean }) => (
  <div className="flex flex-col sm:flex-row gap-4">
    {isTicket ? (
      <div className="flex-1 px-6 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg flex items-center justify-center gap-2">
        <Mail className="w-4 h-4 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
        <span className="text-neutral-600 dark:text-neutral-400 font-medium text-sm">
          Check your email for confirmation
        </span>
      </div>
    ) : (
      <button
        type="button"
        onClick={() => window.print()}
        className="flex-1 px-6 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        Save Receipt
      </button>
    )}
    <Link
      href="/"
      className="flex-1 px-6 py-3 bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-semibold rounded-lg transition-all text-center"
    >
      Return Home
    </Link>
  </div>
)
