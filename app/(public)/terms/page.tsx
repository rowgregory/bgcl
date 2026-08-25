'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function TermsPage() {
  const sections = [
    {
      number: '1',
      title: 'Terms',
      content:
        'By accessing this web site, you are agreeing to be bound by these web site Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this web site are protected by applicable copyright and trade mark law.'
    },
    {
      number: '2',
      title: 'Use License',
      content:
        'Permission is granted to temporarily download one copy of the materials (information or software) on Boys & Girls Club of Lynn\'s web site for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title. Under this license you may not: modify or copy the materials; use the materials for any commercial purpose; attempt to decompile or reverse engineer any software; remove any copyright or other proprietary notations; or transfer the materials to another person or "mirror" the materials on any other server. This license shall automatically terminate if you violate any of these restrictions and may be terminated by Boys & Girls Club of Lynn at any time.'
    },
    {
      number: '3',
      title: 'Disclaimer',
      content:
        'The materials on Boys & Girls Club of Lynn\'s web site are provided "as is". Boys & Girls Club of Lynn makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.'
    },
    {
      number: '4',
      title: 'Limitations',
      content:
        "In no event shall Boys & Girls Club of Lynn or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on Boys & Girls Club of Lynn's Internet site, even if Boys & Girls Club of Lynn or an authorized representative has been notified of the possibility of such damage."
    },
    {
      number: '5',
      title: 'Revisions and Errata',
      content:
        "The materials appearing on Boys & Girls Club of Lynn's web site could include technical, typographical, or photographic errors. Boys & Girls Club of Lynn does not warrant that any of the materials on its web site are accurate, complete, or current. Boys & Girls Club of Lynn may make changes to the materials contained on its web site at any time without notice."
    },
    {
      number: '6',
      title: 'Links',
      content:
        "Boys & Girls Club of Lynn has not reviewed all of the sites linked to its Internet web site and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Boys & Girls Club of Lynn of the site. Use of any such linked web site is at the user's own risk."
    },
    {
      number: '7',
      title: 'Site Terms of Use Modifications',
      content:
        'Boys & Girls Club of Lynn may revise these terms of use for its web site at any time without notice. By using this web site you are agreeing to be bound by the then current version of these Terms and Conditions of Use.'
    },
    {
      number: '8',
      title: 'Governing Law',
      content:
        "Any claim relating to Boys & Girls Club of Lynn's web site shall be governed by the laws of the State of New York without regard to its conflict of law provisions."
    }
  ]

  const textMessageTerms = [
    'You will receive up to 5 messages per month.',
    'You may unsubscribe at any time by texting the word STOP to (781) 201-3677.',
    'You may receive a subsequent message confirming your opt-out request.',
    'For help, send the word HELP to (781) 201-3677.',
    'Message and data rates may apply.',
    'United States Participating Carriers Include AT&T, T-Mobile®, Verizon Wireless, Sprint, Boost, U.S. Cellular®, MetroPCS®, InterOp, Cellcom, C Spire Wireless, Cricket, and Virgin Mobile.',
    'T-Mobile is not liable for delayed or undelivered messages.',
    'You agree to notify us of any changes to your mobile number and update your account accordingly.',
    'We may use your information to contact you and provide the services you request.'
  ]

  return (
    <div className="min-h-screen dark:bg-neutral-950 bg-white">
      {/* Hero Section */}
      <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-334 mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <p className="text-sky-600 dark:text-sky-400 font-semibold text-sm uppercase tracking-wider">Legal</p>
            <h1 className="text-5xl font-bold text-neutral-900 dark:text-white">Terms &amp; Conditions</h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
              Last Updated: January 2025
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-16 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 space-y-4"
        >
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Please read these Terms and Conditions carefully before using this website. By accessing and using this
            site, you agree to be bound by all terms and conditions outlined below. If you do not agree with any part of
            these terms, please do not use this website.
          </p>
        </motion.div>

        {/* Main Sections */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-3"
            >
              <div className="flex items-start space-x-4">
                <div className="shrink-0 w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{section.number}</span>
                </div>
                <div className="flex-1 space-y-3">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{section.title}</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-16 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 space-y-4"
        >
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Questions?</h2>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            If you have any questions about these Terms and Conditions, please contact The Boys &amp; Girls Club of Lynn
            at{' '}
            <a
              href="tel:781-593-1772"
              className="text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 font-semibold"
            >
              (781) 593-1772
            </a>{' '}
            or email us at{' '}
            <a
              href="mailto:info@bgcl.org"
              className="text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 font-semibold"
            >
              info@bgcl.org
            </a>
            .
          </p>
        </motion.section>

        {/* Related Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800"
        >
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/privacy"
              className="text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 font-semibold flex items-center space-x-2"
            >
              <span>Privacy Policy</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/contact"
              className="text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 font-semibold flex items-center space-x-2"
            >
              <span>Contact Us</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-12 mt-16"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Transparent &amp; Fair</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We believe in transparency and fair practices. These terms ensure a safe and respectful environment for all
            users.
          </p>
        </div>
      </motion.section>
    </div>
  )
}
