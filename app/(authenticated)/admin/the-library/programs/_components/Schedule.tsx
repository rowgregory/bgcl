'use client'

import { useFormContext, Controller } from 'react-hook-form'
import type { ProgramFormInput } from '@/lib/validations/program.validation'

const DROP_OFF_START = ['7:00am', '7:30am', '8:00am', '8:30am', '9:00am', '9:30am', '10:00am']
const DROP_OFF_END = ['7:30am', '8:00am', '8:30am', '9:00am', '9:30am', '10:00am', '10:30am', '11:00am']
const PICK_UP_START = ['3:00pm', '4:00pm', '5:00pm', '6:00pm']
const PICK_UP_END = ['3:30pm', '4:30pm', '5:30pm', '6:30pm']

/**
 * A row of time options bound to a single form field. Clicking the selected
 * option again clears it.
 */
function TimePicker({
  name,
  label,
  options
}: {
  name: 'dropOffStart' | 'dropOffEnd' | 'pickUpStart' | 'pickUpEnd'
  label: string
  options: string[]
}) {
  const { control } = useFormContext<ProgramFormInput>()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mb-2 block">{label}</span>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
            {options.map((time) => {
              const isSelected = value === time

              return (
                <button
                  key={`${name}-${time}`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onChange(isSelected ? '' : time)}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'bg-sky-600 text-white'
                      : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400'
                  }`}
                >
                  {time}
                </button>
              )
            })}
          </div>
        </div>
      )}
    />
  )
}

export default function Schedule() {
  return (
    <div className="mb-8 gap-4">
      <div className="mb-8 space-y-4">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Schedule</h3>

        <div>
          <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Drop-Off Times</span>
          <div className="space-y-3">
            <TimePicker name="dropOffStart" label="Start" options={DROP_OFF_START} />
            <TimePicker name="dropOffEnd" label="End" options={DROP_OFF_END} />
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Pick-Up Times</span>
          <div className="space-y-3">
            <TimePicker name="pickUpStart" label="Start" options={PICK_UP_START} />
            <TimePicker name="pickUpEnd" label="End" options={PICK_UP_END} />
          </div>
        </div>
      </div>
    </div>
  )
}
