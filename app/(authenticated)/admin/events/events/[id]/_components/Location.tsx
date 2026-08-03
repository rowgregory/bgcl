import { MapPin } from 'lucide-react'
import { SectionHeader } from './SectionHeader'
import { inputCls, labelCls, sectionCls } from '@/lib/constants/form.constants'

export function Location({ register, errors }) {
  return (
    <div className={sectionCls}>
      <SectionHeader icon={MapPin} title="Location" />
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="location" className={labelCls}>
            Venue Name{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="location"
            type="text"
            {...register('location')}
            aria-invalid={!!errors.location}
            className={inputCls}
            placeholder="The Nahant Country Club"
          />
          {errors.location && (
            <p role="alert" className="mt-1 text-xs text-red-500">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="address" className={labelCls}>
            Full Address
          </label>
          <input
            id="address"
            type="text"
            {...register('address')}
            className={inputCls}
            placeholder="334 Nahant Rd, Nahant, MA 01908"
          />
        </div>
      </div>
    </div>
  )
}
