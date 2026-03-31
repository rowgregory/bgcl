import { createPaymentMethod } from '@/app/lib/actions/createPaymentMethod'
import { updateUserName } from '@/app/lib/actions/updateUserName'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { useCartSelector, useUiSelector } from '@/app/lib/store/store'
import { TCasinoSignInPrompt } from '@/types/casino.types'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, ChevronRight, CreditCard, Lock, Mail, ShoppingCart } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function CasinoSignInPrompt({ eventSlug, name, savedCards }: TCasinoSignInPrompt) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState(name?.firstName ?? '')
  const [lastName, setLastName] = useState(name?.lastName ?? '')
  const [savingName, setSavingName] = useState(false)
  const session = useSession()
  const router = useRouter()
  const { items } = useCartSelector()
  const { soundOn } = useUiSelector()
  const cartCount = items?.length

  const isAuthed = session.status === 'authenticated'
  const hasName = !!(name?.firstName?.trim() && name?.lastName?.trim())
  const callbackUrl = `/events/${eventSlug}`
  const { play } = useSoundEffect('/sound-effects/casino-1.mp3', soundOn)
  const { play: proceed } = useSoundEffect('/sound-effects/casino-17.mp3', soundOn)
  const { play: viewCart } = useSoundEffect('/sound-effects/casino-15.wav', soundOn)
  const { play: googleOrMagicLink } = useSoundEffect('/sound-effects/casino-5.mp3', soundOn)
  const { play: manage } = useSoundEffect('/sound-effects/casino-23.mp3', soundOn)

  const [addingCard, setAddingCard] = useState(false)
  const [savingCard, setSavingCard] = useState(false)
  const stripe = useStripe()
  const elements = useElements()

  const handleSaveCard = async () => {
    if (!stripe || !elements) return
    setSavingCard(true)
    try {
      const card = elements.getElement(CardElement)
      if (!card) return
      const { paymentMethod, error } = await stripe.createPaymentMethod({ type: 'card', card })
      if (error || !paymentMethod) return
      await createPaymentMethod(paymentMethod.id)
      router.refresh()
      play()
      setAddingCard(false)
    } catch {}
    setSavingCard(false)
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    googleOrMagicLink()
    await signIn('email', { email, callbackUrl, redirect: false })
    setSent(true)
    setLoading(false)
  }

  const handleGoogle = () => {
    googleOrMagicLink()
    setTimeout(() => signIn('google', { redirect: true, callbackUrl }), 1000)
  }

  const handleSaveName = async () => {
    if (!firstName.trim() || !lastName.trim()) return
    setSavingName(true)
    try {
      await updateUserName({ firstName: firstName.trim(), lastName: lastName.trim() })
      play()
      router.refresh()
    } catch {}
    setSavingName(false)
  }

  // Already signed in with name complete — ready to purchase
  if (isAuthed && hasName) {
    return (
      <section aria-labelledby="ready-heading">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className="h-px w-10"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4))' }}
              aria-hidden="true"
            />
            <span className="oswald text-[10px] font-black uppercase tracking-[0.25em] text-amber-600/50">
              ✦ You&apos;re All Set ✦
            </span>
            <div
              className="h-px w-10"
              style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.4), transparent)' }}
              aria-hidden="true"
            />
          </div>

          <h2
            id="ready-heading"
            className="oswald font-black uppercase text-white leading-none mb-3"
            style={{ fontSize: 'clamp(28px, 6vw, 48px)' }}
          >
            Ready to Play, {name?.firstName}!
          </h2>

          <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto mb-6">
            Your info is saved and you&apos;re good to go. Add your tickets and checkout when you&apos;re ready.
          </p>

          {/* User summary */}
          <div
            className="inline-flex flex-col items-start gap-3 px-5 py-4 text-left mb-6 bg-white/3"
            style={{
              border: '1px solid rgba(212,175,55,0.15)'
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-amber-400/50 text-xs shrink-0 suit" aria-hidden="true">
                ♠
              </span>
              <div>
                <p className="text-[9px] oswald font-black uppercase tracking-[0.2em] text-white/25 mb-0.5">Name</p>
                <p className="text-sm font-semibold text-white/70">
                  {name?.firstName} {name?.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-amber-400/50 text-xs shrink-0 suit" aria-hidden="true">
                ♦
              </span>
              <div>
                <p className="text-[9px] oswald font-black uppercase tracking-[0.2em] text-white/25 mb-0.5">Account</p>
                <p className="text-sm font-semibold text-white/70">{session?.data?.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Privacy note */}
          <p className="text-[10px] text-white/15 flex items-center justify-center gap-1.5 mb-6">
            <Lock className="w-3 h-3 shrink-0" aria-hidden="true" />
            Only you can see this — sign out to hide your details
          </p>

          {/* Payment method nudge */}
          {savedCards?.length === 0 ? (
            <div className="mb-6 max-w-sm mx-auto w-full">
              {addingCard ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  {/* Card input */}
                  <div className="px-4 py-3.5 bg-white/4" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
                    <p className="oswald text-[9px] font-black uppercase tracking-[0.2em] text-amber-600/50 mb-2.5">
                      Card Details
                    </p>
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.8)',
                            fontFamily: 'DM Sans, sans-serif',
                            '::placeholder': { color: 'rgba(255,255,255,0.2)' },
                            iconColor: '#d4af37'
                          },
                          invalid: {
                            color: '#ef4444'
                          }
                        }
                      }}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveCard}
                      disabled={savingCard}
                      className="oswald relative flex-1 flex items-center justify-center gap-2 py-3 text-[12px] font-black uppercase tracking-widest text-white overflow-hidden focus:outline-none active:scale-[0.98] transition-transform disabled:opacity-40"
                      style={{
                        background: 'linear-gradient(135deg, #7f0000 0%, #c0392b 45%, #e74c3c 65%, #922b21 100%)'
                      }}
                    >
                      <span
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            'linear-gradient(90deg, transparent 25%, rgba(255,120,120,0.25) 50%, transparent 75%)',
                          animation: 'btnShine 2.5s infinite linear'
                        }}
                        aria-hidden="true"
                      />
                      <span className="relative z-10 flex items-center gap-2">
                        {savingCard ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            aria-hidden="true"
                          />
                        ) : (
                          <CreditCard className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                        {savingCard ? (
                          'Saving...'
                        ) : (
                          <>
                            <span className="suit">♠</span> Save Card
                          </>
                        )}
                      </span>
                    </button>

                    <button
                      onClick={() => setAddingCard(false)}
                      className="py-3 px-4 text-xs text-white/30 hover:text-white/60 transition-colors focus:outline-none"
                      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      Cancel
                    </button>
                  </div>

                  <p className="text-[10px] text-white/15 text-center">
                    Secured by Stripe — your card details are never stored on our servers.
                  </p>
                </motion.div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/6" aria-hidden="true" />
                  <button
                    onClick={() => setAddingCard(true)}
                    className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors shrink-0 focus:outline-none"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-amber-400/40" aria-hidden="true" />
                    <span>Save a card for one-click checkout</span>
                    <ChevronRight className="w-3 h-3" aria-hidden="true" />
                  </button>
                  <div className="h-px flex-1 bg-white/6" aria-hidden="true" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-white/6" aria-hidden="true" />
              <div className="flex items-center gap-2 text-xs text-white/30 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/60" aria-hidden="true" />
                <span>
                  {savedCards[0].cardBrand} ···· {savedCards[0].cardLast4} saved
                </span>
                <span className="text-white/15">·</span>
                <Link
                  onClick={() => manage()}
                  href="/supporter/overview"
                  className="text-amber-400/50 hover:text-amber-400/80 transition-colors"
                >
                  Manage
                </Link>
              </div>
              <div className="h-px flex-1 bg-white/6" aria-hidden="true" />
            </div>
          )}

          {/* Cart + Checkout */}
          {cartCount > 0 ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                onClick={() => proceed()}
                href="/checkout"
                className="oswald relative flex items-center justify-center gap-2 px-8 py-3.5 text-[13px] font-black uppercase tracking-widest text-white overflow-hidden focus:outline-none active:scale-[0.98] transition-transform"
                style={{ background: 'linear-gradient(135deg, #7f0000 0%, #c0392b 45%, #e74c3c 65%, #922b21 100%)' }}
              >
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent 25%, rgba(255,120,120,0.25) 50%, transparent 75%)',
                    animation: 'btnShine 2.5s infinite linear'
                  }}
                  aria-hidden="true"
                />
                <span className="relative z-10 flex items-center gap-2">
                  <span className="suit">♠</span> Checkout
                  <span
                    className="oswald text-[10px] font-black px-1.5 py-0.5 rounded-full text-black"
                    style={{ background: 'linear-gradient(135deg, #d4af37, #f5e678)' }}
                  >
                    {cartCount}
                  </span>
                </span>
              </Link>

              <Link
                href="/cart"
                onClick={() => viewCart()}
                className="oswald flex items-center gap-2 px-5 py-3.5 text-[12px] font-black uppercase tracking-widest text-white/50 hover:text-white/80 transition-colors focus:outline-none"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                View Cart
              </Link>
            </div>
          ) : (
            <p className="text-xs text-white/25 flex items-center justify-center gap-2">
              <span aria-hidden="true" className="suit">
                ♠
              </span>
              Add tickets to get started
              <span aria-hidden="true" className="suit">
                ♠
              </span>
            </p>
          )}
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="signin-prompt-heading">
      <div className="max-w-xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div
            className="h-px w-10"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4))' }}
            aria-hidden="true"
          />
          <span className="oswald text-[10px] font-black uppercase tracking-[0.25em] text-amber-600/50">
            {isAuthed ? '✦ Almost There ✦' : '✦ Join the Night ✦'}
          </span>
          <div
            className="h-px w-10"
            style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.4), transparent)' }}
            aria-hidden="true"
          />
        </div>

        <AnimatePresence mode="wait">
          {/* ── Step 2: signed in, needs name ── */}
          {isAuthed && !hasName && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <h2
                id="signin-prompt-heading"
                className="oswald font-black uppercase text-white leading-none mb-3"
                style={{ fontSize: 'clamp(28px, 6vw, 48px)' }}
              >
                What's Your Name?
              </h2>

              <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto mb-4">
                We just need your name to get started.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  className="flex-1 min-w-0 px-4 py-3 text-sm text-white placeholder-white/20 bg-white/4 border border-white/8 focus:border-amber-400/40 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  autoComplete="family-name"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  className="flex-1 min-w-0 px-4 py-3 text-sm text-white placeholder-white/20 bg-white/4 border border-white/8 focus:border-amber-400/40 focus:outline-none transition-colors"
                />
              </div>

              <button
                onClick={handleSaveName}
                disabled={savingName || !firstName.trim() || !lastName.trim()}
                className="oswald relative w-full flex items-center justify-center gap-2 py-3.5 text-[13px] font-black uppercase tracking-widest text-white overflow-hidden focus:outline-none active:scale-[0.98] transition-transform disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #7f0000 0%, #c0392b 45%, #e74c3c 65%, #922b21 100%)'
                }}
              >
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent 25%, rgba(255,120,120,0.25) 50%, transparent 75%)',
                    animation: 'btnShine 2.5s infinite linear'
                  }}
                  aria-hidden="true"
                />
                <span className="relative z-10 flex items-center gap-2">
                  {savingName ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="suit">♠</span>
                  )}
                  {savingName ? 'Saving...' : 'Save & Continue'}
                </span>
              </button>
            </motion.div>
          )}

          {/* ── Step 1: not signed in ── */}
          {!isAuthed && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              <h2
                id="signin-prompt-heading"
                className="oswald font-black uppercase text-white leading-none mb-3"
                style={{ fontSize: 'clamp(28px, 6vw, 48px)' }}
              >
                {sent ? 'Check Your Email' : 'Ready to Play?'}
              </h2>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-2 space-y-3"
                >
                  <div
                    className="flex items-center justify-center mx-auto w-12 h-12 mb-1"
                    style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
                  >
                    <Mail className="w-5 h-5 text-amber-400" aria-hidden="true" />
                  </div>
                  <p className="oswald text-base font-black uppercase tracking-wide text-white">Check your email</p>
                  <p className="text-sm text-white/40">
                    We sent a magic link to <span className="text-white/70 font-medium">{email}</span>
                  </p>
                  <button
                    onClick={() => {
                      setSent(false)
                      setEmail('')
                    }}
                    className="text-xs text-amber-400/60 hover:text-amber-400 transition-colors underline underline-offset-2"
                  >
                    Use a different email
                  </button>
                </motion.div>
              ) : (
                <>
                  <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto mb-6">
                    Sign in to purchase tickets. No account needed — just your email or Google. First time? You&apos;re
                    all set.
                  </p>

                  {/* Google */}
                  <button
                    onClick={handleGoogle}
                    className="oswald relative w-full flex items-center justify-center gap-3 py-3.5 text-[13px] font-black uppercase tracking-widest text-white overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 active:scale-[0.98] transition-transform"
                    style={{
                      background: 'linear-gradient(135deg, #1a1000, #2a1c00)',
                      border: '1px solid rgba(212,175,55,0.3)',
                      boxShadow: '0 0 20px rgba(212,175,55,0.06)'
                    }}
                  >
                    <span
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent 25%, rgba(212,175,55,0.08) 50%, transparent 75%)',
                        animation: 'btnShine 4s infinite linear'
                      }}
                      aria-hidden="true"
                    />
                    <svg className="w-4 h-4 shrink-0 relative z-10" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="relative z-10">Continue with Google</span>
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3" aria-hidden="true">
                    <div className="flex-1 h-px bg-white/6" />
                    <span className="text-xs text-white/20">or</span>
                    <div className="flex-1 h-px bg-white/6" />
                  </div>

                  {/* Magic link */}
                  <form onSubmit={handleMagicLink} noValidate className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      autoComplete="email"
                      required
                      disabled={loading}
                      className="flex-1 min-w-0 px-4 py-3 text-sm text-white placeholder-white/20 bg-white/4 border border-white/8 focus:border-amber-400/40 focus:outline-none transition-colors disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!email || loading}
                      className="oswald relative px-5 py-3 text-[12px] font-black uppercase tracking-widest text-white overflow-hidden focus:outline-none active:scale-[0.98] transition-transform disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #7f0000 0%, #c0392b 45%, #e74c3c 65%, #922b21 100%)'
                      }}
                    >
                      <span
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            'linear-gradient(90deg, transparent 25%, rgba(255,120,120,0.25) 50%, transparent 75%)',
                          animation: 'btnShine 2.5s infinite linear'
                        }}
                        aria-hidden="true"
                      />
                      <span className="relative z-10">{loading ? '...' : '♠ Send'}</span>
                    </button>
                  </form>

                  <p className="text-[10px] text-white/15 leading-relaxed">
                    No account needed — first time here? Just sign in and you&apos;re set.
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
