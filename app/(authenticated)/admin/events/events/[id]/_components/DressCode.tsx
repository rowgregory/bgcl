import { Plus, Sparkles, Trash2 } from 'lucide-react'
import { inputCls, labelCls, sectionCls } from '@/lib/constants/form.constants'
import { SectionHeader } from './SectionHeader'

export function DressCode({ register, dressCodeArray }) {
  const items = dressCodeArray.fields

  return (
    <div className={sectionCls}>
      <SectionHeader icon={Sparkles} title="Dress Code" />

      <div className="p-5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
          <div>
            <label htmlFor="dresscode" className={labelCls}>
              Dress Code
            </label>
            <input
              id="dresscode"
              type="text"
              {...register('dresscode')}
              className={inputCls}
              placeholder="Cocktail Attire"
            />
          </div>

          <div>
            <label htmlFor="dressCodeHeadline" className={labelCls}>
              Headline
            </label>
            <input
              id="dressCodeHeadline"
              type="text"
              {...register('dressCodeHeadline')}
              className={inputCls}
              placeholder="Dress to Impress"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="dressCodeNote" className={labelCls}>
              Note
            </label>
            <input
              id="dressCodeNote"
              type="text"
              {...register('dressCodeNote')}
              className={inputCls}
              placeholder="Per venue policy: no jeans, t-shirts, or hats."
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="bestDressedPrizes" className={labelCls}>
              Best Dressed Prizes
            </label>
            <textarea
              id="bestDressedPrizes"
              {...register('bestDressedPrizes')}
              className={inputCls}
              rows={2}
              placeholder="Prizes will be awarded during the evening for best dressed."
            />
          </div>
        </div>

        <div className="pt-5 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className={labelCls}>Dress Code Items</span>
            <button
              type="button"
              onClick={() => dressCodeArray.append({ label: '', description: '' })}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3 h-3" aria-hidden="true" />
              Add Item
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-xs text-neutral-400 dark:text-neutral-600 italic py-2">No dress code items added yet.</p>
          ) : (
            <div className="space-y-3">
              {items.map((field, idx) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-2">
                    <input
                      type="text"
                      {...register(`dressCodeItems.${idx}.label`)}
                      aria-label={`Dress code item ${idx + 1} label`}
                      className={`${inputCls} min-w-0`}
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      {...register(`dressCodeItems.${idx}.description`)}
                      aria-label={`Dress code item ${idx + 1} description`}
                      className={`${inputCls} min-w-0`}
                      placeholder="Description"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => dressCodeArray.remove(idx)}
                    aria-label={`Remove dress code item ${idx + 1}`}
                    className="p-2 mt-0.5 text-neutral-400 hover:text-red-500 transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
