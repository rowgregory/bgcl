'use client'

import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Picture from '../common/Picture'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <footer className="dark:bg-neutral-950 dark:border-neutral-800 bg-white border-neutral-200 border-t">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <motion.div className="flex space-x-3 w-28 h-auto">
            <Picture
              src="/images/logo-2.png"
              alt="Boys & Girls Club"
              className="dark:hidden block w-full h-full cursor-pointer hover:opacity-80 transition-opacity object-contain"
              priority
            />
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <p className="dark:text-white text-neutral-900 font-semibold text-sm uppercase tracking-wider">Links</p>
            <ul className="space-y-2 text-sm dark:text-neutral-400 text-neutral-600">
              <li>
                <Link href="/" className="dark:hover:text-sky-400 hover:text-sky-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/programs" className="dark:hover:text-sky-400 hover:text-sky-600 transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/events" className="dark:hover:text-sky-400 hover:text-sky-600 transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/about" className="dark:hover:text-sky-400 hover:text-sky-600 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="dark:text-white text-neutral-900 font-semibold text-sm uppercase tracking-wider">
              Newsletter
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 dark:text-neutral-600 text-neutral-500 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 dark:bg-neutral-900 dark:border-neutral-800 dark:text-white dark:placeholder-neutral-600 dark:focus:ring-sky-500 bg-neutral-100 border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:ring-sky-600 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full px-3 py-2 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Subscribe
              </button>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-green-400 text-center"
                >
                  Thanks for subscribing!
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="dark:border-neutral-800 border-neutral-200 border-t my-8" />

        {/* Bottom Footer */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between text-sm dark:text-neutral-600 text-neutral-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p>&copy; 2026 Boys & Girls Club of Lynn. All rights reserved.</p>
          <div className="flex items-center gap-1 mt-4 md:mt-0">
            <span>Built by</span>
            <Link
              href="https://sqysh.io?lead_source=bgcl"
              className="dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-700 transition-colors font-semibold"
            >
              Sqysh
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
