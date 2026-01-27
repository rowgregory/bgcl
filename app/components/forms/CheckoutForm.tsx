import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCartSelector } from '@/app/lib/store/store'
import { clearCart } from '@/app/lib/store/slices/cartSlice'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import CustomSwitch from '../common/CustomSwitch'
import { useSession } from 'next-auth/react'
import { createPaymentIntentForCheckout } from '@/app/lib/actions/createPaymentIntentForCheckout'
import { savePaymentMethod } from '@/app/lib/actions/savePaymentMethod'

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
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [savedCards, setSavedCards] = useState([])
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [useNewCard, setUseNewCard] = useState(false)
  const [coverFees, setCoverFees] = useState(false)

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const processingFee = totalPrice * 0.029 + 0.3
  const finalTotal = totalPrice + processingFee

  // Get total amount including fees if opted in
  const getTotalAmount = () => {
    const baseAmount = totalPrice
    return coverFees ? baseAmount + calculateFees(baseAmount) : baseAmount
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError('Stripe not loaded')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const finalAmount = Math.round((coverFees ? getTotalAmount() : totalPrice) * 100)
      const feesCovered = coverFees ? Math.round(calculateFees(totalPrice) * 100) : 0

      // Create payment intent using server action
      const intentResult = await createPaymentIntentForCheckout({
        userId: session?.data?.user?.id,
        name,
        email,
        amount: Math.round(finalTotal * 100), // Convert to cents
        orderType: 'TICKET_PURCHASE',
        description: `Order for ${name}`,
        saveCard,
        coverFees,
        feesCovered,
        address,
        city,
        state,
        zipCode,
        country,
        notes,
        savedCardId: selectedCardId
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
        // Save card if user opted in and is logged in
        if (saveCard && session.data?.user?.id && result.paymentIntent.payment_method) {
          await savePaymentMethod(
            session.data?.user?.id,
            result.paymentIntent.payment_method as string,
            true // Set as default
          )
        }

        // Clear cart and redirect to success page
        dispatch(clearCart())
        window.location.href = `/checkout/success?paymentId=${result.paymentIntent.id}`
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

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Contact</h2>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-3 uppercase tracking-wide">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-zinc-700 hover:border-zinc-600 focus:border-sky-500 text-white placeholder-zinc-600 focus:outline-none focus:ring-0 transition-colors"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Shipping Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Billing Details</h2>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-3 uppercase tracking-wide">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-zinc-700 hover:border-zinc-600 focus:border-sky-500 text-white placeholder-zinc-600 focus:outline-none focus:ring-0 transition-colors"
              placeholder="John Doe"
            />
          </div>
        </div>

        {/* Save Card Section */}
        <div className="pt-4">
          <CustomSwitch
            checked={saveCard}
            onChange={(checked) => setSaveCard(checked)}
            label="Save this card for future donations"
            description=""
          />
        </div>

        {/* Payment Information Section */}
        <div className="space-y-6 pt-4">
          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Payment Method</h2>
          </div>
          <div className="p-4 bg-zinc-900/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#fff',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
                    '::placeholder': {
                      color: '#71717a'
                    }
                  },
                  invalid: {
                    color: '#fca5a5'
                  }
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
        <div className="pt-4">
          <button
            type="submit"
            disabled={isProcessing || !stripe || !email || !name}
            className="w-full px-6 py-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            <Lock className="w-5 h-5" />
            <span>{isProcessing ? 'Processing...' : `Pay $${finalTotal.toFixed(2)}`}</span>
          </button>
        </div>

        <p className="text-xs text-zinc-500 text-center">Your payment information is secure and encrypted.</p>
      </form>
    </motion.div>
  )
}
