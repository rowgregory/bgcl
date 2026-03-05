import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useApplicationSelector, useCartSelector } from '@/app/lib/store/store'
import { clearCart } from '@/app/lib/store/slices/cartSlice'
import { motion } from 'framer-motion'
import { AlertCircle, Lock } from 'lucide-react'
import CustomSwitch from '../common/CustomSwitch'
import { useSession } from 'next-auth/react'
import { createPaymentIntentForCheckout } from '@/app/lib/actions/createPaymentIntentForCheckout'
import { getSavedPaymentMethods } from '@/app/lib/actions/getSavedPaymentMethods'
import SavedCardsSelection from '../donate-form/SavedCardsSelection'
import { useDonationPayment } from '@/app/lib/hooks/useDonationPayment'

export function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const dispatch = useDispatch()
  const { items } = useCartSelector()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [saveCard, setSaveCard] = useState(false)
  const session = useSession()
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState('')
  const [loading, setLoading] = useState(false)
  const [savedCards, setSavedCards] = useState([])
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [useNewCard, setUseNewCard] = useState(false)
  const [coverFees, setCoverFees] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle')
  const { isDark } = useApplicationSelector()
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const processingFee = totalPrice * 0.029 + 0.3
  const finalTotal = totalPrice + processingFee

  const { setupPusherListenerOneTime, getPaymentMethodId } = useDonationPayment()

  useEffect(() => {
    if (session?.status === 'authenticated' && session?.data?.user?.id) {
      getSavedPaymentMethods(session?.data?.user?.id).then((result) => {
        if (result.success) {
          setSavedCards(result.data)
          const defaultCard = result.data.find((c) => c.isDefault)
          if (defaultCard) {
            setSelectedCardId(defaultCard.stripePaymentId)
          }
        }
      })
    }
  }, [session?.status, session?.data?.user?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError('Stripe not loaded')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const feesCovered = coverFees ? Math.round(calculateFees(totalPrice) * 100) : 0

      const ticketData = items.map((item) => ({
        ticketId: item.ticketId,
        quantity: item.quantity,
        pricePerUnit: item.price,
        ticketName: item.ticketName
      }))

      // Ticket purchase flow
      const intentResult = await createPaymentIntentForCheckout({
        userId: session?.data?.user?.id,
        name,
        email,
        amount: Math.round(finalTotal * 100), // Convert to cents
        orderType: 'TICKET_PURCHASE',
        description: `Order for ${name}`,
        saveCard: selectedCardId && !useNewCard ? false : saveCard,
        coverFees,
        feesCovered,
        address,
        city,
        state,
        zipCode,
        country,
        savedCardId: selectedCardId && !useNewCard ? selectedCardId : undefined,
        tickets: JSON.stringify(ticketData),
        eventId: items[0]?.eventId
      })

      if (!intentResult.success) {
        throw new Error(intentResult.error || 'Failed to create payment intent')
      }

      const { clientSecret } = intentResult

      // Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element not found')
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
            email
          }
        }
      })

      if (result.error) {
        setError(result.error.message || 'Payment failed')
      } else if (result.paymentIntent?.status === 'succeeded') {
        setupPusherListenerOneTime(
          result.paymentIntent.id,
          saveCard,
          getPaymentMethodId(result.paymentIntent.payment_method),
          processingStatus,
          setError,
          setProcessingStatus,
          setIsProcessing
        )

        // Clear cart
        // TODO
        dispatch(clearCart())
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  // Calculate fees so you receive the exact donation amount
  const calculateFees = (donationAmount: number) => {
    const amount = parseFloat(donationAmount.toString()) || 0
    // Formula: (amount + 0.30) / (1 - 0.022) - amount
    // This ensures after Stripe takes fees, you get the original amount
    const totalNeeded = (amount + 0.3) / (1 - 0.022)
    return totalNeeded - amount
  }

  const isValid = email && name && address && city && state && zipCode

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-y-12">
        {/* Contact */}
        <fieldset className="border-0 p-0 m-0">
          <legend className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
            Contact
          </legend>
          <div>
            <label
              htmlFor="checkout-email"
              className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-3"
            >
              Email{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              id="checkout-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              aria-required="true"
              aria-describedby={error ? 'checkout-error' : undefined}
              placeholder="you@example.com"
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 focus:border-sky-500 dark:focus:border-sky-500 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-0 transition-colors"
            />
          </div>
        </fieldset>

        {/* Billing */}
        <fieldset className="border-0 p-0 m-0">
          <legend className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
            Billing Details
          </legend>
          <div>
            <label
              htmlFor="checkout-name"
              className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-3"
            >
              Full Name{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              id="checkout-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              aria-required="true"
              placeholder="John Doe"
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 focus:border-sky-500 dark:focus:border-sky-500 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-0 transition-colors"
            />
          </div>
        </fieldset>

        {/* Address */}
        <fieldset className="border-0 p-0 m-0">
          <legend className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
            Address
          </legend>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="checkout-address"
                className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-2"
              >
                Street Address{' '}
                <span aria-hidden="true" className="text-red-500">
                  *
                </span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                id="checkout-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                autoComplete="street-address"
                aria-required="true"
                placeholder="123 Main St"
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 focus:border-sky-500 dark:focus:border-sky-500 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="checkout-city"
                  className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-2"
                >
                  City{' '}
                  <span aria-hidden="true" className="text-red-500">
                    *
                  </span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id="checkout-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  autoComplete="address-level2"
                  aria-required="true"
                  placeholder="Lynn"
                  className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 focus:border-sky-500 dark:focus:border-sky-500 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-0 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="checkout-state"
                  className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-2"
                >
                  State{' '}
                  <span aria-hidden="true" className="text-red-500">
                    *
                  </span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id="checkout-state"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  autoComplete="address-level1"
                  aria-required="true"
                  placeholder="MA"
                  maxLength={2}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 focus:border-sky-500 dark:focus:border-sky-500 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-0 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="checkout-zip"
                  className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-2"
                >
                  ZIP Code{' '}
                  <span aria-hidden="true" className="text-red-500">
                    *
                  </span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id="checkout-zip"
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                  autoComplete="postal-code"
                  aria-required="true"
                  placeholder="01901"
                  maxLength={5}
                  inputMode="numeric"
                  className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 focus:border-sky-500 dark:focus:border-sky-500 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-0 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="checkout-country"
                  className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-2"
                >
                  Country{' '}
                  <span aria-hidden="true" className="text-red-500">
                    *
                  </span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id="checkout-country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  autoComplete="country-name"
                  aria-required="true"
                  placeholder="United States"
                  className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 focus:border-sky-500 dark:focus:border-sky-500 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-0 transition-colors"
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Cover Fees Switch */}
        <CustomSwitch
          checked={coverFees}
          onChange={setCoverFees}
          label="Cover processing fees"
          description={`Add $${processingFee.toFixed(2)} so 100% of your donation goes to the club`}
        />

        {session?.status === 'authenticated' && savedCards && savedCards.length > 0 ? (
          <SavedCardsSelection
            savedCards={savedCards}
            selectedCardId={selectedCardId}
            setSelectedCardId={setSelectedCardId}
            setUseNewCard={setUseNewCard}
            useNewCard={useNewCard}
          />
        ) : (
          session?.status === 'authenticated' && (
            <CustomSwitch
              checked={saveCard}
              onChange={setSaveCard}
              label="Save card for future donations"
              description="One-click checkout next time"
            />
          )
        )}

        {/* Payment */}
        <fieldset className="border-0 p-0 m-0">
          <legend className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
            Payment Method
          </legend>
          <div>
            <label
              htmlFor="card-element"
              className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-3"
            >
              Card Details{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
            <div
              id="card-element"
              className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors focus-within:border-sky-500 dark:focus-within:border-sky-500"
            >
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
        </fieldset>

        {/* Error */}
        {error && (
          <motion.div
            id="checkout-error"
            role="alert"
            aria-live="assertive"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            {error}
          </motion.div>
        )}

        {/* Submit */}
        {/* <div className="pt-2">
          <button
            type="submit"
            disabled={isProcessing || !stripe || !email || !name}
            aria-disabled={isProcessing || !stripe || !email || !name}
            className="w-full px-6 py-4 bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white font-semibold rounded-xl transition-all shadow-lg shadow-sky-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
          >
            <Lock className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{isProcessing ? 'Processing...' : `Pay $${finalTotal.toFixed(2)}`}</span>
          </button>

          <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center mt-4">
            Your payment information is secure and encrypted.
          </p>
        </div> */}
        <button
          type="submit"
          disabled={!isValid}
          aria-disabled={!isValid}
          className="w-full px-6 py-4 bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white font-semibold rounded-xl transition-all shadow-lg shadow-sky-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 disabled:bg-neutral-400 dark:disabled:bg-zinc-700"
        >
          {loading || isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              aria-hidden="true"
            />
          ) : (
            <Lock className="w-4 h-4 shrink-0" aria-hidden="true" />
          )}
          <span>
            {loading || isProcessing
              ? 'Processing...'
              : `Pay $${coverFees ? finalTotal.toFixed(2) : totalPrice.toFixed(2)}`}
          </span>
        </button>
      </form>
    </motion.div>
  )
}
