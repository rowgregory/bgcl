'use client'

import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronRight,
  CreditCard,
  Heart,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Ticket,
  Trash2,
  TrendingUp,
  User,
  X
} from 'lucide-react'
import { MotionLink } from '../common/MotionLink'
import { useState } from 'react'
import { updateUserName } from '@/app/lib/actions/user/updateUserName'
import { useRouter } from 'next/navigation'
import { store } from '@/app/lib/store/store'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { setOpenPaymentMethodModal, setOpenUpdateAddressModal } from '@/app/lib/store/slices/uiSlice'
import { deleteAddress } from '@/app/lib/actions/address/deleteAddress'
import { setDefaultPaymentMethod } from '@/app/lib/actions/stripe/setDefaultPaymentMethod'
import { deletePaymentMethod } from '@/app/lib/actions/stripe/deletePaymentMethod'
import extractErrorMessage from '@/app/lib/utils/extractErrorMessage'
import { containerVariants, itemVariants } from '@/app/lib/constants/motion'
import { updatePhoneNumber } from '@/app/lib/actions/user/updatePhoneNumber'
import { formatPhone } from '@/app/lib/utils/phone.utils'

function SupporterOverviewFooter() {
  return (
    <footer className="px-6 md:px-8 lg:px-12 py-6 border-t dark:border-neutral-800 border-neutral-200 mt-16">
      <div className="max-w-334 mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs dark:text-neutral-600 text-neutral-400">
          © {new Date().getFullYear()}&nbsp; Boys &amp; Girls Club of Lynn. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="mailto:info@bgcl.org"
            className="text-xs dark:text-neutral-600 text-neutral-400 hover:dark:text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            info@bgcl.org
          </a>
          <span className="dark:text-neutral-800 text-neutral-300" aria-hidden="true">
            ·
          </span>

          <a
            href="tel:781-593-1772"
            className="text-xs dark:text-neutral-600 text-neutral-400 hover:dark:text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            (781) 593-1772
          </a>
        </div>
      </div>
    </footer>
  )
}

const SupporterOverviewClient = ({ dashboard, address, name, savedCards, phone }) => {
  const hasActivity = dashboard?.recentDonations.length > 0 || dashboard?.upcomingEvents.length > 0
  const session = useSession()
  const router = useRouter()

  const [editingName, setEditingName] = useState(false)
  const [firstName, setFirstName] = useState(name?.firstName ?? '')
  const [lastName, setLastName] = useState(name?.lastName ?? '')
  const [savingName, setSavingName] = useState(false)
  const [editingPhone, setEditingPhone] = useState(false)
  const [savingPhone, setSavingPhone] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState(phone ?? '')
  const [deletingAddress, setDeletingAddress] = useState(false)
  const displayName =
    [firstName, lastName].filter(Boolean).join(' ') || session.data?.user?.name || session.data?.user?.email

  const [deletingPaymentMethod, setDeletingPaymentMethod] = useState<string | null>(null)
  const [settingDefault, setSettingDefault] = useState<string | null>(null)

  async function handleSaveName() {
    if (!firstName.trim() && !lastName.trim()) return
    setSavingName(true)

    try {
      await updateUserName({ firstName: firstName.trim(), lastName: lastName.trim() })
      setEditingName(false)
      router.refresh()
      store.dispatch(
        showToast({
          type: 'success',
          message: 'Name Updated!',
          description: `Your name has been updated to ${[firstName.trim(), lastName.trim()].filter(Boolean).join(' ')}.`
        })
      )
    } catch (error) {
      store.dispatch(
        showToast({
          type: 'error',
          message: 'Failed to Update Name',
          description: error instanceof Error ? error.message : 'Something went wrong. Please try again.'
        })
      )
    } finally {
      setSavingName(false)
    }
  }

  async function handleSavePhone() {
    if (!phoneNumber.trim()) return
    setSavingPhone(true)

    try {
      await updatePhoneNumber({ phone: phoneNumber.trim() })
      setEditingPhone(false)
      router.refresh()
      store.dispatch(
        showToast({
          type: 'success',
          message: 'Phone Number Updated!',
          description: `Your phone number has been updated to ${[phoneNumber.trim()].filter(Boolean).join(' ')}.`
        })
      )
    } catch (error) {
      store.dispatch(
        showToast({
          type: 'error',
          message: 'Failed to Update Phone Number',
          description: error instanceof Error ? error.message : 'Something went wrong. Please try again.'
        })
      )
    } finally {
      setSavingPhone(false)
    }
  }

  async function handleDeleteAddress() {
    setDeletingAddress(true)

    try {
      await deleteAddress()
      store.dispatch(
        showToast({
          type: 'success',
          message: 'Address Removed',
          description: 'Your billing address has been cleared.'
        })
      )
      router.refresh()
    } catch (error) {
      store.dispatch(
        showToast({
          type: 'error',
          message: 'Failed to Remove Address',
          description: error instanceof Error ? error.message : 'Something went wrong.'
        })
      )
    } finally {
      setDeletingAddress(false)
    }
  }

  const handleSetDefault = async (cardId: string) => {
    setSettingDefault(cardId)
    try {
      const result = await setDefaultPaymentMethod(cardId)

      if (result.success) {
        store.dispatch(
          showToast({
            type: 'success',
            message: 'Default payment method updated',
            description: 'Your default card has been changed successfully.'
          })
        )
        router.refresh()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      store.dispatch(
        showToast({
          type: 'error',
          message: 'Failed to update default',
          description: extractErrorMessage(error)
        })
      )
    } finally {
      setSettingDefault(null)
    }
  }

  async function handleDeletePaymentMethod(stripePaymentId: string) {
    setDeletingPaymentMethod(stripePaymentId)
    try {
      const res = await deletePaymentMethod(stripePaymentId)
      store.dispatch(
        showToast(
          res.error
            ? { type: 'error', message: 'Failed to Remove Card', description: res.error }
            : { type: 'success', message: 'Card Removed', description: 'Your saved card has been permanently removed.' }
        )
      )
      if (!res.error) router.refresh()
    } catch {
      store.dispatch(
        showToast({
          type: 'error',
          message: 'Failed to Remove Card',
          description: 'Something went wrong. Please try again.'
        })
      )
    } finally {
      setDeletingPaymentMethod(null)
    }
  }

  return (
    <div className="min-h-screen dark:bg-neutral-950 bg-white">
      <main className="p-6 md:p-8 lg:p-12 space-y-10">
        <div className="max-w-334 mx-auto space-y-10">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            custom={0.5}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 relative">
                <p className="text-xs font-semibold dark:text-neutral-600 text-neutral-500 uppercase tracking-widest mb-2">
                  Your Impact
                </p>

                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black dark:text-white text-neutral-900 leading-tight">
                    Welcome, {displayName}
                  </h1>
                </div>

                <p className="dark:text-neutral-500 text-neutral-600 text-base mt-2">
                  {hasActivity
                    ? `Here's what you've accomplished with Boys & Girls Club of Lynn`
                    : 'Start making a difference with a donation or event registration'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" custom={1}>
            <dl className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {dashboard?.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="group relative dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 backdrop-blur-sm border rounded-xl p-4 overflow-hidden dark:hover:border-neutral-700 hover:border-neutral-300 transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                >
                  <div
                    className="absolute inset-0 dark:bg-linear-to-br dark:from-sky-500/5 dark:to-transparent bg-linear-to-br from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-hidden="true"
                  />
                  <div className="relative space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <dt className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider mb-1.5 truncate">
                          {stat.label}
                        </dt>
                        <dd className="text-xl lg:text-2xl font-black dark:text-white text-neutral-900">
                          {stat.value}
                        </dd>
                      </div>
                      <div
                        className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800/50 dark:group-hover:bg-sky-500/20 bg-neutral-200 group-hover:bg-sky-500/20 flex items-center justify-center transition-colors duration-300"
                        aria-hidden="true"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                      </div>
                    </div>
                    <p className="text-xs dark:text-neutral-600 text-neutral-500">{stat.subtext}</p>
                  </div>
                </motion.div>
              ))}
            </dl>
          </motion.div>

          {/* Name */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold dark:text-white text-neutral-900">Your Name</h2>
                <p className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5">
                  Used on your tickets and confirmations
                </p>
              </div>
            </div>

            <div className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 dark:text-sky-400 text-sky-600" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  {editingName ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        className="w-28 px-3 py-1.5 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-200 text-neutral-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last"
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        className="w-28 px-3 py-1.5 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-200 text-neutral-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium dark:text-white text-neutral-900">
                        {[firstName, lastName].filter(Boolean).join(' ') || (
                          <span className="dark:text-neutral-500 text-neutral-400 italic">No name set</span>
                        )}
                      </p>
                      <p className="text-xs dark:text-neutral-500 text-neutral-400 mt-0.5">
                        {session.data?.user?.email}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {editingName ? (
                  <>
                    <button
                      onClick={handleSaveName}
                      disabled={savingName}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-all disabled:opacity-50 active:scale-95"
                    >
                      {savingName ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      {savingName ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingName(false)
                        setFirstName(name?.firstName ?? '')
                        setLastName(name?.lastName ?? '')
                      }}
                      className="text-xs font-medium dark:text-neutral-400 text-neutral-500 hover:dark:text-white hover:text-neutral-900 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingName(true)}
                    className="flex items-center gap-1.5 text-xs font-medium dark:text-neutral-500 text-neutral-400 dark:hover:text-neutral-300 hover:text-neutral-600 transition-colors"
                    aria-label="Edit your name"
                  >
                    <Pencil className="w-3 h-3" aria-hidden="true" />
                    Edit
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Phone Number */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold dark:text-white text-neutral-900">Your Phone Number</h2>
                <p className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5">Used for our records only</p>
              </div>
            </div>

            <div className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 dark:text-sky-400 text-sky-600" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  {editingPhone ? (
                    <input
                      type="text"
                      value={formatPhone(phoneNumber) ?? ''}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="(555) 444-3333"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleSavePhone()}
                      className="w-40 px-3 py-1.5 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-200 text-neutral-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <>
                      <p className="text-sm font-medium dark:text-white text-neutral-900">
                        {formatPhone([phone].filter(Boolean).join(' ')) || (
                          <span className="dark:text-neutral-500 text-neutral-400 italic">No phone set</span>
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {editingPhone ? (
                  <>
                    <button
                      onClick={handleSavePhone}
                      disabled={savingPhone}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-all disabled:opacity-50 active:scale-95"
                    >
                      {savingPhone ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      {savingPhone ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingPhone(false)
                        setPhoneNumber(phone)
                      }}
                      className="text-xs font-medium dark:text-neutral-400 text-neutral-500 hover:dark:text-white hover:text-neutral-900 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingPhone(true)}
                    className="flex items-center gap-1.5 text-xs font-medium dark:text-neutral-500 text-neutral-400 dark:hover:text-neutral-300 hover:text-neutral-600 transition-colors"
                    aria-label="Edit your phone number"
                  >
                    <Pencil className="w-3 h-3" aria-hidden="true" />
                    Edit
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Compact CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            custom={1.5}
          >
            <Link
              href="/donate"
              aria-label="Make a donation to Boys & Girls Club of Lynn"
              className="flex-1 flex items-center justify-between gap-3 px-5 py-4 bg-sky-600 hover:bg-sky-500 rounded-xl transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Make a Donation</p>
                  <p className="text-sky-100 text-xs">Support our mission</p>
                </div>
              </div>
              <ArrowRight
                className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform shrink-0"
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/events"
              aria-label="Browse upcoming events"
              className="flex-1 flex items-center justify-between gap-3 px-5 py-4 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-200 border rounded-xl transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg dark:bg-neutral-700 bg-neutral-200 flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <Calendar className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <p className="dark:text-neutral-200 text-neutral-800 font-bold text-sm">Explore Events</p>
                  <p className="dark:text-neutral-400 text-neutral-500 text-xs">Browse & register</p>
                </div>
              </div>
              <ChevronRight
                className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform shrink-0"
                aria-hidden="true"
              />
            </Link>
          </motion.div>

          {/* Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Donation History */}
            <motion.section
              aria-labelledby="donations-heading"
              className="lg:col-span-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <motion.div className="space-y-4" variants={itemVariants}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 id="donations-heading" className="text-xl font-black dark:text-white text-neutral-900">
                      Donations
                    </h2>
                    <p className="text-xs dark:text-neutral-600 text-neutral-500 mt-0.5">
                      View history and manage recurring donations
                    </p>
                  </div>
                  {dashboard?.recentDonations.length > 0 && (
                    <Link
                      href="/supporter/donations"
                      className="inline-flex items-center gap-1.5 dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-500 font-semibold text-sm transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                    >
                      Manage
                      <ChevronRight
                        className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                        aria-hidden="true"
                      />
                    </Link>
                  )}
                </div>

                {dashboard?.recentDonations.length === 0 ? (
                  <div className="dark:bg-neutral-900/30 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-xl p-8 text-center">
                    <div
                      className="w-10 h-10 rounded-full dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center mx-auto mb-3"
                      aria-hidden="true"
                    >
                      <Heart className="w-5 h-5 dark:text-neutral-600 text-neutral-400" />
                    </div>
                    <p className="dark:text-neutral-400 text-neutral-600 text-sm font-medium">No donations yet</p>
                    <p className="dark:text-neutral-600 text-neutral-400 text-xs mt-1">
                      Your donation history will appear here
                    </p>
                    <Link
                      href="/donate"
                      className="inline-flex items-center gap-1.5 mt-4 text-sky-600 dark:text-sky-400 hover:text-sky-500 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                    >
                      Make your first donation
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                ) : (
                  <ul role="list" className="space-y-2 list-none p-0 m-0">
                    {dashboard?.recentDonations.map((donation) => (
                      <li key={donation.id}>
                        <MotionLink
                          href={`/order-confirmation/${donation.id}`}
                          aria-label={`${donation.type === 'ONE_TIME_DONATION' ? 'One-time' : donation.recurringFrequency === 'monthly' ? 'Monthly' : 'Yearly'} donation of $${donation.totalAmount.toFixed(2)} on ${new Date(donation.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                          className="group/item block dark:bg-neutral-900/30 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50 border-neutral-200 hover:border-neutral-300 backdrop-blur-sm border rounded-lg p-4 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                          variants={itemVariants}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div
                                className="shrink-0 w-9 h-9 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center"
                                aria-hidden="true"
                              >
                                <Heart className="w-4 h-4 text-sky-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="dark:text-white text-neutral-900 font-semibold text-sm">
                                  ${donation.totalAmount.toFixed(2)}
                                </p>
                                <p className="text-xs dark:text-neutral-600 text-neutral-500">
                                  <time dateTime={new Date(donation.createdAt).toISOString()}>
                                    {new Date(donation.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </time>
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-medium dark:text-neutral-500 dark:bg-neutral-800/50 text-neutral-600 bg-neutral-200 px-2.5 py-1 rounded-md shrink-0">
                              {donation.type === 'ONE_TIME_DONATION'
                                ? 'One-time'
                                : donation.recurringFrequency === 'monthly'
                                  ? 'Monthly'
                                  : 'Yearly'}
                            </span>
                          </div>
                        </MotionLink>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </motion.section>

            {/* Upcoming Events */}
            <motion.section
              aria-labelledby="events-heading"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <motion.div className="space-y-4" variants={itemVariants}>
                <div>
                  <h2 id="events-heading" className="text-xl font-black dark:text-white text-neutral-900">
                    Events
                  </h2>
                  <p className="text-xs dark:text-neutral-600 text-neutral-500 mt-0.5">Your registrations</p>
                </div>

                {dashboard?.upcomingEvents.length === 0 ? (
                  <div className="dark:bg-neutral-900/30 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-xl p-8 text-center">
                    <div
                      className="w-10 h-10 rounded-full dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center mx-auto mb-3"
                      aria-hidden="true"
                    >
                      <Calendar className="w-5 h-5 dark:text-neutral-600 text-neutral-400" />
                    </div>
                    <p className="dark:text-neutral-400 text-neutral-600 text-sm font-medium">No upcoming events</p>
                    <p className="dark:text-neutral-600 text-neutral-400 text-xs mt-1">
                      Events you register for will appear here
                    </p>
                    <Link
                      href="/events"
                      className="inline-flex items-center gap-1.5 mt-4 text-sky-600 dark:text-sky-400 hover:text-sky-500 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                    >
                      Browse events
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                ) : (
                  <ul role="list" className="space-y-3 list-none p-0 m-0">
                    {dashboard?.upcomingEvents?.map((group) => (
                      <li key={group.eventId}>
                        <motion.div
                          className="dark:bg-neutral-900/30 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50 border-neutral-200 hover:border-neutral-300 backdrop-blur-sm border rounded-lg p-4 transition-all duration-300"
                          variants={itemVariants}
                          whileHover={{ y: -2 }}
                        >
                          {/* Event info */}
                          <div className="flex items-start gap-3 mb-3">
                            <div
                              className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center"
                              aria-hidden="true"
                            >
                              <Calendar className="w-4 h-4 text-sky-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="dark:text-white text-neutral-900 font-semibold text-sm truncate">
                                {group.event?.title || 'Event'}
                              </p>
                              {group.event?.date ? (
                                <time
                                  dateTime={new Date(group.event.date).toISOString()}
                                  className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5 block"
                                >
                                  {new Date(group.event.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </time>
                              ) : (
                                <p className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5">Date TBA</p>
                              )}
                            </div>
                          </div>

                          {/* Tickets */}
                          <ul
                            role="list"
                            aria-label={`Tickets for ${group.event?.title || 'this event'}`}
                            className="space-y-1.5 list-none p-0 m-0 border-t dark:border-neutral-800 border-neutral-200 pt-3"
                          >
                            {group.orderItems.map((item, i) => (
                              <li key={i} className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-sky-400" aria-hidden="true" />
                                    <p className="text-xs dark:text-neutral-400 text-neutral-600 truncate">
                                      {item.ticketName}
                                    </p>
                                  </div>
                                  <span
                                    className="text-xs dark:text-neutral-500 text-neutral-500 shrink-0 ml-2"
                                    aria-label={`${item.quantity} ticket${item.quantity !== 1 ? 's' : ''}`}
                                  >
                                    x{item.quantity}
                                  </span>
                                </div>

                                {group.event.showRaffleTicketNumbers &&
                                  item.raffleTickets &&
                                  item.raffleTickets.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pl-3.5">
                                      {item.raffleTickets
                                        .slice()
                                        .sort((a, b) => a.number - b.number)
                                        .map((rt) => (
                                          <span
                                            key={rt.code}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-400 bg-sky-50 border-sky-200 text-sky-700 border"
                                          >
                                            #{String(rt.number).padStart(4, '0')}
                                          </span>
                                        ))}
                                    </div>
                                  )}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </motion.section>
          </div>

          {/* Ticket Orders */}
          {dashboard?.ticketOrders?.length > 0 && (
            <motion.section
              aria-labelledby="tickets-heading"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <motion.div className="space-y-4" variants={itemVariants}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 id="tickets-heading" className="text-xl font-black dark:text-white text-neutral-900">
                      Ticket Orders
                    </h2>
                    <p className="text-xs dark:text-neutral-600 text-neutral-500 mt-0.5">Your purchased tickets</p>
                  </div>
                  <Link
                    href="/supporter/tickets"
                    className="inline-flex items-center gap-1.5 dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-500 font-semibold text-sm transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                  >
                    View All
                    <ChevronRight
                      className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </Link>
                </div>

                <ul role="list" className="space-y-4 list-none p-0 m-0">
                  {dashboard?.ticketOrders.map((order) => {
                    // Fall back to ticket's event if order.event is null
                    const event = order.event ?? order.orderItems[0]?.ticket?.event ?? null
                    return (
                      <li key={order.id}>
                        <MotionLink
                          href={`/order-confirmation/${order.id}`}
                          aria-label={`Ticket order${event ? ` for ${event.name}` : ''}, $${order.totalAmount.toFixed(2)}, placed ${new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                          className="group/item block dark:bg-neutral-900/30 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50 border-neutral-200 hover:border-neutral-300 backdrop-blur-sm border rounded-xl p-4 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                          variants={itemVariants}
                          whileHover={{ x: 4 }}
                        >
                          {/* Event header — shown when event is available */}
                          {event && (
                            <div className="flex items-start gap-3 mb-3 pb-3 border-b dark:border-neutral-800 border-neutral-200">
                              <div
                                className="shrink-0 w-9 h-9 rounded-lg dark:bg-sky-500/10 bg-sky-50 flex items-center justify-center"
                                aria-hidden="true"
                              >
                                <Calendar className="w-4 h-4 text-sky-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="dark:text-white text-neutral-900 font-bold text-sm truncate">
                                  {event.title}
                                </p>
                                {event.date && (
                                  <time
                                    dateTime={new Date(event.date).toISOString()}
                                    className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5 block"
                                  >
                                    {new Date(event.date).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </time>
                                )}
                              </div>
                              <span className="text-xs font-medium dark:text-sky-400 text-sky-600 dark:bg-sky-500/10 bg-sky-50 px-2.5 py-1 rounded-md shrink-0">
                                {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} ticket
                                {order.orderItems.reduce((sum, item) => sum + item.quantity, 0) !== 1 ? 's' : ''}
                              </span>
                            </div>
                          )}

                          {/* Order meta row */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="shrink-0 w-9 h-9 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center"
                                aria-hidden="true"
                              >
                                <Ticket className="w-4 h-4 text-sky-400" />
                              </div>
                              <div>
                                <p className="dark:text-white text-neutral-900 font-semibold text-sm">
                                  ${order.totalAmount.toFixed(2)}
                                </p>
                                <p className="text-xs dark:text-neutral-600 text-neutral-500">
                                  <time dateTime={new Date(order.createdAt).toISOString()}>
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: 'numeric',
                                      minute: 'numeric'
                                    })}
                                  </time>
                                </p>
                              </div>
                            </div>
                            {/* Only show ticket count badge here if no event header above */}
                            {!event && (
                              <span className="text-xs font-medium dark:text-sky-400 text-sky-600 dark:bg-neutral-800/50 bg-sky-100 px-3 py-1 rounded-md shrink-0">
                                {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} ticket
                                {order.orderItems.reduce((sum, item) => sum + item.quantity, 0) !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>

                          {/* Ticket line items */}
                          <ul
                            role="list"
                            aria-label="Tickets in this order"
                            className="space-y-2 list-none p-0 m-0 border-t dark:border-neutral-800 border-neutral-200 pt-3"
                          >
                            {order?.orderItems.map((item) => (
                              <li key={item.id} className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-sky-400" aria-hidden="true" />
                                    <p className="text-sm dark:text-neutral-300 text-neutral-700 truncate">
                                      {item.ticketName}
                                    </p>
                                    {order?.event?.showRaffleTicketNumbers &&
                                      item.raffleTicketNumber &&
                                      item.raffleTicketCode && (
                                        <div className="pl-3.5">
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-400 bg-sky-50 border-sky-200 text-sky-700 border">
                                            #{String(item.raffleTicketNumber).padStart(4, '0')}
                                          </span>
                                        </div>
                                      )}
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0 ml-3">
                                    <span
                                      className="text-xs dark:text-neutral-500 text-neutral-500"
                                      aria-label={`Quantity: ${item.quantity}`}
                                    >
                                      x{item.quantity}
                                    </span>
                                    <span className="text-sm font-semibold dark:text-white text-neutral-900 tabular-nums">
                                      ${item.totalPrice.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </MotionLink>
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            </motion.section>
          )}

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold dark:text-white text-neutral-900">Payment Methods</h2>
                <p className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5">
                  Saved cards for one-click checkout
                </p>
              </div>
              <button
                onClick={() => store.dispatch(setOpenPaymentMethodModal())}
                className="flex items-center gap-1.5 text-xs font-medium dark:text-sky-400 text-sky-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:rounded"
                aria-label="Add new payment method"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                Add Card
              </button>
            </div>

            {savedCards && savedCards.length > 0 ? (
              <ul role="list" aria-label="Saved payment methods" className="space-y-2">
                {savedCards.map((card) => (
                  <li
                    key={card.id}
                    className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-xl px-4 py-3 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="shrink-0 w-9 h-6 rounded dark:bg-neutral-800 bg-white border dark:border-neutral-700 border-neutral-200 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <CreditCard className="w-4 h-4 dark:text-neutral-400 text-neutral-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium dark:text-white text-neutral-900 capitalize">
                          {card.cardBrand}&nbsp;
                          <span className="font-mono tracking-widest">••••&nbsp;{card.cardLast4}</span>
                        </p>
                        <p className="text-xs dark:text-neutral-500 text-neutral-400 mt-0.5">
                          Expires {String(card.cardExpMonth).padStart(2, '0')}/{card.cardExpYear}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {card.isDefault ? (
                        <span
                          className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20 bg-sky-50 text-sky-700 border-sky-200 border"
                          aria-label="Default payment method"
                        >
                          Default
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefault(card.id)}
                          disabled={settingDefault === card.id}
                          className="text-[10px] font-medium dark:text-neutral-500 text-neutral-400 dark:hover:text-neutral-300 hover:text-neutral-600 transition-colors disabled:opacity-50"
                          aria-label={`Set ${card.cardBrand} ending in ${card.cardLast4} as default`}
                        >
                          {settingDefault === card.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                          ) : (
                            'Set default'
                          )}
                        </button>
                      )}

                      <div className="w-px h-3 dark:bg-neutral-700 bg-neutral-300" aria-hidden="true" />

                      <button
                        onClick={() => handleDeletePaymentMethod(card.id)}
                        disabled={deletingPaymentMethod === card.id}
                        className="flex items-center gap-1 text-xs font-medium text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                        aria-label={`Remove ${card.cardBrand} ending in ${card.cardLast4}`}
                      >
                        {deletingPaymentMethod === card.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                        ) : (
                          <Trash2 className="w-3 h-3" aria-hidden="true" />
                        )}
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div
                className="dark:bg-neutral-900/50 dark:border-neutral-800 dark:border-dashed bg-neutral-50 border-neutral-200 border border-dashed rounded-xl px-4 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                role="status"
                aria-label="No saved payment methods"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <CreditCard className="w-3.5 h-3.5 dark:text-neutral-500 text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold dark:text-neutral-300 text-neutral-700">No saved cards</p>
                    <p className="text-xs dark:text-neutral-500 text-neutral-400 mt-0.5">
                      Save a card at checkout for faster payments
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => store.dispatch(setOpenPaymentMethodModal())}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  Add Card
                </button>
              </div>
            )}
          </motion.div>

          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="mb-4">
              <h2 className="text-lg font-bold dark:text-white text-neutral-900">Mailing Address</h2>
              <p className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5">
                Used for ticket delivery and correspondence
              </p>
            </div>

            {address?.addressLine1 ? (
              <div className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-xl p-4 sm:flex sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center mt-0.5"
                    aria-hidden="true"
                  >
                    <MapPin className="w-3.5 h-3.5 dark:text-sky-400 text-sky-600" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider">
                      Mailing Address
                    </p>
                    <p className="text-sm font-medium dark:text-white text-neutral-900 truncate">
                      {address.addressLine1}
                    </p>
                    {address.addressLine2 && (
                      <p className="text-sm dark:text-neutral-400 text-neutral-600 truncate">{address.addressLine2}</p>
                    )}
                    <p className="text-sm dark:text-neutral-400 text-neutral-600 truncate">
                      {[address.city, address.state, address.zipPostalCode].filter(Boolean).join(', ')}
                    </p>
                    {address.country && (
                      <p className="text-sm dark:text-neutral-400 text-neutral-600">{address.country}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 dark:border-neutral-800 border-neutral-200">
                  <button
                    onClick={() => store.dispatch(setOpenUpdateAddressModal(address))}
                    aria-label="Edit mailing address"
                    className="flex items-center gap-1.5 text-xs font-medium dark:text-neutral-500 text-neutral-400 dark:hover:text-neutral-300 hover:text-neutral-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                  >
                    <Pencil className="w-3 h-3" aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteAddress}
                    disabled={deletingAddress}
                    aria-label="Remove mailing address"
                    className="flex items-center gap-1.5 text-xs font-medium text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                  >
                    {deletingAddress ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                        Removing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3 h-3" aria-hidden="true" />
                        Remove
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="dark:bg-neutral-900/50 dark:border-neutral-800 dark:border-dashed bg-neutral-50 border-neutral-200 border border-dashed rounded-xl p-4">
                <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
                  <div className="flex items-center gap-3">
                    <div
                      className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <MapPin className="w-3.5 h-3.5 dark:text-neutral-500 text-neutral-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold dark:text-neutral-300 text-neutral-700">
                        No mailing address on file
                      </p>
                      <p className="text-xs dark:text-neutral-500 text-neutral-400 mt-0.5">
                        Required for physical ticket delivery and checkout
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => store.dispatch(setOpenUpdateAddressModal({}))}
                    aria-label="Add mailing address"
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 w-full sm:w-auto justify-center"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    Add Address
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <SupporterOverviewFooter />
    </div>
  )
}

export default SupporterOverviewClient
