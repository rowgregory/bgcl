import { Tag } from 'lucide-react'
import { inputCls, labelCls, sectionCls } from '@/lib/constants/form.constants'
import { SectionHeader } from './SectionHeader'

export function EventDetails({ register, errors }) {
  return (
    <div className={sectionCls}>
      <SectionHeader icon={Tag} title="Event Details" />
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="title" className={labelCls}>
            Title{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            aria-invalid={!!errors.title}
            className={inputCls}
            placeholder="Cash Madness Casino Night"
          />
          {errors.title && (
            <p role="alert" className="mt-1 text-xs text-red-500">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="tagline" className={labelCls}>
            Tagline
          </label>
          <input
            id="tagline"
            type="text"
            {...register('tagline')}
            className={inputCls}
            placeholder="Join Us For Our Send a Kid to Camp"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="subtitle" className={labelCls}>
            Subtitle
          </label>
          <input
            id="subtitle"
            type="text"
            {...register('subtitle')}
            className={inputCls}
            placeholder="Viva Las Vegas"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className={labelCls}>
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            className={inputCls}
            rows={3}
            placeholder="Event description..."
          />
        </div>

        <div>
          <label htmlFor="category" className={labelCls}>
            Category{' '}
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="category"
            type="text"
            {...register('category')}
            aria-invalid={!!errors.category}
            className={inputCls}
            placeholder="Fundraiser"
          />
          {errors.category && (
            <p role="alert" className="mt-1 text-xs text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="type" className={labelCls}>
            Type
          </label>
          <select id="type" {...register('type')} className={inputCls}>
            <option value="IN_PERSON">In Person</option>
            <option value="VIRTUAL">Virtual</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>

        <div>
          <label htmlFor="host" className={labelCls}>
            Host
          </label>
          <input
            id="host"
            type="text"
            {...register('host')}
            className={inputCls}
            placeholder="Boys &amp; Girls Club of Lynn"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="missionStatement" className={labelCls}>
            Mission Statement
          </label>
          <textarea
            id="missionStatement"
            {...register('missionStatement')}
            className={inputCls}
            rows={2}
            placeholder="To inspire and enable all young people..."
          />
        </div>

        <div>
          <label htmlFor="requirements" className={labelCls}>
            Requirements
          </label>
          <input
            id="requirements"
            type="text"
            {...register('requirements')}
            className={inputCls}
            placeholder="21+ Only"
          />
        </div>

        <div>
          <label htmlFor="materials" className={labelCls}>
            Materials
          </label>
          <input
            id="materials"
            type="text"
            {...register('materials')}
            className={inputCls}
            placeholder="Business Cards"
          />
        </div>

        <div>
          <label htmlFor="registrationUrl" className={labelCls}>
            Registration URL
          </label>
          <input
            id="registrationUrl"
            type="text"
            {...register('registrationUrl')}
            className={inputCls}
            placeholder="https://..."
          />
        </div>

        <div>
          <label htmlFor="meetingUrl" className={labelCls}>
            Meeting URL
          </label>
          <input
            id="meetingUrl"
            type="text"
            {...register('meetingUrl')}
            className={inputCls}
            placeholder="https://zoom.us/..."
          />
        </div>
      </div>
    </div>
  )
}
