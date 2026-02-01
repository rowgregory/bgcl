'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Database, Fuel, Package, Star } from 'lucide-react'
import Link from 'next/link'

export const getCryoChamberStatusBadge = (status: string) => {
  switch (status) {
    case 'not_purchased':
      return {
        text: 'Not Purchased',
        color: 'bg-gray-600/10 text-gray-300 border-gray-600/20',
        description: 'Development starts upon purchase.'
      }
    case 'available':
      return {
        text: 'Available Now',
        color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        description: 'Ready to enable — no setup required.'
      }
    case 'beta':
      return {
        text: 'Private Beta',
        color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        description: 'Limited release for early adopters and testing.'
      }
    case 'development':
      return {
        text: 'Shipyard',
        color: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
        description: "Purchased — currently being built. We'll notify the group when it's ready."
      }
    case 'active':
      return {
        text: 'Hoisted',
        color: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30',
        description: 'Live and available for the group to use.'
      }
    default:
      return {
        text: 'Coming Soon',
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        description: 'Planned but not available yet.'
      }
  }
}

const features = [
  {
    id: 'fuel-station',
    name: 'The Fuel Station',
    tagline: 'Donation Platform',
    description:
      'The Fuel Station will replace the current GoHarness donation platform, which costs around $7,500 per year. This new system gives complete control over donation processing and donor management — without ongoing platform fees or outside dependencies.',
    icon: Fuel,
    gradient: 'from-indigo-950 via-slate-900 to-black',
    accentColor: 'cyan-400',
    capabilities: [
      {
        title: 'Full Donation Control',
        desc: 'Manage donations directly without third-party platforms'
      },
      {
        title: 'Donor Management',
        desc: 'Track and organize donor information efficiently'
      },
      {
        title: 'Custom Reporting',
        desc: 'Generate insights and reports tailored to your needs'
      }
    ],
    status: 'not_purchased',
    linkKey: '/admin/fuel-station',
    pricing: {
      build: 3200,
      monthly: 85
    }
  },
  {
    id: 'capsule',
    name: 'The Capsule',
    tagline: 'Event Management Platform',
    description:
      'The Capsule streamlines event creation, registration, and attendee management. Handle ticket sales, capacity limits, and check-ins all in one place. Perfect for fundraisers, community events, camps, and programs.',
    icon: Calendar,
    gradient: 'from-purple-950 via-indigo-900 to-black',
    accentColor: 'purple-400',
    capabilities: [
      {
        title: 'Event Registration',
        desc: 'Online registration with payment processing and capacity management'
      },
      {
        title: 'Ticketing & Check-in',
        desc: 'Digital tickets with QR codes and real-time attendance tracking'
      },
      {
        title: 'Analytics Dashboard',
        desc: 'Track registrations, revenue, and attendance metrics'
      }
    ],
    status: 'not_purchased',
    linkKey: '/admin/capsule/core',
    pricing: {
      build: 2800,
      monthly: 75
    }
  },
  {
    id: 'blackhole',
    name: 'The Blackhole',
    tagline: 'Legacy Data Migration',
    description:
      'The Blackhole pulls 13 years of historical data from legacy systems into your new platform. Import youth records, program history, donations, events, and more—ensuring nothing is lost in the transition to modern operations.',
    icon: Database, // or Archive, HardDrive
    gradient: 'from-black via-purple-950 to-indigo-950',
    accentColor: 'purple-400',
    capabilities: [
      {
        title: 'Deep Archive Retrieval',
        desc: 'Import 13 years of youth profiles, program enrollments, and attendance records'
      },
      {
        title: 'Historical Preservation',
        desc: 'Maintain complete donation history, event archives, and transaction records'
      },
      {
        title: 'Data Integrity Validation',
        desc: 'Automated verification and error checking during the migration process'
      }
    ],
    status: 'not_purchased',
    linkKey: '/admin/blackhole',
    pricing: {
      build: 8500, // One-time migration project
      monthly: 0 // No ongoing cost after migration complete
    }
  },
  {
    id: 'cargo-bay',
    name: 'The Cargo Bay',
    tagline: 'Instant Impact Store',
    description:
      'The Cargo Bay lets you create tangible donation items that supporters can instantly purchase. Bundle specific needs into buyable packages—like 10 lunch boxes for $250 or 5 basketballs for $150. Turn abstract donations into concrete impact.',
    icon: Package, // or ShoppingCart, Box
    gradient: 'from-cyan-950 via-blue-900 to-black',
    accentColor: 'cyan-400',
    capabilities: [
      {
        title: 'Impact Packages',
        desc: 'Create specific donation items with real-world outcomes (lunches, equipment, supplies)'
      },
      {
        title: 'Instant Checkout',
        desc: 'One-click purchasing for donors who want immediate, tangible impact'
      },
      {
        title: 'Inventory Tracking',
        desc: "Monitor what's been funded and what's still needed in real-time"
      }
    ],
    status: 'not_purchased',
    linkKey: '/admin/cargo-bay',
    pricing: {
      build: 3500,
      monthly: 50
    }
  }
]

const CryoChamber = () => {
  return (
    <div className="">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gray-900/30" />
          <div
            style={{ backgroundImage: "url('/images/cryo-2.jpeg')" }}
            className="bg-no-repeat bg-cover bg-center w-full h-full"
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6">
              <Star className="w-4 h-4 text-indigo-500 mr-2" />
              <span className="text-sm font-medium text-gray-300">Squad Add Ons</span>
            </div>

            <h1 className="text-4xl font-bold mb-4 text-white leading-tight">Choose What We Unlock Together</h1>

            <p className="text-base text-white mb-0 leading-relaxed">
              Below are features we can enable for our group. Review each one, and confirm which tools we want to use
              going forward.
            </p>
          </motion.div>
        </div>
      </div>
      {/* Features Section */}
      <div className="max-w-334 mx-auto px-6 lg:px-8 py-20">
        <div className="grid xl:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            const statusBadge = getCryoChamberStatusBadge(feature.status)

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -4, scale: 1.01 }} // Add hover lift effect
                className="border border-white/10 bg-white/2 rounded-2xl p-8 shadow-lg backdrop-blur-sm hover:bg-white/5 hover:border-white/20 transition-all duration-300"
              >
                <div className="space-y-6 flex flex-col h-full justify-between">
                  <div className="space-y-6">
                    {/* Icon + Status */}
                    <div className="flex items-center justify-between">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`p-3 rounded-xl bg-linear-to-r ${feature.gradient} shadow-lg`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className={`px-3 py-1 border rounded-full text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.text}
                      </div>
                    </div>

                    {/* Name + Tagline + Description */}
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{feature.name}</h2>
                      <p
                        className={`text-sm font-medium mb-3 uppercase tracking-wide`}
                        style={{ color: `var(--${feature.accentColor})` }} // Better approach than dynamic classes
                      >
                        {feature.tagline}
                      </p>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">{feature.description}</p>
                    </div>

                    {/* Capabilities */}
                    <div className="space-y-3">
                      {feature.capabilities.map((capability, capIndex) => (
                        <motion.div
                          key={capIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * capIndex }}
                          className="flex items-start space-x-3 group"
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-2 shrink-0 transition-all group-hover:scale-150`}
                            style={{
                              backgroundColor: `var(--${feature.accentColor})`
                            }}
                          />
                          <div>
                            <h4 className="font-semibold text-white text-xs group-hover:text-gray-200 transition-colors">
                              {capability.title}
                            </h4>
                            <p className="text-gray-500 text-xs mt-1">{capability.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="space-y-4">
                    {/* Status Description */}
                    <div className="py-3 border-y border-white/10">
                      <p className="text-xs text-gray-500">{statusBadge.description}</p>
                    </div>

                    {/* Pricing with better visual hierarchy */}
                    <div className="bg-white/3 border border-white/10 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Initial Build</span>
                        <span className="text-lg font-bold text-white">${feature.pricing.build.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Monthly</span>
                        <span className="text-lg font-bold text-white">${feature.pricing.monthly}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link
                        href={feature.linkKey}
                        className="w-full px-4 py-2.5 rounded-lg border border-white/20 hover:border-white/30 text-sm font-medium text-white hover:bg-white/5 transition-all duration-200 flex items-center justify-center group"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full px-4 py-2.5 rounded-lg bg-linear-to-r ${feature.gradient} hover:shadow-xl text-sm font-medium text-white transition-all duration-200`}
                      >
                        {feature.status === 'not_purchased' ? `Purchase ${feature.name}` : `Manage ${feature.name}`}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CryoChamber
