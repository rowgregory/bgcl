import { AlertCircle, CheckCircle2, Loader2, Save } from 'lucide-react'

export function BottomBar({ handleSave, saving, saveState }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 dark:bg-neutral-950/95 bg-white/95 backdrop-blur-sm border-t dark:border-neutral-800 border-neutral-200 px-4 sm:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-sm font-black dark:text-white text-neutral-900 tracking-tight">Hero Studio</h1>
            <p className="text-xs dark:text-neutral-500 text-neutral-400">Homepage hero configuration</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Save */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            aria-label={saving ? 'Saving...' : 'Save changes'}
            aria-busy={saving}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              saveState === 'success'
                ? 'bg-emerald-500 text-white'
                : saveState === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-linear-to-r from-sky-500 to-sky-600 hover:bg-sky-700 text-white'
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                <span>Saving...</span>
              </>
            ) : saveState === 'success' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Saved</span>
              </>
            ) : saveState === 'error' ? (
              <>
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Error</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
