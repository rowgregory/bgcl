'use client'

import { setCloseCapitalCampaignDrawer } from '@/app/lib/store/slices/appSlice'
import { store, useApplicationSelector } from '@/app/lib/store/store'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function CapitalCampaignDrawer() {
  const { capitalCampaignDrawer } = useApplicationSelector()
  const onClose = () => store.dispatch(setCloseCapitalCampaignDrawer())

  return (
    <AnimatePresence>
      {capitalCampaignDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full md:w-150 lg:w-175 dark:bg-neutral-950 bg-white z-50 overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 dark:bg-neutral-900 bg-neutral-50 border-b dark:border-neutral-800 border-neutral-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-black dark:text-white text-neutral-900">Capital Campaign</h2>
              <button
                onClick={onClose}
                className="p-2 dark:hover:bg-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 dark:text-neutral-400 text-neutral-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Hero Section */}
              <div className="space-y-4">
                <div className="relative h-64 rounded-lg overflow-hidden dark:bg-neutral-800 bg-neutral-100">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/VIDEO_ID"
                    title="Capital Campaign"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-4">
                <h3 className="text-3xl font-black dark:text-white text-neutral-900">
                  Building Our Future: $18M Capital Campaign
                </h3>
                <p className="text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                  We are excited to announce a transformative $18 million capital campaign to expand and enhance our
                  facility. This project will create state-of-the-art spaces that will enable us to serve hundreds more
                  youth in our community.
                </p>
              </div>

              {/* Campaign Goals */}
              <div className="space-y-4">
                <h4 className="text-2xl font-bold dark:text-white text-neutral-900">Campaign Goals</h4>
                <div className="space-y-3">
                  {[
                    {
                      title: 'Olympic-Size Pool',
                      description: 'A new aquatics center for swim lessons, water safety, and competitive programs'
                    },
                    {
                      title: 'Expanded Gymnasium',
                      description: 'Multiple courts for basketball, volleyball, and other indoor sports'
                    },
                    {
                      title: 'STEM Innovation Lab',
                      description: 'State-of-the-art facilities for robotics, coding, and hands-on learning'
                    },
                    {
                      title: 'Performance Theater',
                      description: 'A professional venue for arts, music, and community events'
                    },
                    {
                      title: 'Enhanced Game Room',
                      description: 'Expanded space for recreation and social activities'
                    },
                    {
                      title: 'Commercial Kitchen',
                      description: 'Modern facility for meal preparation and nutrition education'
                    }
                  ].map((goal, index) => (
                    <div
                      key={index}
                      className="dark:bg-neutral-900/50 bg-neutral-50 rounded-lg p-4 border dark:border-neutral-800 border-neutral-200"
                    >
                      <h5 className="font-bold dark:text-sky-400 text-sky-600 mb-1">{goal.title}</h5>
                      <p className="text-sm dark:text-neutral-400 text-neutral-600">{goal.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h4 className="text-2xl font-bold dark:text-white text-neutral-900">Project Timeline</h4>
                <div className="space-y-3">
                  {[
                    { date: 'Phase 1 - Complete', description: '$6.4M renovation (Completed)' },
                    { date: 'Phase 2 - June 2025 - Sept 2026', description: '$18M capital project (Planned)' },
                    { date: 'Operational', description: 'Full facility opening expected September 2026' }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="dark:bg-neutral-900/50 bg-neutral-50 rounded-lg p-4 border dark:border-neutral-800 border-neutral-200"
                    >
                      <p className="font-bold dark:text-sky-400 text-sky-600 text-sm mb-1">{item.date}</p>
                      <p className="dark:text-neutral-300 text-neutral-700">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact */}
              <div className="space-y-4">
                <h4 className="text-2xl font-bold dark:text-white text-neutral-900">Expected Impact</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { number: '500+', label: 'Additional Youth Served Annually' },
                    { number: '2,000+', label: 'Total Members by 2027' },
                    { number: '50+', label: 'New Staff Positions' },
                    { number: '$40M+', label: 'Annual Economic Impact' }
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="dark:bg-sky-500/10 bg-sky-100/30 rounded-lg p-4 border dark:border-sky-500/20 border-sky-300/30 text-center"
                    >
                      <p className="text-2xl font-black dark:text-sky-400 text-sky-600">{stat.number}</p>
                      <p className="text-xs dark:text-neutral-400 text-neutral-600 mt-2">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support Campaign */}
              <div className="space-y-4">
                <h4 className="text-2xl font-bold dark:text-white text-neutral-900">Support This Campaign</h4>
                <p className="dark:text-neutral-300 text-neutral-700">
                  We invite you to join us in building a brighter future for youth in Lynn. Your donation will directly
                  support the expansion of our facility and programs.
                </p>
                <button className="w-full px-6 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors">
                  Donate Now
                </button>
              </div>

              {/* Contact */}
              <div className="dark:bg-neutral-900/50 bg-neutral-50 rounded-lg p-6 border dark:border-neutral-800 border-neutral-200 space-y-4">
                <h4 className="font-bold dark:text-white text-neutral-900">Questions About the Campaign?</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold dark:text-neutral-400 text-neutral-600">Phone:</span>
                    <a
                      href="tel:781-593-1772"
                      className="dark:text-sky-400 text-sky-600 hover:dark:text-sky-300 hover:text-sky-700 ml-2"
                    >
                      (781) 593-1772
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold dark:text-neutral-400 text-neutral-600">Email:</span>
                    <a
                      href="mailto:development@bgcl.org"
                      className="dark:text-sky-400 text-sky-600 hover:dark:text-sky-300 hover:text-sky-700 ml-2"
                    >
                      development@bgcl.org
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
