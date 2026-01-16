'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { useState } from 'react'

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const closingDates = [
    { holiday: "New Year's Day", date: 'January 1, 2025' },
    { holiday: 'Martin Luther King Day', date: 'January 20, 2025' },
    { holiday: "President's Day", date: 'February 17, 2025' },
    { holiday: 'Good Friday', date: 'April 18, 2025' },
    { holiday: 'Patriots Day', date: 'April 21, 2025' },
    { holiday: 'Juneteenth', date: 'June 19, 2025' },
    { holiday: 'Independence Day', date: 'July 4, 2025' },
    { holiday: 'Labor Day', date: 'September 1, 2025' },
    { holiday: 'Columbus Day', date: 'October 13, 2025' },
    { holiday: "Veteran's Day", date: 'November 11, 2025' },
    { holiday: 'Thanksgiving', date: 'November 27, 2025' },
    { holiday: 'Day After Thanksgiving', date: 'November 28, 2025' },
    { holiday: 'Christmas Week', date: 'December 23 - 26, 2025' }
  ]

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

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
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="dark:bg-neutral-900 bg-white dark:border-neutral-800 border-neutral-200 p-8 rounded-xl border">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-50 border-neutral-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-50 border-neutral-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-50 border-neutral-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-50 border-neutral-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-50 border-neutral-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="tour">Schedule a Tour</option>
                      <option value="job">Job Opportunity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-50 border-neutral-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                      placeholder="Tell us more about your inquiry..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>

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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Closings Section */}
      <section className="dark:bg-neutral-900/50 bg-neutral-50 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black dark:text-white text-neutral-900 mb-4">Facility Closings</h2>
            <p className="text-lg dark:text-neutral-400 text-neutral-600">
              Please note the following dates when the Boys & Girls Club will be closed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {closingDates.map((closing, index) => (
              <motion.div
                key={index}
                className="dark:bg-neutral-800 bg-white dark:border-neutral-700 border-neutral-200 p-6 rounded-lg border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <h3 className="text-lg font-bold dark:text-white text-neutral-900 mb-2">{closing.holiday}</h3>
                <p className="text-sm dark:text-neutral-400 text-neutral-600">{closing.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
