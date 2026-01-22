'use client'

import FacilityClosings from '@/app/components/FacilityClosings'
import ContactForm from '@/app/components/forms/ContactForm'
import { setOpenVolunteerDrawer } from '@/app/lib/store/slices/appSlice'
import { store } from '@/app/lib/store/store'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Heart, ArrowRight, Briefcase } from 'lucide-react'
import Link from 'next/link'

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '781-593-1772',
    href: 'tel:781-593-1772'
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@bgcl.org',
    href: 'mailto:info@bgcl.org'
  },
  {
    icon: MapPin,
    label: 'Address',
    value: '25 North Common Street\nLynn, MA 01902',
    href: "https://www.google.com/maps/place/Boy's+%26+Girl's+Club+of+Lynn/@42.4642936,-70.9540298,15z/"
  }
]

const hours = [
  { period: 'Office', time: '9am – 5pm' },
  { period: 'Programming', time: '1:45pm – 6pm' },
  { period: 'Teen Hours', time: '1:45pm – 8:30pm' }
]

export default function ContactUsPage() {
  return (
    <div className="dark:bg-neutral-950 bg-white">
      {/* Hero Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
                Get In Touch
              </p>
              <h1 className="text-5xl md:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
                Contact Us
              </h1>
              <p className="text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
                Fill out the form below if you'd like to get involved with the Boys & Girls Club of Lynn or if you have
                any questions. We'll get back to you as soon as possible.
              </p>
            </div>
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <ContactForm />

            {/* Contact Info Sidebar */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Contact Cards */}
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                return (
                  <a key={index} href={info.href} className="p-6 rounded-xl hover:border-sky-500/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg dark:bg-sky-500/10 bg-sky-100 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 dark:text-sky-400 text-sky-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider mb-1">
                          {info.label}
                        </h3>
                        <p className="dark:text-white text-neutral-900 font-semibold group-hover:dark:text-sky-400 group-hover:text-sky-600 transition-colors whitespace-pre-line">
                          {info.value}
                        </p>
                      </div>
                    </div>
                  </a>
                )
              })}

              {/* Hours Card */}
              <div className="dark:bg-neutral-900 bg-white dark:border-neutral-800 border-neutral-200 p-6 rounded-xl border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg dark:bg-sky-500/10 bg-sky-100 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 dark:text-sky-400 text-sky-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider mb-3">
                      Fall Hours
                    </h3>
                    <div className="space-y-2">
                      {hours.map((hour, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="dark:text-neutral-400 text-neutral-600">{hour.period}</span>
                          <span className="dark:text-white text-neutral-900 font-semibold">{hour.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Get Involved Card */}
              <div className="dark:bg-neutral-900 bg-white dark:border-neutral-800 border-neutral-200 p-6 rounded-xl border">
                <h3 className="text-sm font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider mb-4">
                  Get Involved
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => store.dispatch(setOpenVolunteerDrawer())}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg dark:bg-sky-500/10 bg-sky-50 dark:hover:bg-sky-500/20 hover:bg-sky-100 transition-colors group"
                  >
                    <Heart className="w-5 h-5 dark:text-sky-400 text-sky-600" />
                    <span className="dark:text-white text-neutral-900 font-medium">Become a Volunteer</span>
                    <ArrowRight className="w-4 h-4 dark:text-sky-400 text-sky-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <Link
                    href="/get-involved"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg dark:bg-indigo-500/10 bg-indigo-50 dark:hover:bg-indigo-500/20 hover:bg-indigo-100 transition-colors group"
                  >
                    <Briefcase className="w-5 h-5 dark:text-indigo-400 text-indigo-600" />
                    <span className="dark:text-white text-neutral-900 font-medium">Join Our Team</span>
                    <ArrowRight className="w-4 h-4 dark:text-indigo-400 text-indigo-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Closings Section */}
      <FacilityClosings />
    </div>
  )
}
