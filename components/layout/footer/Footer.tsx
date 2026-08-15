'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Picture from '@/components/_shared/Picture'
import NewsletterSignup from '@/components/_shared/NewsletterSignup'
import { FacebookIcon, InstagramIcon, LinkedInIcon } from '@/components/ui/icons/SocialIconts'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/programs', label: 'Programs' },
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' }
]

const socialLinks = [
  {
    href: 'https://www.facebook.com/LynnBoysAndGirlsClub',
    label: 'Boys & Girls Club of Lynn on Facebook - opens in a new tab',
    Icon: FacebookIcon
  },
  {
    href: 'https://instagram.com/bgclynn',
    label: 'Boys & Girls Club of Lynn on Instagram - opens in a new tab',
    Icon: InstagramIcon
  },
  {
    href: 'https://www.linkedin.com/company/boys-girls-club-of-lynn',
    label: 'Boys & Girls Club of Lynn on LinkedIn - opens in a new tab',
    Icon: LinkedInIcon
  }
]

const socialLinkCls =
  'text-neutral-400 dark:text-neutral-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded'

export function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="px-6 md:px-12 dark:bg-neutral-950 dark:border-neutral-800 bg-white border-neutral-200 border-t pb-40 md:pb-0"
    >
      <div className="max-w-334 mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and Nonprofit Info */}
          <div className="lg:col-span-2">
            <motion.div
              className="w-64 h-auto mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Only one image announced — dark version is decorative */}
              <Picture
                src="/images/horizontal-logo-light.png"
                alt="Boys & Girls Club of Lynn"
                className="dark:hidden block w-full h-full object-contain"
                priority
              />
              <Picture
                src="/images/horizontal-logo-dark.png"
                decorative
                className="dark:block hidden w-full h-full object-contain"
                priority
              />
            </motion.div>

            <div className="space-y-2 mb-6">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                The Boys &amp; Girls Club of Lynn is a 501(c)3 Charitable Nonprofit Organization
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-500 font-mono">Tax ID: 04-2103924</p>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-md mb-6">
              To inspire and enable all young people, especially those that need us the most, to realize their full
              potential as productive responsible and caring citizens.
            </p>

            {/* Social Media Icons */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {socialLinks.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={socialLinkCls}
                >
                  <Icon aria-hidden="true" />
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.nav
            aria-label="Footer quick links"
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="dark:text-white text-neutral-900 font-bold text-base">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm dark:text-neutral-400 text-neutral-600 dark:hover:text-sky-400 hover:text-sky-600 transition-colors inline-flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Newsletter */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="dark:text-white text-neutral-900 font-bold text-base">Stay Connected</h3>
            <p className="text-sm dark:text-neutral-400 text-neutral-600">
              Subscribe to receive updates about our programs and events.
            </p>

            <NewsletterSignup accent="purple" />
          </motion.div>
        </div>

        {/* Divider */}
        <div aria-hidden="true" className="dark:border-neutral-800 border-neutral-200 border-t" />

        {/* Bottom Footer */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between pt-8 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="dark:text-neutral-500 text-neutral-500">
            &copy; {new Date().getFullYear()} Boys &amp; Girls Club of Lynn. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 mt-4 md:mt-0 dark:text-neutral-500 text-neutral-500">
            <span>Designed &amp; built by</span>
            <Link
              href="https://sqysh.io?lead_source=bgcl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Sqysh - opens in a new tab"
              className="sqysh-gradient font-semibold inline-flex items-center gap-1 group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded"
            >
              <span>Sqysh</span>
              <svg
                aria-hidden="true"
                className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
