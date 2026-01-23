'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle, FileText, Download, XCircle, FileCheck, UsersIcon, Car } from 'lucide-react'
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
          <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto" />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Application Not Found</h1>
          <p className="text-neutral-600 dark:text-neutral-400">We could not find your application.</p>
          <Link href="/get-involved">
            <button className="px-6 py-3 bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors mt-6">
              Back to Application
            </button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const statusInfo = statusConfig[application.status]
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-sky-50 to-white dark:from-neutral-900 dark:to-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">Application Submitted</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Thank you for applying to Boys & Girls Club of Lynn
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Status */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
            {/* Status Card */}
            <div className={`border-2 rounded-xl p-6 ${statusInfo.color} bg-white dark:bg-neutral-900 shadow-sm`}>
              <div className="flex flex-col items-center gap-4 text-center">
                <StatusIcon className={`w-8 h-8 ${statusInfo.textColor}`} />
                <div className="space-y-2">
                  <h2 className={`text-xl font-bold ${statusInfo.textColor}`}>{statusInfo.label}</h2>
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm">{statusInfo.description}</p>
                  {application.createdAt && (
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-3">
                      Submitted on{' '}
                      {new Date(application.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="mt-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white text-center">Questions?</h3>
              <div className="space-y-3 text-center">
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-wider mb-1">Phone</p>
                  <a
                    href="tel:781-593-1772"
                    className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold transition-colors"
                  >
                    (781) 593-1772
                  </a>
                </div>
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3">
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-wider mb-1">Email</p>
                  <a
                    href="mailto:info@bgcl.org"
                    className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold transition-colors break-all"
                  >
                    info@bgcl.org
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Personal & Position Information */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 space-y-6 shadow-sm">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Application Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                    Personal Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">Full Name</p>
                      <p className="text-neutral-900 dark:text-white font-semibold">{application.applicantName}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">Email</p>
                      <p className="text-neutral-900 dark:text-white font-semibold text-sm break-all">
                        {application.email}
                      </p>
                    </div>
                    {application.signature && (
                      <div>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">Digital Signature</p>
                        <p className="text-neutral-900 dark:text-white font-semibold italic">{application.signature}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Position Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                    Position Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">Employment Type</p>
                      <p className="text-neutral-900 dark:text-white font-semibold">
                        {application.employmentType === 'FULL_TIME' && 'Full Time'}
                        {application.employmentType === 'PART_TIME' && 'Part Time'}
                        {application.employmentType === 'SEASONAL' && 'Seasonal (Summer)'}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">Hours Available</p>
                      <p className="text-neutral-900 dark:text-white font-semibold text-sm">
                        {application.hoursAvailable}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">Submission Status</p>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        {application.submissionStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages */}
              {application.languages && application.languages.length > 0 && (
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-3">
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm">Languages Spoken</p>
                  <div className="flex flex-wrap gap-2">
                    {application.languages
                      .split(',')
                      .map((lang) => lang.trim())
                      .map((lang) => (
                        <span
                          key={lang}
                          className="px-3 py-1 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-400 rounded-full text-sm font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Driver's License Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 space-y-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Car className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Driver's License</h3>
              </div>

              {application.hasValidDriverLicense ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">License Number</p>
                      <p className="text-neutral-900 dark:text-white font-mono font-semibold">
                        {application.licenseNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">Expiration Date</p>
                      <p className="text-neutral-900 dark:text-white font-semibold">
                        {new Date(application.licenseExpiration).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">License Suspended</p>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          application.licenseSuspended
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        }`}
                      >
                        {application.licenseSuspended ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        {application.licenseSuspended ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">Traffic Violations</p>
                      <p className="text-neutral-900 dark:text-white font-semibold">{application.trafficViolations}</p>
                    </div>
                  </div>

                  {application.suspensionExplanation && (
                    <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">Suspension Explanation</p>
                      <p className="text-neutral-900 dark:text-white">{application.suspensionExplanation}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">Reason for No License</p>
                  <p className="text-neutral-900 dark:text-white">{application.noLicenseReason || 'Not provided'}</p>
                </div>
              )}
            </motion.div>

            {/* References */}
            {application.references && application.references.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 space-y-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <UsersIcon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">References</h3>
                </div>

                <div className="space-y-4">
                  {application.references.map((ref, index) => (
                    <div
                      key={ref.id}
                      className="p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-neutral-900 dark:text-white font-semibold">Reference {index + 1}</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-neutral-500 dark:text-neutral-400">Name</p>
                          <p className="text-neutral-900 dark:text-white font-medium">{ref.name}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 dark:text-neutral-400">Phone</p>
                          <p className="text-neutral-900 dark:text-white font-medium">{ref.phone}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 dark:text-neutral-400">Position & Company</p>
                          <p className="text-neutral-900 dark:text-white font-medium">{ref.positionAndCompany}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 dark:text-neutral-400">Relationship</p>
                          <p className="text-neutral-900 dark:text-white font-medium">{ref.workRelationship}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Resume Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 space-y-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Resume</h3>
              </div>

              {application.resumeUrl ? (
                <div className="space-y-3">
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-sky-500 dark:hover:border-sky-500 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-6 h-6 text-neutral-400 dark:text-neutral-500 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors shrink-0" />
                      <div className="min-w-0">
                        <p className="text-neutral-900 dark:text-white font-semibold truncate">
                          {application.resumeFileName}
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                          {(application.resumeFileSize / 1024).toFixed(2)} KB • Uploaded{' '}
                          {new Date(application.resumeUploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-neutral-400 dark:text-neutral-500 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors shrink-0" />
                  </a>
                </div>
              ) : (
                <p className="text-neutral-400 dark:text-neutral-500">No resume uploaded</p>
              )}
            </motion.div>

            {/* Certifications & Agreements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 space-y-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <FileCheck className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Certifications & Agreements</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {application.agreeToTerms ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                  <p className="text-neutral-900 dark:text-white">Agreed to Terms & Conditions</p>
                </div>
                <div className="flex items-center gap-3">
                  {application.certifyInformation ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                  <p className="text-neutral-900 dark:text-white">Certified Information Accuracy</p>
                </div>
                <div className="flex items-center gap-3">
                  {application.authorizeBackground ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                  <p className="text-neutral-900 dark:text-white">Authorized Background Check</p>
                </div>
                <div className="flex items-center gap-3">
                  {application.understandActiveStatus ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                  <p className="text-neutral-900 dark:text-white">Understands Active Employment Status</p>
                </div>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 rounded-xl p-8 space-y-4"
            >
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">What's Next?</h3>
              <div className="space-y-3 text-neutral-700 dark:text-neutral-300">
                <p className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 shrink-0">✓</span>
                  <span>Your application has been received and added to our system.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 shrink-0">✓</span>
                  <span>Our team will review your application and qualifications.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 shrink-0">✓</span>
                  <span>If we'd like to move forward, we'll contact you at the email provided.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-sky-600 dark:text-sky-400 shrink-0">💡</span>
                  <span>Keep your contact information current so we can reach you easily.</span>
                </p>
              </div>
            </motion.div>

            {/* Back Button */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <Link href="/get-involved">
                <button className="w-full px-8 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-semibold rounded-lg transition-colors border border-neutral-200 dark:border-neutral-700">
                  Back to Get Involved
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
