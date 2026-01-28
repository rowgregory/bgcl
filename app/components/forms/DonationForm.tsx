import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createPaymentIntentForCheckout } from '@/app/lib/actions/createPaymentIntentForCheckout'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import CustomSwitch from '../common/CustomSwitch'
import { createSetupIntentForSubscription } from '@/app/lib/actions/createSetupIntentForSubscription'
import { createSubscriptionAfterSetup } from '@/app/lib/actions/createSubscriptionAfterSetup'
import { ICampaign } from '@/types/entities/campaign'
import { getSavedPaymentMethods } from '@/app/lib/actions/getSavedPaymentMethods'
import { useDonationPayment } from '@/app/lib/hooks/useDonationPayment'
import { createSubscriptionWithSavedCard } from '@/app/lib/actions/createSubscriptionWithSavedCard'
import DonationTypeSelection from '../donate-form/DonationTypeSelection'
import { MONTHLY_PLANS, ONE_TIME_PLANS, YEARLY_PLANS } from '@/app/lib/constants/donate-page'
import MonthlyPlans from '../donate-form/MonthlyPlans'
import YearlyPlans from '../donate-form/YearlyPlans'
import OneTimeAmount from '../donate-form/OneTimeAmount'
import AddressInformation from '../donate-form/AddressInformation'
import CampaignSelectionAndNotes from '../donate-form/CampaignSelectionAndNotes'
import SavedCardsSelection from '../donate-form/SavedCardsSelection'
import ContactInformation from '../donate-form/ContactInformation'
import SubmitButton from '../donate-form/SubmitButton'
import { useApplicationSelector } from '@/app/lib/store/store'

function DonationForm({ campaignName, campaigns }) {
  const stripe = useStripe()
  const elements = useElements()
  const session = useSession()
  const [email, setEmail] = useState<string>('sqysh@sqysh.io')
  const [name, setName] = useState<string>('Gregory Row')
  const [error, setError] = useState<string>('')
  const [amount, setAmount] = useState(50)
  const [selectedPlan, setSelectedPlan] = useState<string>('once_friend')
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle')
  const [donationType, setDonationType] = useState<'once' | 'monthly' | 'yearly'>('once')
  const [address, setAddress] = useState<string>('330 Paradise Rd')
  const [city, setCity] = useState<string>('Swampscott')
  const [state, setState] = useState<string>('MA')
  const [zipCode, setZipCode] = useState<string>('01907')
  const [country, setCountry] = useState<string>('United States')
  const [notes, setNotes] = useState<string>('This is a test!')
  const [campaign, setCampaign] = useState<ICampaign | null>(null)
  const [savedCards, setSavedCards] = useState([])
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [saveCard, setSaveCard] = useState<boolean>(false)
  const [useNewCard, setUseNewCard] = useState<boolean>(false)
  const [coverFees, setCoverFees] = useState<boolean>(true)
  const { isDark } = useApplicationSelector()
  const { setupPusherListenerOneTime, getPaymentMethodId, setupPusherListenerRecurring } = useDonationPayment()

  useEffect(() => {
    if (campaignName && campaigns) {
      // Find the campaign object by name
      const foundCampaign = campaigns.find((c: ICampaign) => c.name === campaignName)
      if (foundCampaign) {
        setCampaign(foundCampaign)
      }
    }
  }, [campaignName, campaigns])

  useEffect(() => {
    if (session.status === 'authenticated') {
      getSavedPaymentMethods().then((result) => {
        if (result.success) {
          setSavedCards(result.data)
          // Auto-select default card
          const defaultCard = result.data.find((c) => c.isDefault)
          if (defaultCard) {
            setSelectedCardId(defaultCard.stripePaymentId) // ✅ Use stripePaymentId
          }
        }
      })
    }
  }, [session.status])

  // Calculate fees so you receive the exact donation amount
  const calculateFees = (donationAmount: number) => {
    const amount = parseFloat(donationAmount.toString()) || 0
    // Formula: (amount + 0.30) / (1 - 0.022) - amount
    // This ensures after Stripe takes fees, you get the original amount
    const totalNeeded = (amount + 0.3) / (1 - 0.022)
    return totalNeeded - amount
  }

  const getAmount = () => {
    // If a preset plan is selected, get its amount
    if (selectedPlan && !selectedPlan.includes('custom')) {
      const plans = donationType === 'monthly' ? MONTHLY_PLANS : donationType === 'once' ? ONE_TIME_PLANS : YEARLY_PLANS
      return plans.find((p) => p.id === selectedPlan)?.amount || 0
    }

    // Otherwise use the amount input (for one-time or custom recurring)
    return parseFloat(amount.toString()) || 0
  }

  const baseAmount = getAmount()

  // Get total amount including fees if opted in
  const getTotalAmount = () => {
    return coverFees ? baseAmount + calculateFees(baseAmount) : baseAmount
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setLoading(true)
    setError('')
    setProcessingStatus('processing')

    try {
      const baseAmount = getAmount()
      const finalAmount = Math.round((coverFees ? getTotalAmount() : baseAmount) * 100)
      const feesCovered = coverFees ? Math.round(calculateFees(baseAmount) * 100) : 0

      if (donationType === 'once') {
        // One-time donation flow
        const intentResult = await createPaymentIntentForCheckout({
          userId: session?.data?.user?.id,
          name,
          email,
          amount: finalAmount,
          orderType: 'ONE_TIME_DONATION',
          description: `One-time donation from ${name}`,
          saveCard: selectedCardId && !useNewCard ? false : saveCard, // Don't save if already using saved card
          coverFees,
          feesCovered,
          address,
          city,
          state,
          zipCode,
          country,
          notes,
          campaignId: campaign?.id,
          savedCardId: selectedCardId && !useNewCard ? selectedCardId : undefined
        })

        if (!intentResult.success) {
          throw new Error(intentResult.error || 'Failed to create payment intent')
        }

        // Handle based on whether using saved card or new card
        if (selectedCardId && !useNewCard) {
          // Saved card - server already confirmed, just listen for webhook
          setupPusherListenerOneTime(
            intentResult.paymentIntentId,
            false,
            selectedCardId,
            processingStatus,
            setError,
            setProcessingStatus,
            setLoading
          )
        } else {
          // New card - confirm with Stripe Elements
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

          setupPusherListenerOneTime(
            result.paymentIntent?.id,
            saveCard,
            getPaymentMethodId(result.paymentIntent?.payment_method),
            processingStatus,
            setError,
            setProcessingStatus,
            setLoading
          )
        }
      } else {
        // Recurring donation flow - SetupIntent or Saved Card

        if (selectedCardId && !useNewCard) {
          // Using saved card - skip setup intent, go straight to subscription
          const subscriptionResult = await createSubscriptionWithSavedCard({
            userId: session?.data?.user?.id,
            email,
            name,
            amount: finalAmount,
            frequency: donationType === 'monthly' ? 'monthly' : 'yearly',
            coverFees,
            feesCovered,
            address,
            city,
            state,
            zipCode,
            country,
            notes,
            savedCardId: selectedCardId,
            campaignId: campaign?.id
          })

          if (!subscriptionResult.success) {
            throw new Error(subscriptionResult.error || 'Failed to create subscription')
          }

          // Wait for order via Pusher
          setupPusherListenerRecurring(
            subscriptionResult,
            processingStatus,
            setError,
            setProcessingStatus,
            setLoading,
            saveCard,
            selectedCardId
          )
        } else {
          // New card - create setup intent
          const setupResult = await createSetupIntentForSubscription({
            userId: session?.data?.user?.id,
            email,
            name,
            amount: finalAmount,
            frequency: donationType === 'monthly' ? 'monthly' : 'yearly',
            coverFees,
            feesCovered
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
            email,
            name,
            frequency: donationType === 'monthly' ? 'monthly' : 'yearly',
            amount: finalAmount,
            coverFees,
            feesCovered,
            address,
            city,
            state,
            zipCode,
            country,
            notes,
            campaignId: campaign?.id
          })

          if (!subscriptionResult.success) {
            throw new Error(subscriptionResult.error || 'Failed to create subscription')
          }

          // Wait for order via Pusher
          setupPusherListenerRecurring(subscriptionResult, processingStatus, setError, setProcessingStatus, setLoading)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setProcessingStatus('failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Donation Type Selection */}
      <DonationTypeSelection
        donationType={donationType}
        setDonationType={setDonationType}
        setSelectedPlan={setSelectedPlan}
      />

      {/* One-Time Amount */}
      {donationType === 'once' && (
        <OneTimeAmount
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          amount={amount}
          setAmount={setAmount}
        />
      )}

      {/* Monthly Plans */}
      {donationType === 'monthly' && (
        <MonthlyPlans
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          amount={amount}
          setAmount={setAmount}
        />
      )}

      {donationType === 'yearly' && (
        <YearlyPlans
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          amount={amount}
          setAmount={setAmount}
        />
      )}

      {/* Contact Information */}
      <ContactInformation email={email} name={name} setEmail={setEmail} setName={setName} />

      {/* Address Information */}
      <AddressInformation
        address={address}
        city={city}
        country={country}
        setAddress={setAddress}
        setCity={setCity}
        setCountry={setCountry}
        setState={setState}
        setZipCode={setZipCode}
        state={state}
        zipCode={zipCode}
      />

      {/* Campaign Selection */}
      <CampaignSelectionAndNotes
        campaign={campaign}
        campaigns={campaigns}
        notes={notes}
        setCampaign={setCampaign}
        setNotes={setNotes}
      />

      <div className="dark:border-zinc-700 border-t border-neutral-200" />

      {/* Cover Fees Switch */}
      <CustomSwitch
        checked={coverFees}
        onChange={setCoverFees}
        label="Cover processing fees"
        description={`Add $${calculateFees(baseAmount).toFixed(2)} so 100% of your donation goes to the club`}
      />

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

      {session.status === 'authenticated' && savedCards && savedCards.length > 0 ? (
        <SavedCardsSelection
          savedCards={savedCards}
          selectedCardId={selectedCardId}
          setSelectedCardId={setSelectedCardId}
          setUseNewCard={setUseNewCard}
          useNewCard={useNewCard}
        />
      ) : (
        donationType === 'once' &&
        session.status === 'authenticated' && (
          <CustomSwitch
            checked={saveCard}
            onChange={setSaveCard}
            label="Save card for future donations"
            description="One-click checkout next time"
          />
        )
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

      {/* CardElement - Show if: not logged in, no saved cards, or using new card */}
      {(session.status === 'unauthenticated' || !savedCards || savedCards.length === 0 || useNewCard) && (
        <div className="mb-8">
          <label className="block text-sm font-bold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
            {useNewCard ? 'New Card' : 'Card Information'}
          </label>

          <div className="border-2 border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 focus-within:border-sky-500 dark:focus-within:border-sky-500 transition-colors">
            <CardElement
              options={{
                style: {
                  base: {
                    color: isDark ? '#fff' : '#1f2937',
                    backgroundColor: 'transparent',
                    fontSize: '16px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    '::placeholder': { color: isDark ? '#6b7280' : '#9ca3af' }
                  },
                  invalid: { color: '#ef4444' }
                }
              }}
            />
          </div>
        </div>
      )}

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
      <SubmitButton
        baseAmount={baseAmount}
        calculateFees={calculateFees}
        coverFees={coverFees}
        donationType={donationType}
        email={email}
        loading={loading}
        name={name}
        selectedPlan={selectedPlan}
      />

      <p className="text-xs dark:text-zinc-500 text-neutral-600 text-center">
        Secured by Stripe, Powered by{' '}
        <span>
          <a className="sqysh-gradient hover:underline" href="https://sqysh.io?lead_source=bgcl">
            Sqysh
          </a>
        </span>
      </p>
    </form>
  )
}

export default DonationForm
