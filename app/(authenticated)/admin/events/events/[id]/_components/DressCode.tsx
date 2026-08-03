import { Plus, Sparkles, Trash2 } from 'lucide-react'
import { inputCls, labelCls, sectionCls } from '@/lib/constants/form.constants'
import { SectionHeader } from './SectionHeader'

export function DressCode({ register, dressCodeArray }) {
  return (
    <div className={sectionCls}>
      <SectionHeader icon={Sparkles} title="Dress Code" />
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dresscode" className={labelCls}>
              Dress Code
            </label>
            <input id="dresscode" type="text" {...register('dresscode')} className={inputCls} placeholder="Themed" />
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
              placeholder="Dress to Impress — or Just Have Fun!"
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
              placeholder="Per Venue: No jeans, t-shirts, or hats allowed."
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
              placeholder="Best Dressed Prizes will be awarded during the event..."
            />
          </div>
        </div>

        {/* Dress Code Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={labelCls}>Dress Code Items</span>
            <button
              type="button"
              onClick={() => dressCodeArray.append({ label: '', description: '' })}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" aria-hidden="true" /> Add Item
            </button>
          </div>

          <div className="space-y-2">
            {dressCodeArray.fields.map((field, idx) => (
              <div key={field.id} className="flex items-start gap-2">
                <input
                  type="text"
                  {...register(`dressCodeItems.${idx}.label`)}
                  aria-label={`Dress code item ${idx + 1} label`}
                  className={`${inputCls} w-1/3`}
                  placeholder="Label"
                />
                <input
                  type="text"
                  {...register(`dressCodeItems.${idx}.description`)}
                  aria-label={`Dress code item ${idx + 1} description`}
                  className={`${inputCls} flex-1`}
                  placeholder="Description"
                />
                <button
                  type="button"
                  onClick={() => dressCodeArray.remove(idx)}
                  aria-label={`Remove dress code item ${idx + 1}`}
                  className="p-2 text-neutral-400 hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ))}

            {dressCodeArray.fields.length === 0 && (
              <p className="text-xs text-neutral-400 dark:text-neutral-600 italic">No dress code items added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
