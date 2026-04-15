'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Book,
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Search,
  Zap,
  Shield
} from 'lucide-react'

interface Section {
  id: string
  title: string
  icon: any
  content: {
    title: string
    description: string
    steps?: string[]
    tips?: string[]
  }[]
}

export default function AdminDocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started'])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    )
  }

  const sections: Section[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      content: [
        {
          title: 'Welcome to Mission Control',
          description:
            'Mission Control is your central hub for managing the Boys & Girls Club of Lynn website. From here, you can manage donations, events, programs, users, and more.',
          tips: [
            'Use the sidebar navigation to access different sections',
            'Your role determines which features you can access',
            'The dashboard provides an overview of key metrics'
          ]
        },
        {
          title: 'Logging In',
          description: 'Access the admin panel by logging in with your authorized email address.',
          steps: [
            'Navigate to the login page',
            'Enter your email address',
            'Click "Send Magic Link"',
            'Check your email and click the login link',
            "You'll be automatically redirected to Mission Control"
          ]
        }
      ]
    },
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      icon: LayoutDashboard,
      content: [
        {
          title: 'Understanding Your Dashboard',
          description:
            'The dashboard provides real-time insights into website activity, donations, and user engagement.',
          tips: [
            'View total donations, active subscriptions, and recent transactions',
            'Monitor event registrations and program enrollments',
            'Track key performance indicators at a glance'
          ]
        },
        {
          title: 'Analytics Integration',
          description: 'Access external analytics platforms directly from Mission Control.',
          steps: [
            'Locate the analytics cards on your dashboard',
            'Click "Open Dashboard" to launch the respective platform',
            'Available platforms: Google Analytics, Search Console, Stripe, Hotjar'
          ]
        }
      ]
    },
    {
      id: 'donations',
      title: 'Managing Donations',
      icon: DollarSign,
      content: [
        {
          title: 'Viewing Donations',
          description: 'Access all donation records, including one-time and recurring contributions.',
          steps: [
            'Navigate to "Fuel Station" from the sidebar',
            'View donations in table format with filters',
            'Search by donor name, amount, or date',
            'Export data for reporting purposes'
          ]
        },
        {
          title: 'Subscription Management',
          description: 'Monitor and manage recurring donations.',
          steps: [
            'Go to the Subscriptions section',
            'View active, paused, and cancelled subscriptions',
            'Click on any subscription to see details',
            'Cancel or update subscriptions as needed'
          ],
          tips: [
            'Cancelled subscriptions remain in the system for record-keeping',
            'Donors can manage their own subscriptions from their account',
            'All changes are logged for audit purposes'
          ]
        }
      ]
    },
    {
      id: 'events',
      title: 'Event Management',
      icon: Calendar,
      content: [
        {
          title: 'Creating Events',
          description: 'Add new events for community members to discover and register for.',
          steps: [
            'Navigate to "The Capsule" (Events)',
            'Click "Create New Event"',
            'Fill in event details: title, description, date, time, location',
            'Set capacity limits and pricing if applicable',
            'Upload event images',
            'Publish when ready'
          ]
        },
        {
          title: 'Managing Registrations',
          description: 'View and manage event attendee registrations.',
          steps: [
            'Open the event from the events list',
            'View the "Attendees" tab',
            'See registration details and payment status',
            'Export attendee list for check-in purposes'
          ]
        }
      ]
    },
    {
      id: 'programs',
      title: 'Program Management',
      icon: Book,
      content: [
        {
          title: 'Adding Programs',
          description: 'Create and manage youth programs offered by the club.',
          steps: [
            'Go to Programs section',
            'Click "Add New Program"',
            'Enter program name, description, and details',
            'Set age ranges and capacity',
            'Add schedule and pricing information',
            'Upload program images',
            'Publish to make it visible on the website'
          ]
        },
        {
          title: 'Program Enrollment',
          description: 'Track and manage program enrollments.',
          tips: [
            'View enrollment numbers in real-time',
            'Monitor capacity to prevent overbooking',
            'Contact enrolled families directly from the system'
          ]
        }
      ]
    },
    {
      id: 'users',
      title: 'User Management',
      icon: Users,
      content: [
        {
          title: 'Managing User Accounts',
          description: 'View and manage user accounts, roles, and permissions.',
          steps: [
            'Navigate to "Crew Roster" (Users)',
            'View all registered users',
            'Filter by role: Supporter, Program Staff, Admin',
            'Update user roles and permissions as needed',
            'Deactivate accounts if necessary'
          ]
        },
        {
          title: 'User Roles Explained',
          description: 'Understanding different permission levels.',
          tips: [
            'SUPPORTER: Can donate, register for events, view their own data',
            'PROGRAM: Staff members who can manage programs and events',
            'ADMIN: Full access to all features',
            'SUPERUSER: Highest level access including user management'
          ]
        }
      ]
    },
    {
      id: 'content',
      title: 'Content Management',
      icon: FileText,
      content: [
        {
          title: 'Editing Page Content',
          description: 'Update website content without touching code.',
          steps: [
            'Navigate to "Content Editor"',
            'Select the page you want to edit',
            'Click the edit icon next to any field',
            'Make your changes',
            'Click the checkmark to save',
            'Changes appear on the live site immediately'
          ],
          tips: [
            'Use the preview panel to see changes in real-time',
            'Changes are auto-saved as you edit',
            'You can revert changes if needed'
          ]
        },
        {
          title: 'Managing Homepage Content',
          description: 'Control hero section, mission statement, and featured content.',
          steps: [
            'Go to Content Editor → Home Page',
            'Edit sections: Hero, Mission, Programs, History',
            'Update text, buttons, and links',
            'Save changes to publish'
          ]
        }
      ]
    },
    {
      id: 'settings',
      title: 'Settings & Configuration',
      icon: Settings,
      content: [
        {
          title: 'Site Settings',
          description: 'Configure global website settings.',
          tips: [
            'Update contact information and social media links',
            'Manage site-wide announcements and modals',
            'Configure email notifications',
            'Set up integrations with third-party services'
          ]
        },
        {
          title: 'Payment Settings',
          description: 'Manage Stripe integration and payment options.',
          steps: [
            'Access Stripe dashboard from Mission Control',
            'Verify live mode is enabled',
            'Check webhook status',
            'Review payment processing settings'
          ]
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Best Practices',
      icon: Shield,
      content: [
        {
          title: 'Account Security',
          description: 'Keep your admin account secure.',
          tips: [
            'Never share your login credentials',
            'Use a secure, unique email for admin access',
            'Log out when finished with admin tasks',
            'Report any suspicious activity immediately'
          ]
        },
        {
          title: 'Data Privacy',
          description: 'Protecting user information.',
          tips: [
            'Only access user data when necessary',
            'Never share donor information externally',
            'Follow GDPR and data protection guidelines',
            'All actions are logged for audit purposes'
          ]
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: Search,
      content: [
        {
          title: 'Common Issues',
          description: 'Solutions to frequently encountered problems.',
          tips: [
            'Changes not appearing? Hard refresh your browser (Cmd+Shift+R or Ctrl+Shift+R)',
            "Can't log in? Check your email spam folder for the magic link",
            'Missing features? Verify your user role has appropriate permissions',
            'Payment issues? Check Stripe dashboard for error details'
          ]
        },
        {
          title: 'Getting Help',
          description: 'Contact support when you need assistance.',
          steps: [
            'Check this documentation first',
            'Contact your technical administrator',
            'Email: webmaster@bgcl.org',
            'Include screenshots when reporting issues'
          ]
        }
      ]
    }
  ]

  const filteredSections = sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.some(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-334 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-linear-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">Admin Documentation</h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">Complete guide to managing your website</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-4">
            Quick Links
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sections.slice(0, 4).map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-sky-500 dark:hover:border-sky-500 transition-colors text-left group"
                >
                  <Icon className="w-6 h-6 text-sky-500 mb-2" />
                  <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-sky-500 transition-colors">
                    {section.title}
                  </p>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Documentation Sections */}
        <div className="space-y-4">
          {filteredSections.map((section, index) => {
            const Icon = section.icon
            const isExpanded = expandedSections.includes(section.id)

            return (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white text-left">
                      {section.title}
                    </h2>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-neutral-400" />
                  )}
                </button>

                {/* Section Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="space-y-3">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
                        <p className="text-neutral-600 dark:text-neutral-400">{item.description}</p>

                        {/* Steps */}
                        {item.steps && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Steps:</p>
                            <ol className="space-y-2 ml-5">
                              {item.steps.map((step, stepIndex) => (
                                <li
                                  key={stepIndex}
                                  className="text-sm text-neutral-600 dark:text-neutral-400 list-decimal"
                                >
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Tips */}
                        {item.tips && (
                          <div className="bg-sky-50 dark:bg-sky-900/10 border border-sky-200 dark:border-sky-800 rounded-lg p-4">
                            <p className="text-sm font-medium text-sky-900 dark:text-sky-400 mb-2">
                              💡 Tips & Best Practices
                            </p>
                            <ul className="space-y-1.5">
                              {item.tips.map((tip, tipIndex) => (
                                <li
                                  key={tipIndex}
                                  className="text-sm text-sky-800 dark:text-sky-300 flex items-start gap-2"
                                >
                                  <span className="text-sky-500 mt-0.5">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {itemIndex < section.content.length - 1 && (
                          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Help Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 bg-linear-to-r from-sky-500 to-blue-600 rounded-xl text-white"
        >
          <h3 className="text-xl font-semibold mb-2">Need More Help?</h3>
          <p className="mb-4 opacity-90">
            Can't find what you're looking for? Contact your technical administrator for assistance.
          </p>

          <a
            href="mailto:webmaster@bgcl.org"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-sky-600 font-semibold rounded-lg hover:bg-sky-50 transition-colors"
          >
            Contact Support
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </div>
  )
}
