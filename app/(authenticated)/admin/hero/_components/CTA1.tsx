import { ExternalLink, Link2 } from 'lucide-react'
import { Field } from './Field'

export function CTA1({ form, set }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider">Button 1</p>
      <div className="grid grid-cols-2 gap-4">
        <Field
          id="hero-cta1-text"
          label="Text"
          value={form.cta1Text ?? ''}
          onChange={(v) => set('cta1Text', v)}
          placeholder="Get Started"
        />
        <Field
          id="hero-cta1-link"
          label="Link"
          value={form.cta1Link ?? ''}
          onChange={(v) => set('cta1Link', v)}
          placeholder="/donate"
        />
      </div>
      <div className="flex items-center gap-1 p-1 dark:bg-neutral-800 bg-neutral-100 rounded-lg w-fit">
        {(
          [
            { value: 'internal', icon: Link2, label: 'Internal' },
            { value: 'external', icon: ExternalLink, label: 'External' }
          ] as const
        ).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => set('cta1LinkType', opt.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
              form.cta1LinkType === opt.value
                ? 'dark:bg-neutral-700 bg-white shadow dark:text-white text-neutral-900'
                : 'dark:text-neutral-500 text-neutral-500 hover:dark:text-neutral-300'
            }`}
          >
            <opt.icon className="w-3.5 h-3.5" aria-hidden="true" />
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
