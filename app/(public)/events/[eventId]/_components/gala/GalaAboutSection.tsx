import { useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Eyebrow } from './Eyebrow'
import { Check } from 'lucide-react'
import Picture from '@/components/_shared/Picture'
import { EASE, riseUp, stagger } from '@/lib/constants/motion'

export function GalaAboutSection({ event }) {
  const reduced = useReducedMotion()

  const aboutRef = useRef<HTMLElement>(null)

  // The portrait counter-drifts against the column beside it
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ['start end', 'end start']
  })
  const portraitY = useTransform(aboutProgress, [0, 1], ['6%', '-6%'])

  return (
    <section ref={aboutRef} id="about" className="mx-auto max-w-325 px-5 sm:px-8 scroll-mt-8 py-20 lg:py-28">
      <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <motion.div variants={riseUp}>
            <Eyebrow>About this event</Eyebrow>
          </motion.div>

          {event.tagline && (
            <motion.h2 variants={riseUp} className="mt-6 text-4xl font-bold leading-[1.15] sm:text-5xl">
              {event.tagline}
            </motion.h2>
          )}

          <motion.p
            variants={riseUp}
            className="mt-6 max-w-xl whitespace-pre-wrap text-base leading-relaxed text-white/60"
          >
            {event.description}
          </motion.p>

          {event.highlights?.length > 0 && (
            <motion.ul variants={riseUp} className="mt-8 space-y-3">
              {event.highlights.map((h: string) => (
                <li key={h} className="flex items-start gap-3 text-[15px] text-white/85">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </motion.ul>
          )}

          {(event.dressCodeHeadline || event.dressCodeItems?.length > 0) && (
            <motion.div variants={riseUp} className="mt-10 border-t border-white/10 pt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                {event.dressCodeHeadline || 'What to wear'}
              </p>

              {event.dressCodeItems?.length > 0 && (
                <ul className="mt-5 space-y-4">
                  {event.dressCodeItems.map((d) => (
                    <li key={d.label} className="flex gap-3">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                      <div>
                        <p className="text-[15px] font-medium">{d.label}</p>
                        {d.description && <p className="text-sm text-white/55">{d.description}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {event.dressCodeNote && <p className="mt-5 text-sm italic text-white/45">{event.dressCodeNote}</p>}
            </motion.div>
          )}
        </motion.div>

        {/* Guest speaker portrait, counter-drifting against the column */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="relative mx-auto w-full max-w-md lg:sticky lg:top-8 lg:max-w-none"
        >
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-8 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(155,27,60,0.28), transparent 68%)' }}
            aria-hidden="true"
          />
          <motion.div style={reduced ? undefined : { y: portraitY }}>
            <Picture
              src="/images/adam.jpeg"
              alt="Adam Vinatieri, special guest speaker"
              width={900}
              height={1350}
              className="relative w-full rounded-xl border border-white/10 shadow-2xl shadow-black/60"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
