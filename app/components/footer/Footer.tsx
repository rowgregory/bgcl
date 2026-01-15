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
    // Add your newsletter API call here
    console.log('Subscribing:', email)
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <motion.div className="flex space-x-3">
            <motion.div className="overflow-hidden">
              <Picture
                src="/images/logo-1.webp"
                alt="Boys & Girls Club"
                className="w-auto h-12 cursor-pointer hover:opacity-80 transition-opacity"
                priority
              />
            </motion.div>
            <motion.div>
              <h1 className="text-white font-bold text-lg">Boys & Girls Club</h1>
              <p className="text-sky-400 text-xs font-semibold tracking-wide">of Lynn</p>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-white font-semibold text-sm uppercase tracking-wider">Links</p>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/" className="hover:text-sky-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-sky-400 transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-sky-400 transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sky-400 transition-colors">
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
            <p className="text-white font-semibold text-sm uppercase tracking-wider">Newsletter</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors"
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
        <div className="border-t border-neutral-800 my-8" />

        {/* Bottom Footer */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between text-sm text-neutral-600"
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
              className="text-sky-400 hover:text-sky-300 transition-colors font-semibold"
            >
              Sqysh
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
