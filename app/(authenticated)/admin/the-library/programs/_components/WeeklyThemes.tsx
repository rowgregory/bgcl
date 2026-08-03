'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormContext } from 'react-hook-form'
import { Trash2, Save, AlertCircle } from 'lucide-react'
import { FormSwitch } from '@/components/_shared/FormSwitch'
import { createTheme } from '@/lib/actions/theme/createTheme'
import { deleteTheme } from '@/lib/actions/theme/deleteTheme'
import type { ProgramFormInput, ProgramTheme } from '@/lib/validations/program.validation'
import type { Theme } from '@prisma/client'

/** Re-numbers a theme list so `order` is always 1..n with no gaps. */
const reindex = (themes: ProgramTheme[]): ProgramTheme[] =>
  [...themes].sort((a, b) => a.order - b.order).map((t, i) => ({ ...t, order: i + 1 }))

type DraftTheme = { key: string; title: string; dates: string }

export function WeeklyThemes({ themes }: { themes: Theme[] }) {
  const router = useRouter()
  const { watch, setValue } = useFormContext<ProgramFormInput>()

  const showThemes = watch('showThemes')
  const programThemes = (watch('themes') ?? []) as ProgramTheme[]

  const [drafts, setDrafts] = useState<DraftTheme[]>([])
  const [themeError, setThemeError] = useState('')
  const [busy, setBusy] = useState(false)

  const setThemes = (next: ProgramTheme[]) => setValue('themes', reindex(next), { shouldDirty: true })

  // ── Attaching / detaching ───────────────────────────────────────────────────
  const attachTheme = (theme: Theme) => {
    setThemes([
      ...programThemes,
      { id: theme.id, title: theme.title, dates: theme.dates, order: programThemes.length + 1 }
    ])
  }

  const detachTheme = (id: string) => {
    setThemes(programThemes.filter((t) => t.id !== id))
  }

  /** Moves a theme to a new position, shifting the others around it. */
  const reorderTheme = (id: string, newOrder: number) => {
    const target = programThemes.find((t) => t.id === id)
    if (!target) return

    const next = programThemes.map((t) => {
      if (t.id === id) return { ...t, order: newOrder }
      if (t.order >= newOrder && t.order < target.order) return { ...t, order: t.order + 1 }
      if (t.order <= newOrder && t.order > target.order) return { ...t, order: t.order - 1 }
      return t
    })

    setThemes(next)
  }

  const handleCreateTheme = async (draft: DraftTheme) => {
    if (!draft.title.trim() || !draft.dates.trim()) {
      setThemeError('A theme needs both a title and dates.')
      return
    }

    setBusy(true)
    setThemeError('')

    try {
      const result = await createTheme({
        title: draft.title.trim(),
        dates: draft.dates.trim(),
        order: themes.length + 1
      })

      if (!result.success) {
        setThemeError(result.error ?? 'Failed to create theme')
        return
      }

      setDrafts((d) => d.filter((x) => x.key !== draft.key))
      router.refresh()
    } catch {
      setThemeError('Failed to create theme')
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteTheme = async (id: string) => {
    setBusy(true)
    setThemeError('')

    try {
      const result = await deleteTheme(id)

      if (!result.success) {
        setThemeError(result.error ?? 'Failed to delete theme')
        return
      }

      // Drop it from this program's snapshot too
      setThemes(programThemes.filter((t) => t.id !== id))
      router.refresh()
    } catch {
      setThemeError('Failed to delete theme')
    } finally {
      setBusy(false)
    }
  }

  const availableThemes = themes.filter((t) => !programThemes.some((pt) => pt.id === t.id))
  const sortedProgramThemes = [...programThemes].sort((a, b) => a.order - b.order)

  const panelCls = 'p-4 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg'
  const panelLabelCls =
    'block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3'

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Weekly Themes</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Add themed weeks to display on the program page
          </p>
        </div>
        <FormSwitch name="showThemes" label="Weekly Themes" />
      </div>

      {showThemes && (
        <div className="space-y-4">
          {themeError && (
            <p role="alert" className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              {themeError}
            </p>
          )}

          {/* ── Connected to this program ── */}
          <div className={panelCls}>
            <span className={panelLabelCls}>This Program&apos;s Themes</span>

            {sortedProgramThemes.length > 0 ? (
              <div className="space-y-2">
                {sortedProgramThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  >
                    <select
                      value={theme.order}
                      onChange={(e) => reorderTheme(theme.id, parseInt(e.target.value, 10))}
                      aria-label={`Position of ${theme.title}`}
                      className="w-14 px-2 py-1 text-sm text-center font-semibold rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      {programThemes.map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{theme.title}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{theme.dates}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => detachTheme(theme.id)}
                      aria-label={`Remove ${theme.title} from this program`}
                      className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-400 dark:text-neutral-500 italic">
                No themes connected to this program yet.
              </p>
            )}
          </div>

          {/* ── Add from library ── */}
          {themes.length > 0 && (
            <div className={panelCls}>
              <span className={panelLabelCls}>Add from Theme Library</span>

              {availableThemes.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => attachTheme(theme)}
                        className="flex-1 text-left"
                        aria-label={`Add ${theme.title} to this program`}
                      >
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{theme.title}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{theme.dates}</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteTheme(theme.id)}
                        disabled={busy}
                        aria-label={`Delete ${theme.title} from the library`}
                        className="p-1 bg-red-500/80 hover:bg-red-500 disabled:opacity-50 rounded text-white shrink-0"
                      >
                        <Trash2 className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-400 dark:text-neutral-500 italic">
                  All library themes are already added to this program.
                </p>
              )}
            </div>
          )}

          {/* ── Create new ── */}
          <div className={panelCls}>
            <div className="flex items-center justify-between mb-3">
              <span className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Create New Theme
              </span>
              <button
                type="button"
                onClick={() => setDrafts((d) => [...d, { key: crypto.randomUUID(), title: '', dates: '' }])}
                className="text-xs font-medium text-sky-600 hover:text-sky-500 transition-colors"
              >
                + Add Theme
              </button>
            </div>

            {drafts.length > 0 ? (
              <div className="space-y-3">
                {drafts.map((draft, index) => (
                  <div
                    key={draft.key}
                    className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-sm font-bold shrink-0">
                      {index + 1}
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Theme title"
                        value={draft.title}
                        onChange={(e) =>
                          setDrafts((d) => d.map((x) => (x.key === draft.key ? { ...x, title: e.target.value } : x)))
                        }
                        aria-label={`New theme ${index + 1} title`}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Dates (e.g. 6/22-6/26)"
                        value={draft.dates}
                        onChange={(e) =>
                          setDrafts((d) => d.map((x) => (x.key === draft.key ? { ...x, dates: e.target.value } : x)))
                        }
                        aria-label={`New theme ${index + 1} dates`}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleCreateTheme(draft)}
                        disabled={busy}
                        aria-label={`Save new theme ${index + 1}`}
                        className="p-2 text-neutral-400 hover:text-lime-500 disabled:opacity-50 transition-colors"
                      >
                        <Save className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDrafts((d) => d.filter((x) => x.key !== draft.key))}
                        aria-label={`Discard new theme ${index + 1}`}
                        className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-400 dark:text-neutral-500 italic">
                No new themes queued. Click &quot;+ Add Theme&quot; to create one.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
