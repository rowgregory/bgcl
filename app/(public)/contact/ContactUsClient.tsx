'use client'

import FacilityClosings from '@/components/_shared/FacilityClosings'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import InfoSidebar from './_components/InfoSidebar'
import ContactForm from './_components/ContactForm'
import VolunteerDrawer from '@/components/drawers/VolunteerDrawer'

export default function ContactUsClient({ closings, pageData, programs }) {
  const t = pageData?.sections?.contact
  const searchParams = useSearchParams()
  const subjectParam = searchParams.get('subject')

  const contactInfo = [
    {
      icon: Phone,
      label: t?.phone_label,
      value: t?.phone_value,
      href: t?.phone_href
    },
    {
      icon: Mail,
      label: t?.email_label,
      value: t?.email_value,
      href: t?.email_href
    },
    {
      icon: MapPin,
      label: t?.address_label,
      value: t?.address_value,
      href: t?.address_href
    }
  ]

  const hours = [
    { period: t?.hours_office_period, time: t?.hours_office_time },
    { period: t?.hours_programming_period, time: t?.hours_programming_time },
    { period: t?.hours_teen_period, time: t?.hours_teen_time }
  ]

  return (
    <>
      <VolunteerDrawer programs={programs} />

      <div className="dark:bg-neutral-950 bg-white">
        {/* Hero Section */}
        <main>
          <section aria-labelledby="contact-heading" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
            <div className="max-w-334 mx-auto space-y-12 sm:space-y-16">
              {/* Header */}
              <motion.div
                className="space-y-4 sm:space-y-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
                    {t?.eyebrow}
                  </p>
                  <h1
                    id="contact-heading"
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight"
                  >
                    {t?.heading}
                  </h1>
                  <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
                    {t?.subheading}
                  </p>
                </div>
              </motion.div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
                {/* Contact Form */}
                <ContactForm defaultSubject={subjectParam} />

                {/* Contact Info Sidebar */}
                <InfoSidebar contactInfo={contactInfo} hours={hours} />
              </div>
            </div>
          </section>

          {/* Closings Section */}
          <FacilityClosings closings={closings} />
        </main>
      </div>
    </>
  )
}
