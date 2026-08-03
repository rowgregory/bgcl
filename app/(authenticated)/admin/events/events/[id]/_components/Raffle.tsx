import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Shuffle, Trash2 } from 'lucide-react'
import { SectionHeader } from './SectionHeader'
import { FormSwitch } from '@/components/_shared/FormSwitch'
import { inputCls, labelCls, sectionCls } from '@/lib/constants/form.constants'

export function Raffle({ watchedIsRaffle, register, errors, rafflePrizeArray, raffleScheduleArray }) {
  return (
    <AnimatePresence>
      {watchedIsRaffle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={sectionCls}
        >
          <SectionHeader icon={Shuffle} title="Raffle Configuration" />
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="raffleDrawDate" className={labelCls}>
                  Draw Date
                </label>
                <input id="raffleDrawDate" type="datetime-local" {...register('raffleDrawDate')} className={inputCls} />
              </div>

              <div>
                <label htmlFor="raffleTicketsPerOrder" className={labelCls}>
                  Tickets Per Order
                </label>
                <input
                  id="raffleTicketsPerOrder"
                  type="number"
                  min={1}
                  {...register('raffleTicketsPerOrder')}
                  aria-invalid={!!errors.raffleTicketsPerOrder}
                  className={inputCls}
                />
                {errors.raffleTicketsPerOrder && (
                  <p role="alert" className="mt-1 text-xs text-red-500">
                    {errors.raffleTicketsPerOrder.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="raffleTicketPrice" className={labelCls}>
                  Ticket Price Label
                </label>
                <input
                  id="raffleTicketPrice"
                  type="text"
                  {...register('raffleTicketPrice')}
                  className={inputCls}
                  placeholder="$100 Value"
                />
              </div>

              <div>
                <label htmlFor="raffleGrandPrizeLabel" className={labelCls}>
                  Grand Prize Label
                </label>
                <input
                  id="raffleGrandPrizeLabel"
                  type="text"
                  {...register('raffleGrandPrizeLabel')}
                  className={inputCls}
                  placeholder="$10,000"
                />
              </div>

              <div>
                <label htmlFor="raffleOddsLabel" className={labelCls}>
                  Odds Label
                </label>
                <input
                  id="raffleOddsLabel"
                  type="text"
                  {...register('raffleOddsLabel')}
                  className={inputCls}
                  placeholder="1:50 chance"
                />
              </div>

              <div className="flex items-end">
                <FormSwitch name="showRaffleTicketNumbers" label="Show Ticket Numbers" />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="raffleTerms" className={labelCls}>
                  Raffle Terms
                </label>
                <textarea
                  id="raffleTerms"
                  {...register('raffleTerms')}
                  className={inputCls}
                  rows={3}
                  placeholder="Terms and conditions..."
                />
              </div>
            </div>

            {/* Raffle Prizes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={labelCls}>Prizes</span>
                <button
                  type="button"
                  onClick={() => rafflePrizeArray.append({ place: '', amount: '' })}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" aria-hidden="true" /> Add Prize
                </button>
              </div>

              <div className="space-y-2">
                {rafflePrizeArray.fields.map((field, idx) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      {...register(`rafflePrizes.${idx}.place`)}
                      aria-label={`Prize ${idx + 1} place`}
                      className={`${inputCls} w-1/3`}
                      placeholder="1st Place"
                    />
                    <input
                      type="text"
                      {...register(`rafflePrizes.${idx}.amount`)}
                      aria-label={`Prize ${idx + 1} amount`}
                      className={`${inputCls} flex-1`}
                      placeholder="$5,000"
                    />
                    <button
                      type="button"
                      onClick={() => rafflePrizeArray.remove(idx)}
                      aria-label={`Remove prize ${idx + 1}`}
                      className="p-2 text-neutral-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}

                {rafflePrizeArray.fields.length === 0 && (
                  <p className="text-xs text-neutral-400 dark:text-neutral-600 italic">No prizes added yet.</p>
                )}
              </div>
            </div>

            {/* Raffle Schedule */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={labelCls}>Event Schedule</span>
                <button
                  type="button"
                  onClick={() => raffleScheduleArray.append({ time: '', label: '' })}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" aria-hidden="true" /> Add Item
                </button>
              </div>

              <div className="space-y-2">
                {raffleScheduleArray.fields.map((field, idx) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      {...register(`raffleSchedule.${idx}.time`)}
                      aria-label={`Schedule item ${idx + 1} time`}
                      className={`${inputCls} w-1/3`}
                      placeholder="6:00 PM"
                    />
                    <input
                      type="text"
                      {...register(`raffleSchedule.${idx}.label`)}
                      aria-label={`Schedule item ${idx + 1} label`}
                      className={`${inputCls} flex-1`}
                      placeholder="Doors Open"
                    />
                    <button
                      type="button"
                      onClick={() => raffleScheduleArray.remove(idx)}
                      aria-label={`Remove schedule item ${idx + 1}`}
                      className="p-2 text-neutral-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}

                {raffleScheduleArray.fields.length === 0 && (
                  <p className="text-xs text-neutral-400 dark:text-neutral-600 italic">No schedule items added yet.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
