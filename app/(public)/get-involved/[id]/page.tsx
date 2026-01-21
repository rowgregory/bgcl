'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle, FileText, Download } from 'lucide-react'
import Link from 'next/link'

const statusConfig = {
  PENDING: {
    color: 'bg-yellow-500/10 border-yellow-500/30',
    textColor: 'text-yellow-400',
    icon: Clock,
    label: 'Under Review',
    description: 'Your application is being reviewed by our team.'
  },
  REVIEW: {
    color: 'bg-blue-500/10 border-blue-500/30',
    textColor: 'text-blue-400',
    icon: Clock,
    label: 'In Review',
    description: 'Your application is actively being reviewed.'
  },
  APPROVED: {
    color: 'bg-green-500/10 border-green-500/30',
    textColor: 'text-green-400',
    icon: CheckCircle,
    label: 'Approved',
    description: 'Congratulations! Your application has been approved.'
  },
  REJECTED: {
    color: 'bg-red-500/10 border-red-500/30',
    textColor: 'text-red-400',
    icon: AlertCircle,
    label: 'Not Selected',
    description: 'Thank you for applying. We will keep your application on file.'
  }
}

const JobApplicationPage = ({ application }) => {
  if (!application) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Application Not Found</h1>
          <p className="text-neutral-600 dark:text-neutral-400">We could not find your application.</p>
          <Link href="/get-involved">
            <button className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-neutral-900 dark:text-white font-semibold rounded-lg transition-colors mt-6">
              Back to application
            </button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const statusInfo = statusConfig[application.status]
  const StatusIcon = statusInfo.icon

  return (
    <div className="">
      {/* Hero Section */}
      <div className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">Application Submitted</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Thank you for applying to Boys & Girls Club of Lynn
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Status (1 column on lg) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
            {/* Status Card */}
            <div
              className={`border-2 rounded-lg p-6 ${statusInfo.color} sticky top-8 bg-neutral-100 dark:bg-neutral-900`}
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <StatusIcon className={`w-8 h-8 ${statusInfo.textColor}`} />
                <div className="space-y-2">
                  <h2 className={`text-xl font-bold ${statusInfo.textColor}`}>{statusInfo.label}</h2>
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm">{statusInfo.description}</p>
                  {application.createdAt && (
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                      {new Date(application.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="mt-8 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white text-center">Questions?</h3>
              <div className="space-y-3 text-center">
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-wider">Phone</p>
                  <a href="tel:781-593-1772" className="text-sky-600 dark:text-sky-400 font-semibold">
                    (781) 593-1772
                  </a>
                </div>
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-wider">Email</p>
                  <a href="mailto:info@bgcl.org" className="text-sky-600 dark:text-sky-400 font-semibold">
                    info@bgcl.org
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Details (2 columns on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Application Details */}
            <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 space-y-6">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Your Application Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold dark:text-sky-400 text-sky-600 uppercase tracking-wider">
                    Personal Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">Full Name</p>
                      <p className="text-neutral-900 dark:text-white font-semibold">{application.applicantName}</p>
                    </div>
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">Email</p>
                      <p className="text-neutral-900 dark:text-white font-semibold text-sm break-all">
                        {application.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">Phone</p>
                      <p className="text-neutral-900 dark:text-white font-semibold">{application.cellNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Position Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold dark:text-sky-400 text-sky-600 uppercase tracking-wider">
                    Position Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">Employment Type</p>
                      <p className="text-neutral-900 dark:text-white font-semibold">
                        {application.employmentType === 'FULL_TIME' && 'Full Time'}
                        {application.employmentType === 'PART_TIME' && 'Part Time'}
                        {application.employmentType === 'SEASONAL' && 'Seasonal (Summer)'}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">Hours Available</p>
                      <p className="text-neutral-900 dark:text-white font-semibold text-sm">
                        {application.hoursAvailable}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages */}
              {application.languages && application.languages.length > 0 && (
                <div className="border-t border-zinc-700 pt-6 space-y-3">
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">Languages Spoken</p>
                  <div className="flex flex-wrap gap-2">
                    {application.languages
                      .split(',')
                      .map((lang) => lang.trim())
                      .map((lang) => (
                        <span
                          key={lang}
                          className="px-3 py-1 bg-sky-500/15 border border-sky-500/40 text-sky-700 dark:text-sky-300 rounded-full text-sm font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Resume Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 space-y-4"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 dark:text-sky-400 text-sky-600" />
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Resume</h3>
              </div>

              {application.resumeUrl ? (
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-neutral-200/60 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:border-sky-500 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-6 h-6 text-zinc-400 group-hover:text-sky-400 transition-colors shrink-0" />
                    <div className="min-w-0">
                      <p className="text-neutral-900 dark:text-white font-semibold truncate">
                        {application.resumeFileName}
                      </p>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">Click to view</p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-zinc-400 group-hover:text-sky-400 transition-colors shrink-0" />
                </a>
              ) : (
                <p className="text-zinc-400">No resume uploaded</p>
              )}
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-8 space-y-4"
            >
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">What's Next?</h3>
              <div className="space-y-3 text-neutral-700 dark:text-neutral-300">
                <p>✓ Your application has been received and added to our system.</p>
                <p>✓ Our team will review your application and qualifications.</p>
                <p>✓ If we'd like to move forward, we'll contact you at the email provided.</p>
                <p>💡 Keep your contact information current so we can reach you easily.</p>
              </div>
            </motion.div>

            {/* Back Button */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <Link href="/get-involved">
                <button className="w-full px-8 py-3 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-semibold rounded-lg transition-colors border border-neutral-300 dark:border-neutral-700">
                  Back to Application
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default JobApplicationPage
