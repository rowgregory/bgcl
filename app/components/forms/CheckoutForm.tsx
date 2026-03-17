import { useEffect, useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useApplicationSelector, useCartSelector } from '@/app/lib/store/store'
import { motion } from 'framer-motion'
import { AlertCircle, Lock } from 'lucide-react'
import CustomSwitch from '../common/CustomSwitch'
import { signOut, useSession } from 'next-auth/react'
import { createPaymentIntentForCheckout } from '@/app/lib/actions/createPaymentIntentForCheckout'
import SavedCardsSelection from '../donate-form/SavedCardsSelection'
import { useDonationPayment } from '@/app/lib/hooks/useDonationPayment'
import { IPaymentMethod } from '@/types/entities/payment-method'
import { calculateStripeFees } from '@/app/lib/utils/calculateStripeFees'
import { STATES } from '@/app/lib/constants/states'

interface ICheckoutForm {
  savedCards: IPaymentMethod[]
  coverFees: boolean
  setCoverFees: (coverFees: boolean) => void
}

export function CheckoutForm({ savedCards, coverFees, setCoverFees }: ICheckoutForm) {
  // ── Stripe ────────────────────────────────────────────────────────────────
  const stripe = useStripe()
  const elements = useElements()

  // ── Store ─────────────────────────────────────────────────────────────────
  const { items } = useCartSelector()
  const { isDark } = useApplicationSelector()
  const session = useSession()
  const userEmail = session.data?.user?.email

  // ── Hooks ─────────────────────────────────────────────────────────────────
  const { setupPusherListenerOneTime, getPaymentMethodId } = useDonationPayment()

  // ── Cart totals ───────────────────────────────────────────────────────────
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const processingFee = Math.round(calculateStripeFees(totalPrice) * 100) / 100
  const finalTotal = coverFees ? totalPrice + processingFee : totalPrice

  // ── Form state ────────────────────────────────────────────────────────────
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState('')

  // ── Payment state ─────────────────────────────────────────────────────────
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [useNewCard, setUseNewCard] = useState(false)
  const [saveCard, setSaveCard] = useState(false)

  // ── UI state ──────────────────────────────────────────────────────────────
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle')
  const [signingOut, setSigningOut] = useState(false)
  const [cardComplete, setCardComplete] = useState(false)

  useEffect(() => {
    if (session?.status === 'authenticated') {
      const defaultCard = savedCards?.find((c) => c.isDefault)
      if (defaultCard) {
        setSelectedCardId(defaultCard.stripePaymentId)
      }
    }
  }, [savedCards, session?.status])

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError('Stripe not loaded')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
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
        email: userEmail,
        amount: Math.round(finalTotal * 100), // Convert to cents
        orderType: 'TICKET_PURCHASE',
        description: `Order for ${name}`,
        saveCard: selectedCardId && !useNewCard ? false : saveCard,
        coverFees,
        feesCovered: coverFees ? processingFee : 0,
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

      if (selectedCardId && !useNewCard) {
        // ── Saved card — already confirmed server-side ──
        setupPusherListenerOneTime(
          intentResult.paymentIntentId!,
          false,
          selectedCardId,
          processingStatus,
          setError,
          setProcessingStatus,
          setIsProcessing
        )
      } else {
        // ── New card — confirm client-side ──
        const cardElement = elements.getElement(CardElement)
        if (!cardElement) throw new Error('Card element not found')

        const result = await stripe.confirmCardPayment(intentResult.clientSecret!, {
          payment_method: {
            card: cardElement,
            billing_details: { name, email: userEmail }
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
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const isValid =
    name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail) &&
    address.trim().length > 0 &&
    city.trim().length > 0 &&
    state.trim().length > 0 &&
    zipCode.trim().length > 0 &&
    (selectedCardId && !useNewCard ? true : cardComplete)

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-y-12">
        {/* ── Contact ── */}
        <fieldset className="border-0 p-0 m-0">
          <legend className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
            Contact
          </legend>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="checkout-email"
                className="block text-sm font-medium dark:text-zinc-300 text-neutral-700 mb-2"
              >
                Email
              </label>
              <input
                disabled
                id="checkout-email"
                type="email"
                value={session.data?.user?.email || ''}
                readOnly
                autoComplete="email"
                className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-400 border-neutral-200 bg-neutral-100 rounded-lg text-neutral-500 cursor-not-allowed"
              />
              <p className="mt-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                Using your signed-in account email.{' '}
                <button
                  type="button"
                  onClick={async () => {
                    setSigningOut(true)
                    await signOut({ redirectTo: '/auth/login' })
                  }}
                  className="inline-flex items-center gap-1 underline hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors focus-visible:outline-none"
                >
                  {signingOut ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-3 h-3 border border-neutral-400 border-t-transparent rounded-full"
                        aria-hidden="true"
                      />
                      <span>Signing out...</span>
                    </>
                  ) : (
                    'Not you?'
                  )}
                </button>
              </p>
            </div>
            <div>
              <label
                htmlFor="checkout-name"
                className="block text-sm font-medium dark:text-zinc-300 text-neutral-700 mb-2"
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
                className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 dark:placeholder-zinc-600 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-500"
              />
            </div>
          </div>
        </fieldset>

        {/* ── Address ── */}
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
                className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 dark:placeholder-zinc-600 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-500"
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
                  className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 dark:placeholder-zinc-600 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-500"
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
                <select
                  id="checkout-state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  autoComplete="address-level1"
                  aria-required="true"
                  className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select state
                  </option>
                  {STATES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.text}
                    </option>
                  ))}
                </select>
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
                  className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 dark:placeholder-zinc-600 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-500"
                />
              </div>
              {/* Country hardcoded — local org */}
              <input type="hidden" value="US" onChange={() => setCountry('US')} />
            </div>
          </div>
        </fieldset>

        {/* ── Payment ── */}
        <fieldset className="border-0 p-0 m-0">
          <legend className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
            Payment Method
          </legend>
          <div className="space-y-6">
            {/* Saved cards */}
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

            {/* Card element — always show if no saved cards, or if useNewCard */}
            {(!session || session?.status !== 'authenticated' || !savedCards?.length || useNewCard) && (
              <div>
                <label
                  htmlFor="card-element"
                  className="block text-sm font-medium dark:text-zinc-300 text-neutral-700 mb-2"
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
                    onChange={(e) => {
                      setCardComplete(e.complete)
                      if (e.error) setError(e.error.message ?? null)
                      else setError(null)
                    }}
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

            {/* Cover fees */}
            <CustomSwitch
              checked={coverFees}
              onChange={setCoverFees}
              label="Cover processing fees"
              description={`Add $${processingFee.toFixed(2)} so 100% of your donation goes to the club`}
            />
          </div>
        </fieldset>

        {/* ── Error ── */}
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

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={!isValid}
          aria-disabled={!isValid}
          className="w-full px-6 py-4 bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white font-semibold rounded-xl transition-all shadow-lg shadow-sky-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 disabled:bg-neutral-400 dark:disabled:bg-zinc-700"
        >
          {isProcessing ? (
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
            {isProcessing
              ? 'Processing...'
              : `Pay $${(coverFees ? finalTotal : totalPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </span>
        </button>
      </form>
    </motion.div>
  )
}
