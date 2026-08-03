import { Users } from 'lucide-react'
import { inputCls, labelCls, sectionCls } from '@/lib/constants/form.constants'
import { SectionHeader } from './SectionHeader'

export function Capacity({ errors, register }) {
  return (
    <div className={sectionCls}>
      <SectionHeader icon={Users} title="Capacity" />
      <div className="p-5 grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="capacity" className={labelCls}>
            Capacity{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="capacity"
            type="number"
            min={1}
            {...register('capacity')}
            aria-invalid={!!errors.capacity}
            className={inputCls}
            placeholder="200"
          />
          {errors.capacity && (
            <p role="alert" className="mt-1 text-xs text-red-500">
              {errors.capacity.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="maxAttendees" className={labelCls}>
            Max Attendees
          </label>
          <input
            id="maxAttendees"
            type="number"
            min={1}
            {...register('maxAttendees')}
            aria-invalid={!!errors.maxAttendees}
            className={inputCls}
            placeholder="Optional override"
          />
          {errors.maxAttendees && (
            <p role="alert" className="mt-1 text-xs text-red-500">
              {errors.maxAttendees.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
