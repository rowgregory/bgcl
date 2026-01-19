'use client'

import React, { JSX, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Users,
  Key,
  Mail,
  Database,
  Shield,
  Bell,
  Save,
  RotateCcw,
  AlertTriangle,
  Download,
  Upload
} from 'lucide-react'

interface SettingField {
  label: string
  description: string
  type: 'text' | 'email' | 'number' | 'password' | 'toggle' | 'select'
  value: string | number | boolean
  options?: string[]
}

interface SettingSection {
  id: string
  title: string
  description: string
  icon: React.ElementType
  fields: Record<string, SettingField>
}

const OperationsPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('general')
  const [hasChanges, setHasChanges] = useState<boolean>(false)

  const [settings, setSettings] = useState<Record<string, SettingSection>>({
    general: {
      id: 'general',
      title: 'General Settings',
      description: 'Basic configuration for your organization',
      icon: Settings,
      fields: {
        organizationName: {
          label: 'Organization Name',
          description: 'The name of your organization',
          type: 'text',
          value: 'Boys & Girls Club of Lynn'
        },
        tagline: {
          label: 'Tagline',
          description: 'Short description of your organization',
          type: 'text',
          value: 'Empowering youth to reach their full potential'
        },
        timezone: {
          label: 'Timezone',
          description: 'Default timezone for events and scheduling',
          type: 'select',
          value: 'America/New_York',
          options: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles']
        },
        language: {
          label: 'Language',
          description: 'Default language for the platform',
          type: 'select',
          value: 'English',
          options: ['English', 'Spanish', 'French']
        },
        maintenanceMode: {
          label: 'Maintenance Mode',
          description: 'Enable to show maintenance page to users',
          type: 'toggle',
          value: false
        },
        enableRegistration: {
          label: 'Public Registration',
          description: 'Allow new users to register on the platform',
          type: 'toggle',
          value: true
        }
      }
    },
    users: {
      id: 'users',
      title: 'User Management',
      description: 'Configure user roles and permissions',
      icon: Users,
      fields: {
        defaultRole: {
          label: 'Default User Role',
          description: 'Role assigned to new users',
          type: 'select',
          value: 'Member',
          options: ['Member', 'Parent', 'Staff', 'Admin']
        },
        requireEmailVerification: {
          label: 'Email Verification',
          description: 'Require users to verify email before access',
          type: 'toggle',
          value: true
        },
        sessionTimeout: {
          label: 'Session Timeout (minutes)',
          description: 'Auto-logout inactive users after this duration',
          type: 'number',
          value: 60
        },
        maxLoginAttempts: {
          label: 'Max Login Attempts',
          description: 'Lock account after this many failed attempts',
          type: 'number',
          value: 5
        },
        passwordMinLength: {
          label: 'Minimum Password Length',
          description: 'Required minimum password length',
          type: 'number',
          value: 8
        },
        requireStrongPassword: {
          label: 'Require Strong Passwords',
          description: 'Enforce uppercase, lowercase, numbers, and symbols',
          type: 'toggle',
          value: true
        }
      }
    },
    api: {
      id: 'api',
      title: 'API & Integrations',
      description: 'Manage API keys and third-party integrations',
      icon: Key,
      fields: {
        webhookUrl: {
          label: 'Webhook URL',
          description: 'URL to receive webhook notifications',
          type: 'text',
          value: 'https://bgclynn.org/api/webhooks'
        },
        rateLimitPerHour: {
          label: 'API Rate Limit (per hour)',
          description: 'Maximum API requests allowed per hour',
          type: 'number',
          value: 1000
        },
        enableApiLogging: {
          label: 'API Logging',
          description: 'Log all API requests for debugging',
          type: 'toggle',
          value: true
        }
      }
    },
    email: {
      id: 'email',
      title: 'Email Configuration',
      description: 'Configure email delivery settings',
      icon: Mail,
      fields: {
        smtpHost: {
          label: 'SMTP Host',
          description: 'Your email server hostname',
          type: 'text',
          value: 'smtp.gmail.com'
        },
        smtpPort: {
          label: 'SMTP Port',
          description: 'Port number for SMTP server',
          type: 'number',
          value: 587
        },
        smtpUsername: {
          label: 'SMTP Username',
          description: 'Email account username',
          type: 'email',
          value: 'info@bgclynn.org'
        },
        smtpPassword: {
          label: 'SMTP Password',
          description: 'Email account password',
          type: 'password',
          value: '••••••••••••'
        },
        fromEmail: {
          label: 'From Email',
          description: 'Default sender email address',
          type: 'email',
          value: 'noreply@bgclynn.org'
        },
        fromName: {
          label: 'From Name',
          description: 'Default sender name',
          type: 'text',
          value: 'Boys & Girls Club of Lynn'
        },
        enableEmailNotifications: {
          label: 'Email Notifications',
          description: 'Send automated email notifications',
          type: 'toggle',
          value: true
        }
      }
    },
    notifications: {
      id: 'notifications',
      title: 'Notification Settings',
      description: 'Configure push notifications and alerts',
      icon: Bell,
      fields: {
        enablePushNotifications: {
          label: 'Push Notifications',
          description: 'Enable mobile push notifications',
          type: 'toggle',
          value: true
        },
        notifyNewRegistration: {
          label: 'New User Registration',
          description: 'Notify admins when new users register',
          type: 'toggle',
          value: true
        },
        notifyNewDonation: {
          label: 'New Donation',
          description: 'Notify admins of new donations',
          type: 'toggle',
          value: true
        },
        notifyEventRegistration: {
          label: 'Event Registration',
          description: 'Notify admins of event registrations',
          type: 'toggle',
          value: false
        },
        digestFrequency: {
          label: 'Digest Email Frequency',
          description: 'How often to send summary emails',
          type: 'select',
          value: 'Daily',
          options: ['Never', 'Daily', 'Weekly', 'Monthly']
        }
      }
    },
    security: {
      id: 'security',
      title: 'Security & Privacy',
      description: 'Configure security and privacy settings',
      icon: Shield,
      fields: {
        enableTwoFactor: {
          label: 'Two-Factor Authentication',
          description: 'Require 2FA for admin accounts',
          type: 'toggle',
          value: true
        },
        enforceHttps: {
          label: 'Enforce HTTPS',
          description: 'Redirect all HTTP traffic to HTTPS',
          type: 'toggle',
          value: true
        },
        enableCaptcha: {
          label: 'CAPTCHA Protection',
          description: 'Use CAPTCHA on registration and login forms',
          type: 'toggle',
          value: true
        },
        ipWhitelist: {
          label: 'IP Whitelist',
          description: 'Comma-separated list of allowed IPs for admin access',
          type: 'text',
          value: ''
        },
        dataRetentionDays: {
          label: 'Data Retention (days)',
          description: 'How long to keep deleted data before permanent removal',
          type: 'number',
          value: 30
        },
        enableAuditLog: {
          label: 'Audit Logging',
          description: 'Log all admin actions for compliance',
          type: 'toggle',
          value: true
        }
      }
    },
    database: {
      id: 'database',
      title: 'Database & Backup',
      description: 'Manage database backups and maintenance',
      icon: Database,
      fields: {
        autoBackup: {
          label: 'Automatic Backups',
          description: 'Enable scheduled database backups',
          type: 'toggle',
          value: true
        },
        backupFrequency: {
          label: 'Backup Frequency',
          description: 'How often to backup the database',
          type: 'select',
          value: 'Daily',
          options: ['Hourly', 'Daily', 'Weekly', 'Monthly']
        },
        backupRetention: {
          label: 'Backup Retention (days)',
          description: 'How long to keep backups',
          type: 'number',
          value: 30
        },
        compressionEnabled: {
          label: 'Backup Compression',
          description: 'Compress backups to save storage space',
          type: 'toggle',
          value: true
        }
      }
    }
  })

  const handleFieldChange = (sectionId: string, fieldId: string, value: string | number | boolean): void => {
    setSettings((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        fields: {
          ...prev[sectionId].fields,
          [fieldId]: {
            ...prev[sectionId].fields[fieldId],
            value
          }
        }
      }
    }))
    setHasChanges(true)
  }

  const handleSave = (): void => {
    // Here you would save to your database
    setHasChanges(false)
    alert('Settings saved successfully!')
  }

  const handleReset = (): void => {
    if (window.confirm('Are you sure you want to discard all changes?')) {
      // Reset to original settings from database
      setHasChanges(false)
    }
  }

  const handleBackupNow = (): void => {
    alert('Creating database backup...')
  }

  const handleRestoreBackup = (): void => {
    if (window.confirm('Are you sure you want to restore from backup? This will overwrite current data.')) {
      alert('Restoring from backup...')
    }
  }

  const renderField = (sectionId: string, fieldId: string, field: SettingField): JSX.Element => {
    switch (field.type) {
      case 'toggle':
        return (
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white mb-1 block">{field.label}</label>
              <p className="text-xs text-neutral-500">{field.description}</p>
            </div>
            <button
              onClick={() => handleFieldChange(sectionId, fieldId, !field.value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                field.value ? 'bg-indigo-600' : 'bg-neutral-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  field.value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        )

      case 'select':
        return (
          <div>
            <label className="text-sm font-medium text-white mb-1 block">{field.label}</label>
            <p className="text-xs text-neutral-500 mb-2">{field.description}</p>
            <select
              value={String(field.value)}
              onChange={(e) => handleFieldChange(sectionId, fieldId, e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )

      default:
        return (
          <div>
            <label className="text-sm font-medium text-white mb-1 block">{field.label}</label>
            <p className="text-xs text-neutral-500 mb-2">{field.description}</p>
            <input
              type={field.type}
              value={String(field.value)}
              onChange={(e) => {
                const value = field.type === 'number' ? Number(e.target.value) : e.target.value
                handleFieldChange(sectionId, fieldId, value)
              }}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        )
    }
  }

  const sections = Object.values(settings)
  const currentSection = settings[activeSection]

  return (
    <div className="min-h-screen dark:bg-neutral-950 bg-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-br from-indigo-600 to-purple-600 rounded-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Operations Panel</h1>
                <p className="text-sm text-neutral-400">System Settings & Configuration</p>
              </div>
            </div>

            {/* Action Buttons */}
            {hasChanges && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors border border-neutral-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-400 mb-1">Careful with System Settings</h3>
              <p className="text-xs text-neutral-400">
                Changes to these settings can affect the entire platform. Make sure you understand the impact before
                saving.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="dark:bg-neutral-900 bg-white rounded-lg border border-neutral-800 p-4">
              <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-4">Settings</h2>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="truncate">{section.title}</span>
                    </button>
                  )
                })}
              </nav>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-neutral-800">
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleBackupNow}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-lg transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Backup Now
                  </button>
                  <button
                    onClick={handleRestoreBackup}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-lg transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    Restore Backup
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="dark:bg-neutral-900 bg-white rounded-lg border border-neutral-800 p-6">
              {/* Section Header */}
              <div className="mb-6 pb-6 border-b border-neutral-800">
                <div className="flex items-start gap-3">
                  {React.createElement(currentSection.icon, {
                    className: 'w-6 h-6 text-indigo-400 mt-1'
                  })}
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">{currentSection.title}</h2>
                    <p className="text-sm text-neutral-400">{currentSection.description}</p>
                  </div>
                </div>
              </div>

              {/* Settings Fields */}
              <div className="space-y-6">
                {Object.entries(currentSection.fields).map(([fieldId, field]) => (
                  <div key={fieldId} className="pb-6 border-b border-neutral-800 last:border-b-0 last:pb-0">
                    {renderField(activeSection, fieldId, field)}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default OperationsPanel
