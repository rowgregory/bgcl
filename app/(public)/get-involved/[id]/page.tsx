'use client'

import { jobApplicationStatusConfig, POSITION_LABELS } from '@/app/lib/constants/job-application.constants'
import { PositionType } from '@prisma/client'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, FileText, Download, XCircle, FileCheck, UsersIcon, Car } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

const JobApplicationPage = ({ application }) => {
  useEffect(() => {
    window.scrollTo({ behavior: 'smooth', top: 0 })
  }, [])

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

  const statusInfo = jobApplicationStatusConfig[application.status]
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-sky-50 to-white dark:from-neutral-900 dark:to-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 dark:text-green-400 mx-auto" />
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">Application Submitted</h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto">
              Thank you for your interest in joining the Boys & Girls Club of Lynn. We appreciate the time you took to
              apply.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        {/* Confirmation Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 rounded-xl p-8 space-y-4"
        >
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">What happens next?</h3>
          <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <p>
              Our team will carefully review your application. If your qualifications match our current needs, we will
              be in contact with you{' '}
              <span className="font-semibold text-neutral-900 dark:text-white">within two weeks</span> to discuss next
              steps.
            </p>
            <p>
              Due to the high volume of applications we receive, we are only able to reach out to candidates who best
              meet the requirements for the role. If you do not hear from us within this timeframe, it means we have
              decided not to move forward with your application at this time.
            </p>
            <p>We truly appreciate your interest in supporting our mission and wish you the best in your job search.</p>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 pt-2 border-t border-sky-200 dark:border-sky-500/30">
            A confirmation email has been sent to{' '}
            <span className="font-semibold text-neutral-900 dark:text-white">{application.email}</span>.
          </p>
        </motion.div>

        {/* Position & Background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 space-y-6 shadow-sm"
        >
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Position & Background</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {application.positionTypes?.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                  Positions Applied For
                </h4>
                <div className="flex flex-wrap gap-2">
                  {application.positionTypes.map((position: PositionType) => (
                    <span
                      key={position}
                      className="px-3 py-1 text-xs font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full"
                    >
                      {POSITION_LABELS[position] ?? position}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {application.youthOrgEmployment && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                  Youth Organization Employment
                </h4>
                <p className="text-neutral-900 dark:text-white text-sm leading-relaxed">
                  {application.youthOrgEmployment}
                </p>
              </div>
            )}

            {application.education && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                  Education
                </h4>
                <p className="text-neutral-900 dark:text-white text-sm leading-relaxed">{application.education}</p>
              </div>
            )}

            {application.extracurricularsSkills && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                  Extracurricular Activities & Skills
                </h4>
                <p className="text-neutral-900 dark:text-white text-sm leading-relaxed">
                  {application.extracurricularsSkills}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Application Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 space-y-6 shadow-sm"
        >
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Application Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
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

            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
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
                  <p className="text-neutral-900 dark:text-white font-semibold text-sm">{application.hoursAvailable}</p>
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
        </motion.div>

        {/* Driver's License */}
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
            transition={{ delay: 0.25 }}
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
                  <h4 className="text-neutral-900 dark:text-white font-semibold">Reference {index + 1}</h4>
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

        {/* Resume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 space-y-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Resume</h3>
          </div>

          {application.resumeUrl ? (
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
          ) : (
            <p className="text-neutral-400 dark:text-neutral-500">No resume uploaded</p>
          )}
        </motion.div>

        {/* Certifications & Agreements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
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

        {/* Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 text-center space-y-3 shadow-sm"
        >
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Questions?</h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Reach out to us directly and we'd be happy to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
            <a
              href="tel:781-593-1772"
              className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold transition-colors"
            >
              (781) 593-1772
            </a>
            <span className="hidden sm:block text-neutral-300 dark:text-neutral-700">|</span>
            <a
              href="mailto:info@bgcl.org"
              className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold transition-colors"
            >
              info@bgcl.org
            </a>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          <Link href="/get-involved">
            <button className="w-full px-8 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-semibold rounded-lg transition-colors border border-neutral-200 dark:border-neutral-700">
              Back to Get Involved
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default JobApplicationPage
