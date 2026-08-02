'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, CheckCircle } from 'lucide-react'
import VolunteerForm from '../forms/VolunteerForm'
import { useState } from 'react'
import { useVolunteerDrawer } from '@/stores/drawers'

const benefits = [
  "Make a direct impact on young people's lives",
  'Flexible scheduling to fit your availability',
  'Meaningful community engagement',
  'Develop leadership and mentoring skills',
  'Join a passionate team of volunteers'
]

const steps = [
  {
    title: 'Complete Application',
    description: 'Fill out our volunteer application form with your information and interests.'
  },
  {
    title: 'Background Check',
    description: 'All volunteers must undergo a background check for the safety of our youth.'
  },
  {
    title: 'Orientation',
    description: 'Attend a brief orientation to learn about our programs and expectations.'
  },
  {
    title: 'Start Volunteering',
    description: 'Begin your volunteer journey and make a difference in our community!'
  }
]

export default function VolunteerDrawer({ programs }) {
  const { isOpen } = useVolunteerDrawer()
  const onClose = () => useVolunteerDrawer.getState().close()
  const [activeTab, setActiveTab] = useState<'info' | 'form'>('info')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-110 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-6xl dark:bg-neutral-950 bg-white z-120 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 dark:bg-neutral-900 bg-neutral-50 border-b dark:border-neutral-800 border-neutral-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-black dark:text-white text-neutral-900 flex items-center gap-2">
                <Heart className="w-6 h-6 dark:text-sky-400 text-sky-600" />
                Volunteer
              </h2>
              <button
                onClick={onClose}
                className="p-2 dark:hover:bg-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 dark:text-neutral-400 text-neutral-600" />
              </button>
            </div>

            {/* Tabs - visible on mobile only */}
            <div className="md:hidden sticky top-16 dark:bg-neutral-900/50 bg-neutral-100/50 border-b dark:border-neutral-800 border-neutral-200 flex gap-0 px-6">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-3 font-semibold text-sm transition-all border-b-2 ${
                  activeTab === 'info'
                    ? 'dark:border-sky-500 dark:text-sky-400 border-sky-600 text-sky-600'
                    : 'dark:border-transparent dark:text-neutral-400 border-transparent text-neutral-600'
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab('form')}
                className={`flex-1 py-3 font-semibold text-sm transition-all border-b-2 ${
                  activeTab === 'form'
                    ? 'dark:border-sky-500 dark:text-sky-400 border-sky-600 text-sky-600'
                    : 'dark:border-transparent dark:text-neutral-400 border-transparent text-neutral-600'
                }`}
              >
                Apply
              </button>
            </div>

            {/* Content Container */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Content - hidden on mobile, visible on md+ */}
              <div className="hidden md:flex flex-1 overflow-y-auto pr-4">
                <div className="p-6 space-y-8 max-w-xl ">
                  {/* Hero Text */}
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black dark:text-white text-neutral-900">
                      Interested in Becoming a Volunteer?
                    </h3>
                    <p className="text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                      At the Boys & Girls Club of Lynn, we understand where every kid is coming from and where they can
                      go – and have trained youth development professionals who can help them get there. If you are over
                      18 with a passion for our community's youth, we invite you to join us and help build great futures
                      for the kids we serve on a daily basis.
                    </p>
                    <p className="text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                      Please note that all Boys & Girls Club volunteers must undergo a background check.
                    </p>
                  </div>

                  {/* Benefits Section */}
                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold dark:text-white text-neutral-900">Why Volunteer?</h4>
                    <div className="space-y-3">
                      {benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="w-5 h-5 dark:text-sky-400 text-sky-600 shrink-0 mt-0.5" />
                          <p className="dark:text-neutral-300 text-neutral-700">{benefit}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Steps Section */}
                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold dark:text-white text-neutral-900">How to Get Started</h4>
                    <div className="space-y-3">
                      {steps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="dark:bg-neutral-900/50 bg-neutral-50 rounded-lg p-4 border dark:border-neutral-800 border-neutral-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 dark:bg-sky-600 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-bold dark:text-white text-neutral-900 mb-1">{step.title}</h5>
                              <p className="text-sm dark:text-neutral-400 text-neutral-600">{step.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements Section */}
                  <div className="dark:bg-neutral-900/50 bg-neutral-50 rounded-xl p-6 border dark:border-neutral-800 border-neutral-200 space-y-4">
                    <h4 className="text-xl font-bold dark:text-white text-neutral-900">Requirements</h4>
                    <ul className="space-y-2 text-sm dark:text-neutral-300 text-neutral-700">
                      <li className="flex items-start gap-2">
                        <span className="dark:text-sky-400 text-sky-600 font-bold">•</span>
                        Must be 18 years or older
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="dark:text-sky-400 text-sky-600 font-bold">•</span>
                        Must pass a background check
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="dark:text-sky-400 text-sky-600 font-bold">•</span>
                        Passion for working with youth
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="dark:text-sky-400 text-sky-600 font-bold">•</span>
                        Reliable and committed to the program
                      </li>
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div className="dark:bg-neutral-900/50 bg-neutral-50 rounded-lg p-4 border dark:border-neutral-800 border-neutral-200 text-center space-y-2">
                    <p className="text-sm dark:text-neutral-400 text-neutral-600">Questions? Contact us:</p>

                    <a
                      href="mailto:info@bgcl.org"
                      className="dark:text-sky-400 text-sky-600 hover:dark:text-sky-300 hover:text-sky-700 font-semibold text-sm transition-colors"
                    >
                      info@bgcl.org
                    </a>
                  </div>
                </div>
              </div>

              {/* Mobile Tab Content - Info Tab */}
              {activeTab === 'info' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="md:hidden max-w-2xl mx-auto flex-1 overflow-y-auto px-6 py-6"
                >
                  <div className="space-y-8 w-full">
                    {/* Hero Text */}
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black dark:text-white text-neutral-900">
                        Interested in Becoming a Volunteer?
                      </h3>
                      <p className="text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                        At the Boys & Girls Club of Lynn, we understand where every kid is coming from and where they
                        can go – and have trained youth development professionals who can help them get there. If you
                        are over 18 with a passion for our community's youth, we invite you to join us and help build
                        great futures for the kids we serve on a daily basis.
                      </p>
                      <p className="text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                        Please note that all Boys & Girls Club volunteers must undergo a background check.
                      </p>
                    </div>

                    {/* Benefits Section */}
                    <div className="space-y-4">
                      <h4 className="text-2xl font-bold dark:text-white text-neutral-900">Why Volunteer?</h4>
                      <div className="space-y-3">
                        {benefits.map((benefit, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle className="w-5 h-5 dark:text-sky-400 text-sky-600 shrink-0 mt-0.5" />
                            <p className="dark:text-neutral-300 text-neutral-700">{benefit}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Steps Section */}
                    <div className="space-y-4">
                      <h4 className="text-2xl font-bold dark:text-white text-neutral-900">How to Get Started</h4>
                      <div className="space-y-3">
                        {steps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="dark:bg-neutral-900/50 bg-neutral-50 rounded-lg p-4 border dark:border-neutral-800 border-neutral-200"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 dark:bg-sky-600 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-bold dark:text-white text-neutral-900 mb-1">{step.title}</h5>
                                <p className="text-sm dark:text-neutral-400 text-neutral-600">{step.description}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Requirements Section */}
                    <div className="dark:bg-neutral-900/50 bg-neutral-50 rounded-xl p-6 border dark:border-neutral-800 border-neutral-200 space-y-4">
                      <h4 className="text-xl font-bold dark:text-white text-neutral-900">Requirements</h4>
                      <ul className="space-y-2 text-sm dark:text-neutral-300 text-neutral-700">
                        <li className="flex items-start gap-2">
                          <span className="dark:text-sky-400 text-sky-600 font-bold">•</span>
                          Must be 18 years or older
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="dark:text-sky-400 text-sky-600 font-bold">•</span>
                          Must pass a background check
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="dark:text-sky-400 text-sky-600 font-bold">•</span>
                          Passion for working with youth
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="dark:text-sky-400 text-sky-600 font-bold">•</span>
                          Reliable and committed to the program
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => setActiveTab('form')}
                      className="block md:hidden w-full py-3 dark:bg-sky-600 dark:hover:bg-sky-700 dark:disabled:bg-neutral-700 bg-sky-600 hover:bg-sky-700 disabled:bg-neutral-400 text-white font-bold rounded-lg transition-colors"
                    >
                      Apply
                    </button>

                    {/* Contact Info */}
                    <div className="dark:bg-neutral-900/50 bg-neutral-50 rounded-lg p-4 border dark:border-neutral-800 border-neutral-200 text-center space-y-2">
                      <p className="text-sm dark:text-neutral-400 text-neutral-600">Questions? Contact us:</p>

                      <a
                        href="mailto:info@bgcl.org"
                        className="dark:text-sky-400 text-sky-600 hover:dark:text-sky-300 hover:text-sky-700 font-semibold text-sm transition-colors"
                      >
                        info@bgcl.org
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Mobile Tab Content - Form Tab */}
              {activeTab === 'form' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="md:hidden flex-1 overflow-y-auto w-full"
                >
                  <VolunteerForm programs={programs} />
                </motion.div>
              )}

              {/* Right Form - visible on md+ */}
              <div className="hidden md:flex flex-1 border-l dark:border-neutral-800 border-neutral-200 overflow-y-auto">
                <VolunteerForm programs={programs} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
