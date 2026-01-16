'use client'

import { motion } from 'framer-motion'
import { GitCommit, Bug, Zap, AlertCircle } from 'lucide-react'

type ChangeType = 'feature' | 'improvement' | 'bug' | 'breaking'
type ImpactLevel = 'low' | 'medium' | 'high'

interface Change {
  type: ChangeType
  title: string
  description: string
  impact: ImpactLevel
}

interface ChangelogEntry {
  version: string
  date: string
  changes: Change[]
}

const changelogData: ChangelogEntry[] = [
  {
    version: '1.1.1',
    date: '2026-01-16',
    changes: [
      {
        type: 'feature',
        title: 'Enhanced Donation Form',
        description:
          'Expanded donation form with comprehensive donor information collection. Added address fields (street, city, state, ZIP, country), campaign selection dropdown with multiple fundraising options, and optional message/notes field for donor comments.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Admin Navigation Updates',
        description:
          'Added Changelog to Management section of admin navigation. Updated sidebar styling for better dark/light mode contrast and readability.',
        impact: 'low'
      }
    ]
  },
  {
    version: '1.1.0',
    date: '2026-01-16',
    changes: [
      {
        type: 'feature',
        title: 'Stories Page Combined',
        description:
          'Consolidated News and Honorees sections into a single Stories page. Users can now browse news, award winners, and community recognition in one unified experience.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Floating Donate Button',
        description:
          'Added animated floating donation button with modal menu. Features pulsing hover effects, preset donation amounts, and impact statistics.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Volunteer Drawer Component',
        description:
          'Replaced dedicated volunteer page with slide-out drawer. Includes benefits, steps, requirements, and direct CTA for applications.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'Capital Campaign Drawer',
        description:
          'Moved capital campaign information into a drawer component accessible from various pages. Includes goals, timeline, and impact statistics.',
        impact: 'low'
      },
      {
        type: 'feature',
        title: 'Modernized Honorees Page',
        description:
          'Complete redesign of honorees section with featured award winners, Hall of Fame inductees, business awards, and community recognition lists. Includes animations and dark/light mode support.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Team Page with Nested Tabs',
        description:
          'New team page featuring Board of Directors and Staff sections with nested tabs. Includes team member cards with contact information and professional photos.',
        impact: 'medium'
      },
      {
        type: 'improvement',
        title: 'News Detail Page Layout',
        description:
          'Redesigned news detail page with 2-column layout. Includes sidebar with related articles and newsletter signup, improved typography and spacing.',
        impact: 'medium'
      },
      {
        type: 'bug',
        title: 'Donation Notification Cycling',
        description:
          'Fixed infinite loop in donation notification carousel. Implemented proper timer cleanup and recursive cycle function for smooth 5-second display / 15-second hide pattern.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Program Detail Pages',
        description:
          'Added individual detail pages for each program with hero images, descriptions, schedules, and enrollment information. Full dark/light mode support.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Dark Mode Support System-Wide',
        description:
          'Implemented comprehensive dark/light mode toggle across all pages and components. Updated color system to use neutral palette with sky blue accents.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Component Animations',
        description:
          'Added Framer Motion animations to all major sections including staggered item animations, scroll-triggered reveals, and smooth transitions.',
        impact: 'low'
      },
      {
        type: 'feature',
        title: 'Program Cards Component',
        description:
          'Created reusable program cards with hover effects, icons, descriptions, and CTA buttons. Used across programs page with responsive grid layout.',
        impact: 'medium'
      },
      {
        type: 'feature',
        title: 'Events Page Creation',
        description:
          'Built comprehensive events page with featured events, upcoming events grid, calendar integration hints, and registration CTAs.',
        impact: 'high'
      },
      {
        type: 'improvement',
        title: 'Navigation Structure',
        description:
          'Reorganized navigation to match new page structure. Added dropdown menus for Programs and News sections.',
        impact: 'medium'
      },
      {
        type: 'breaking',
        title: 'Design System Overhaul',
        description:
          'Complete redesign using modern component architecture. Moved from Webflow to Next.js with React/TypeScript. Implemented professional color system and typography.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Mobile-First Responsive Design',
        description:
          'All pages built with mobile-first approach using Tailwind CSS. Tested and optimized for mobile, tablet, and desktop viewports.',
        impact: 'high'
      },
      {
        type: 'feature',
        title: 'Admin Dashboard Foundation',
        description:
          'Started building admin dashboard with authentication, content management, and analytics foundations.',
        impact: 'medium'
      }
    ]
  }
]

const getChangeIcon = (type: ChangeType) => {
  switch (type) {
    case 'feature':
      return <Zap className="w-5 h-5" />
    case 'improvement':
      return <GitCommit className="w-5 h-5" />
    case 'bug':
      return <Bug className="w-5 h-5" />
    case 'breaking':
      return <AlertCircle className="w-5 h-5" />
    default:
      return <GitCommit className="w-5 h-5" />
  }
}

const getChangeColor = (type: ChangeType) => {
  switch (type) {
    case 'feature':
      return 'dark:bg-green-500/10 bg-green-100 dark:text-green-400 text-green-700 dark:border-green-500/20 border-green-300/50'
    case 'improvement':
      return 'dark:bg-blue-500/10 bg-blue-100 dark:text-blue-400 text-blue-700 dark:border-blue-500/20 border-blue-300/50'
    case 'bug':
      return 'dark:bg-red-500/10 bg-red-100 dark:text-red-400 text-red-700 dark:border-red-500/20 border-red-300/50'
    case 'breaking':
      return 'dark:bg-orange-500/10 bg-orange-100 dark:text-orange-400 text-orange-700 dark:border-orange-500/20 border-orange-300/50'
    default:
      return 'dark:bg-neutral-500/10 bg-neutral-100 dark:text-neutral-400 text-neutral-700'
  }
}

const getImpactColor = (impact: ImpactLevel) => {
  switch (impact) {
    case 'low':
      return 'dark:bg-neutral-600 bg-neutral-500 text-white text-xs'
    case 'medium':
      return 'dark:bg-sky-600 bg-sky-600 text-white text-xs'
    case 'high':
      return 'dark:bg-red-600 bg-red-600 text-white text-xs'
    default:
      return 'dark:bg-neutral-600 bg-neutral-500 text-white text-xs'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function ChangelogPage() {
  return (
    <div className="dark:bg-neutral-950 bg-white min-h-screen py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="space-y-4 mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
            Admin Panel
          </p>
          <h1 className="text-5xl md:text-6xl font-black dark:text-white text-neutral-900 leading-tight">Changelog</h1>
          <p className="text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
            Track all updates, improvements, and bug fixes to the Boys & Girls Club of Lynn website.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-12">
          {changelogData.map((entry, entryIndex) => (
            <motion.div
              key={entry.version}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: entryIndex * 0.1 }}
              className="space-y-6"
            >
              {/* Version Header */}
              <div className="flex items-baseline gap-4 border-b dark:border-neutral-800 border-neutral-200 pb-4">
                <h2 className="text-3xl font-black dark:text-white text-neutral-900">v{entry.version}</h2>
                <time className="text-sm dark:text-neutral-400 text-neutral-600 font-medium">
                  {formatDate(entry.date)}
                </time>
              </div>

              {/* Changes Grid */}
              <div className="space-y-4">
                {entry.changes.map((change, changeIndex) => (
                  <motion.div
                    key={changeIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: changeIndex * 0.05 }}
                    className="dark:bg-neutral-900/50 bg-neutral-50 rounded-xl p-5 border dark:border-neutral-800 border-neutral-200 hover:border-sky-500/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Type Icon */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border ${getChangeColor(
                          change.type
                        )}`}
                      >
                        {getChangeIcon(change.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold dark:text-white text-neutral-900">{change.title}</h3>
                          {/* Type Badge */}
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${getChangeColor(
                              change.type
                            )}`}
                          >
                            {change.type}
                          </span>
                          {/* Impact Badge */}
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full font-semibold capitalize ${getImpactColor(
                              change.impact
                            )}`}
                          >
                            {change.impact} impact
                          </span>
                        </div>
                        <p className="dark:text-neutral-300 text-neutral-700 text-sm leading-relaxed">
                          {change.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 pt-12 border-t dark:border-neutral-800 border-neutral-200 text-center space-y-4"
        >
          <p className="dark:text-neutral-400 text-neutral-600">Need to report a bug or suggest a feature?</p>
          <a
            href="mailto:development@bgcl.org"
            className="inline-block px-6 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
          >
            Contact Development Team
          </a>
        </motion.div>
      </div>
    </div>
  )
}
