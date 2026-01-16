import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { createPaymentIntentForCheckout } from '@/app/lib/actions/createPaymentIntentForCheckout'
import { useSession } from 'next-auth/react'
import { savePaymentMethod } from '@/app/lib/actions/savePaymentMethod'
import Link from 'next/link'
import CustomSwitch from '../common/CustomSwitch'
import Pusher from 'pusher-js'
import { useRouter } from 'next/navigation'
import { createSetupIntentForSubscription } from '@/app/lib/actions/createSetupIntentForSubscription'
import { createSubscriptionAfterSetup } from '@/app/lib/actions/createSubscriptionAfterSetup'

const MONTHLY_PLANS = [
  {
    id: 'monthly_supporter',
    name: 'Supporter',
    amount: 250,
    description: 'Support our monthly programs',
    features: ['Monthly impact report', 'Donor recognition (optional)']
  },
  {
    id: 'monthly_champion',
    name: 'Champion',
    amount: 500,
    description: 'Make a bigger difference',
    features: ['Monthly impact report', 'Donor recognition', 'Exclusive updates'],
    highlighted: true
  },
  {
    id: 'monthly_leader',
    name: 'Leader',
    amount: 1000,
    description: 'Lead lasting change',
    features: ['Monthly impact report', 'Donor recognition', 'Exclusive updates', 'Annual thank you event']
  },
  {
    id: 'monthly_founder',
    name: 'Founder',
    amount: 2500,
    description: 'Transform the community',
    features: [
      'Monthly impact report',
      'Donor recognition',
      'Exclusive updates',
      'Annual thank you event',
      'Board meeting invitations',
      'Naming opportunity'
    ]
  }
]

const YEARLY_PLANS = [
  { id: 'yearly-3000', name: 'Supporter', description: 'Annual support for our mission', amount: 3000 },
  { id: 'yearly-6000', name: 'Champion', description: 'Sustained commitment to youth', amount: 6000 },
  { id: 'yearly-12000', name: 'Hero', description: 'Major annual investment', amount: 12000 }
]

function DonationForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [donationType, setDonationType] = useState<'once' | 'monthly' | 'yearly'>('once')
  const [amount, setAmount] = useState(50)
  const [selectedPlan, setSelectedPlan] = useState('')
  const [saveCard, setSaveCard] = useState(false)
  const session = useSession()
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle')
  const router = useRouter()

  const getAmount = () => {
    if (donationType === 'once') return amount
    if (donationType === 'monthly') {
      const plan = MONTHLY_PLANS.find((p) => p.id === selectedPlan)
      return plan?.amount || amount
    }
    const plan = YEARLY_PLANS.find((p) => p.id === selectedPlan)
    return plan?.amount || amount
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setLoading(true)
    setError('')
    setProcessingStatus('processing')

    try {
      const finalAmount = Math.round(getAmount() * 100)

      if (donationType === 'once') {
        // One-time donation flow
        const intentResult = await createPaymentIntentForCheckout({
          userId: session?.data?.user?.id,
          email,
          amount: finalAmount,
          orderType: 'ONE_TIME_DONATION',
          description: `One-time donation from ${name}`,
          saveCard
        })

        if (!intentResult.success) {
          throw new Error(intentResult.error || 'Failed to create payment intent')
        }

        const { clientSecret } = intentResult
        const cardElement = elements.getElement(CardElement)
        if (!cardElement) throw new Error('Card element not found')

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: { name, email }
          }
        })

        if (result.error) {
          setProcessingStatus('failed')
          setError(result.error.message || 'Payment failed')
          return
        }

        // Setup Pusher for one-time donation
        const paymentIntentId = result.paymentIntent?.id
        const channelId = session?.data?.user?.id || `guest-${paymentIntentId}`

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
        })

        const channel = pusher.subscribe(`payment-${channelId}`)

        const timeout = setTimeout(() => {
          if (processingStatus === 'processing') {
            setError('Order processing timeout. Please check your email for confirmation.')
            setProcessingStatus('failed')
          }
        }, 10000)

        channel.bind('order-created', (data: any) => {
          clearTimeout(timeout)
          setProcessingStatus('success')

          if (donationType === 'once' && saveCard && session?.data?.user?.id && result.paymentIntent?.payment_method) {
            savePaymentMethod(session.data.user.id, result.paymentIntent.payment_method as string, true).catch(
              console.error
            )
          }

          setTimeout(() => router.push(`/order-confirmation/${data.orderId}`), 1000)
          channel.unbind('order-created')
        })

        channel.bind('order-failed', (data: any) => {
          clearTimeout(timeout)
          setProcessingStatus('failed')
          setError(data.error || 'Order processing failed')
          channel.unbind('order-created')
          channel.unbind('order-failed')
        })
      } else {
        // Recurring donation flow - SetupIntent
        const setupResult = await createSetupIntentForSubscription({
          userId: session?.data?.user?.id,
          email,
          name,
          amount: finalAmount,
          frequency: donationType === 'monthly' ? 'monthly' : 'yearly'
        })

        if (!setupResult.success) {
          throw new Error(setupResult.error || 'Failed to create setup intent')
        }

        const { clientSecret, setupIntentId } = setupResult
        const cardElement = elements.getElement(CardElement)
        if (!cardElement) throw new Error('Card element not found')

        // Confirm card setup
        const result = await stripe.confirmCardSetup(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: { name, email }
          }
        })

        if (result.error) {
          setProcessingStatus('failed')
          setError(result.error.message || 'Card confirmation failed')
          return
        }

        // Create subscription with confirmed card
        const subscriptionResult = await createSubscriptionAfterSetup({
          setupIntentId,
          frequency: donationType === 'monthly' ? 'monthly' : 'yearly',
          amount: finalAmount
        })

        if (!subscriptionResult.success) {
          throw new Error(subscriptionResult.error || 'Failed to create subscription')
        }

        // NEW: Wait for order via Pusher
        const channelId = session?.data?.user?.id || `guest-${subscriptionResult.subscriptionId}`

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
        })

        const channel = pusher.subscribe(`payment-${channelId}`)

        const timeout = setTimeout(() => {
          if (processingStatus === 'processing') {
            setError('Order processing timeout. Please check your email for confirmation.')
            setProcessingStatus('failed')
          }
        }, 10000)

        channel.bind('order-created', (data: any) => {
          clearTimeout(timeout)
          setProcessingStatus('success')
          setTimeout(() => router.push(`/order-confirmation/${data.orderId}`), 1000)
          channel.unbind('order-created')
        })

        channel.bind('order-failed', (data: any) => {
          clearTimeout(timeout)
          setProcessingStatus('failed')
          setError(data.error || 'Order processing failed')
          channel.unbind('order-created')
          channel.unbind('order-failed')
        })
      }
    } catch (err) {
      console.error('Full error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setProcessingStatus('failed')
    } finally {
      setLoading(false)
    }
  }

  const isMonthlyValid = (donationType === 'monthly' || donationType === 'yearly') && selectedPlan
  const isValid = email && name && (donationType === 'once' || isMonthlyValid)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Donation Type Selection */}
      <div className="grid grid-cols-3 gap-2 mb-8">
        <button
          type="button"
          onClick={() => setDonationType('once')}
          className={`p-3 rounded-lg border-2 transition-all text-center ${
            donationType === 'once'
              ? 'dark:border-sky-500 dark:bg-sky-500/10 border-sky-500 bg-sky-500/10'
              : 'dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 border-neutral-200 bg-neutral-100 hover:border-neutral-300'
          }`}
        >
          <p
            className={`font-semibold text-sm ${donationType === 'once' ? 'dark:text-white text-neutral-900' : 'dark:text-zinc-300 text-neutral-700'}`}
          >
            One-Time
          </p>
          <p
            className={`text-xs ${donationType === 'once' ? 'dark:text-zinc-400 text-neutral-600' : 'dark:text-zinc-400 text-neutral-500'}`}
          >
            Single donation
          </p>
        </button>

        <button
          type="button"
          onClick={() => setDonationType('monthly')}
          className={`p-3 rounded-lg border-2 transition-all text-center ${
            donationType === 'monthly'
              ? 'dark:border-sky-500 dark:bg-sky-500/10 border-sky-500 bg-sky-500/10'
              : 'dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 border-neutral-200 bg-neutral-100 hover:border-neutral-300'
          }`}
        >
          <p
            className={`font-semibold text-sm ${donationType === 'monthly' ? 'dark:text-white text-neutral-900' : 'dark:text-zinc-300 text-neutral-700'}`}
          >
            Monthly
          </p>
          <p
            className={`text-xs ${donationType === 'monthly' ? 'dark:text-zinc-400 text-neutral-600' : 'dark:text-zinc-400 text-neutral-500'}`}
          >
            Recurring support
          </p>
        </button>

        <button
          type="button"
          onClick={() => setDonationType('yearly')}
          className={`p-3 rounded-lg border-2 transition-all text-center ${
            donationType === 'yearly'
              ? 'dark:border-sky-500 dark:bg-sky-500/10 border-sky-500 bg-sky-500/10'
              : 'dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 border-neutral-200 bg-neutral-100 hover:border-neutral-300'
          }`}
        >
          <p
            className={`font-semibold text-sm ${donationType === 'yearly' ? 'dark:text-white text-neutral-900' : 'dark:text-zinc-300 text-neutral-700'}`}
          >
            Yearly
          </p>
          <p
            className={`text-xs ${donationType === 'yearly' ? 'dark:text-zinc-400 text-neutral-600' : 'dark:text-zinc-400 text-neutral-500'}`}
          >
            Annual subscription
          </p>
        </button>
      </div>

      {/* Monthly Plans */}
      {donationType === 'monthly' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <p className="text-sm font-medium dark:text-zinc-300 text-neutral-700">Select a monthly plan:</p>
          <div className="grid grid-cols-1 gap-3">
            {MONTHLY_PLANS.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedPlan === plan.id
                    ? 'dark:border-sky-500 dark:bg-sky-500/10 border-sky-500 bg-sky-500/10'
                    : 'dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 border-neutral-200 bg-neutral-100 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold dark:text-white text-neutral-900">{plan.name}</p>
                    <p className="text-sm dark:text-zinc-400 text-neutral-600">{plan.description}</p>
                  </div>
                  <p className="text-lg font-bold dark:text-sky-400 text-sky-600">${plan.amount}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {donationType === 'yearly' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <p className="text-sm font-medium dark:text-zinc-300 text-neutral-700">Select a yearly plan:</p>
          <div className="grid grid-cols-1 gap-3">
            {YEARLY_PLANS.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedPlan === plan.id
                    ? 'dark:border-sky-500 dark:bg-sky-500/10 border-sky-500 bg-sky-500/10'
                    : 'dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 border-neutral-200 bg-neutral-100 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold dark:text-white text-neutral-900">{plan.name}</p>
                    <p className="text-sm dark:text-zinc-400 text-neutral-600">{plan.description}</p>
                  </div>
                  <p className="text-lg font-bold dark:text-sky-400 text-sky-600">${plan.amount}/yr</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* One-Time Amount */}
      {donationType === 'once' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <p className="text-sm font-medium dark:text-zinc-300 text-neutral-700">Donation amount:</p>
          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 100, 250].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt)}
                className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                  amount === amt
                    ? 'dark:border-sky-500 dark:bg-sky-600 dark:text-white border-sky-500 bg-sky-600 text-white'
                    : 'dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 border-neutral-200 bg-neutral-100 text-neutral-900 hover:border-neutral-300'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
          <div>
            <label className="text-sm font-medium dark:text-zinc-300 text-neutral-700 block mb-2">Custom amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-zinc-500 text-neutral-600">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 dark:placeholder-zinc-600 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-500"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Contact Information */}
      <div className="space-y-4 pt-4 dark:border-zinc-700 border-t border-neutral-200">
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300 text-neutral-700 mb-2">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 dark:placeholder-zinc-600 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-500"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300 text-neutral-700 mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 dark:placeholder-zinc-600 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-500"
            placeholder="john@example.com"
            required
          />
        </div>
      </div>

      {donationType === 'once' && session.status === 'unauthenticated' && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-6">
          <p className="text-xs text-amber-400">
            <Link href="/auth/login" className="font-semibold hover:text-amber-300 underline">
              Sign in
            </Link>{' '}
            to save your card for faster donations
          </p>
        </div>
      )}

      {donationType === 'once' && session.status === 'authenticated' && (
        <CustomSwitch
          checked={saveCard}
          onChange={setSaveCard}
          label="Save card for future donations"
          description="One-click checkout next time"
        />
      )}

      {(donationType === 'monthly' || donationType === 'yearly') && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-6">
          <p className="text-xs text-blue-400">
            Your card will be saved and charged{' '}
            {donationType === 'monthly'
              ? `on the ${new Date().getDate()}th of each month`
              : `every year on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
            .
          </p>
        </div>
      )}

      {/* Payment Information */}
      <div className="space-y-3 pt-4 dark:border-zinc-700 border-t border-neutral-200">
        <p className="text-sm font-medium dark:text-zinc-300 text-neutral-700">Payment Information</p>
        <div className="p-4 border dark:border-zinc-700 dark:bg-zinc-900 border-neutral-200 rounded-lg bg-neutral-50">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#0a0a0a',
                  '::placeholder': { color: '#999999' }
                },
                invalid: { color: '#fca5a5' }
              }
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full px-6 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 dark:active:bg-sky-800 dark:disabled:bg-zinc-700 dark:text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          />
        ) : (
          <Heart className="w-4 h-4" />
        )}
        <span>
          {loading
            ? 'Processing...'
            : `Donate $${
                donationType === 'once'
                  ? amount
                  : donationType === 'monthly'
                    ? MONTHLY_PLANS.find((p) => p.id === selectedPlan)?.amount || amount
                    : YEARLY_PLANS.find((p) => p.id === selectedPlan)?.amount || amount
              }${donationType !== 'once' ? `/${donationType === 'monthly' ? 'mo' : 'yr'}` : ''}`}
        </span>
      </button>

      <p className="text-xs dark:text-zinc-500 text-neutral-600 text-center">Your payment is secure and encrypted</p>
    </form>
  )
}

export default DonationForm
