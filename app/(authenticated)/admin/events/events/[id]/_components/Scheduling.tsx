import { Calendar } from 'lucide-react'
import { SectionHeader } from './SectionHeader'
import { Controller } from 'react-hook-form'
import { inputCls, labelCls, sectionCls } from '@/lib/constants/form.constants'

export function Scheduling({ register, errors, control }) {
  return (
    <div className={sectionCls}>
      <SectionHeader icon={Calendar} title="Scheduling" />
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Date + Time write to the single `date` field (YYYY-MM-DDTHH:mm) */}
        <Controller
          control={control}
          name="date"
          render={({ field: { value, onChange } }) => {
            const [datePart = '', timePart = ''] = (value ?? '').split('T')

            return (
              <>
                <div className="col-span-2">
                  <label htmlFor="event-date" className={labelCls}>
                    Date{' '}
                    <span aria-hidden="true" className="text-red-500">
                      *
                    </span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <input
                    id="event-date"
                    type="date"
                    value={datePart}
                    onChange={(e) => onChange(`${e.target.value}T${timePart || '00:00'}`)}
                    aria-invalid={!!errors.date}
                    className={inputCls}
                  />
                  {errors.date && (
                    <p role="alert" className="mt-1 text-xs text-red-500">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="event-time" className={labelCls}>
                    Time{' '}
                    <span aria-hidden="true" className="text-red-500">
                      *
                    </span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <input
                    id="event-time"
                    type="time"
                    value={timePart}
                    onChange={(e) => onChange(`${datePart}T${e.target.value}`)}
                    disabled={!datePart}
                    className={`${inputCls} disabled:opacity-50`}
                  />
                </div>
              </>
            )
          }}
        />

        <div>
          <label htmlFor="duration" className={labelCls}>
            Duration{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="duration"
            type="text"
            {...register('duration')}
            aria-invalid={!!errors.duration}
            className={inputCls}
            placeholder="3 hours"
          />
          {errors.duration && (
            <p role="alert" className="mt-1 text-xs text-red-500">
              {errors.duration.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label htmlFor="ticketSalesStartDate" className={labelCls}>
            Ticket Sales Open
          </label>
          <input
            id="ticketSalesStartDate"
            type="datetime-local"
            {...register('ticketSalesStartDate')}
            className={inputCls}
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="ticketSalesEndDate" className={labelCls}>
            Ticket Sales Close
          </label>
          <input
            id="ticketSalesEndDate"
            type="datetime-local"
            {...register('ticketSalesEndDate')}
            className={inputCls}
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="registrationDeadline" className={labelCls}>
            Registration Deadline
          </label>
          <input
            id="registrationDeadline"
            type="datetime-local"
            {...register('registrationDeadline')}
            className={inputCls}
          />
        </div>
      </div>
    </div>
  )
}
