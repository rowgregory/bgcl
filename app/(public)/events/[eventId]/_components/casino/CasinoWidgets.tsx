import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, LogIn, ShoppingCart, User, Volume2, VolumeX, X } from 'lucide-react'
import useSoundEffect from '@/lib/hooks/useSoundEffect'
import { TCasinoWidgets } from '@/types/casino.types'
import { MotionLink } from '@/components/_shared/MotionLink'
import { useCartStore } from '@/stores/useCartStore'
import { usePreferencesStore } from '@/stores/usePreferencesStore'
import { useCartDropdown } from '@/stores/drawers'

export function CasinoWidgets({ data }: TCasinoWidgets) {
  const [open, setOpen] = useState(false)
  const items = useCartStore((s) => s.items)
  const soundOn = usePreferencesStore((s) => s.soundOn)
  const setSoundOn = usePreferencesStore((s) => s.setSoundOn)
  const {} = useCartDropdown()
  const session = useSession()
  const isAuthed = session.status === 'authenticated'
  const userEmail = session.data?.user?.email
  const userRole = session.data?.user?.role
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERUSER'
  const count = items?.reduce((sum: number, i: any) => sum + i.quantity, 0)

  const { play: openCartDropdown } = useSoundEffect('/sound-effects/casino-12.mp3', soundOn)
  const { play: volumeOn } = useSoundEffect('/sound-effects/casino-22.mp3', !soundOn)
  const { play: volumeOff } = useSoundEffect('/sound-effects/casino-20.mp3', soundOn)
  const { play: goToAccount } = useSoundEffect('/sound-effects/casual-click-pop-ui-2.mp3', soundOn)
  const { play: google } = useSoundEffect('/sound-effects/casino-5.mp3', soundOn)

  const handleMute = () => {
    const next = !soundOn
    setSoundOn(next)
    if (next) volumeOn()
    else volumeOff()
  }

  const handleGoogle = () => {
    google()
    setTimeout(() => signIn('google', { redirect: true, redirectTo: `/events/${data.id}` }), 1000)
  }

  return (
    <>
      <div
        className="fixed z-30 top-0 left-0 right-0 h-16 pointer-events-none backdrop-blur-2xl"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
        aria-hidden="true"
      />
      <div
        className="fixed left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-4 z-50 flex items-center gap-1.5 md:gap-2"
        style={{ top: 'calc(1rem + env(safe-area-inset-top))' }}
      >
        {/* Admin Dashboard */}
        {isAdmin && (
          <MotionLink
            href="/admin/events/events"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={userRole}
            className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 shrink-0"
            style={{
              background: 'linear-gradient(135deg, #1a1000, #2a1c00)',
              border: '1px solid rgba(212,175,55,0.3)',
              boxShadow: '0 0 20px rgba(212,175,55,0.08), 0 4px 20px rgba(0,0,0,0.6)'
            }}
          >
            <span className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              <span
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(110deg, transparent 30%, rgba(212,175,55,0.12) 50%, transparent 70%)',
                  animation: 'btnShine 4s infinite linear'
                }}
              />
            </span>

            <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 relative z-10" aria-hidden="true" />
          </MotionLink>
        )}
        {/* Volume */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMute}
          aria-label={soundOn ? 'Mute sounds' : 'Unmute sounds'}
          className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1a1000, #2a1c00)',
            border: '1px solid rgba(212,175,55,0.3)',
            boxShadow: '0 0 20px rgba(212,175,55,0.08), 0 4px 20px rgba(0,0,0,0.6)'
          }}
        >
          <span className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <span
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(110deg, transparent 30%, rgba(212,175,55,0.12) 50%, transparent 70%)',
                animation: 'btnShine 4s infinite linear'
              }}
            />
          </span>
          {soundOn ? (
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 relative z-10" aria-hidden="true" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400/50 relative z-10" aria-hidden="true" />
          )}
        </motion.button>

        {/* Signed in pill */}
        {isAuthed ? (
          <Link
            href="/supporter/overview"
            onClick={() => goToAccount()}
            aria-label={`Signed in as ${userEmail} — go to your account`}
            className="relative flex items-center gap-2 px-2.5 sm:px-4 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 group shrink-0 min-w-0"
            style={{
              background: 'linear-gradient(135deg, #1a1000, #2a1c00)',
              border: '1px solid rgba(212,175,55,0.3)',
              boxShadow: '0 0 20px rgba(212,175,55,0.08), 0 4px 20px rgba(0,0,0,0.6)'
            }}
          >
            <span className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              <span
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(110deg, transparent 30%, rgba(212,175,55,0.12) 50%, transparent 70%)',
                  animation: 'btnShine 4s infinite linear'
                }}
              />
            </span>
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0 relative z-10" aria-hidden="true" />
            <span className="oswald text-xs sm:text-sm font-black uppercase tracking-widest text-white/80 hidden sm:inline truncate max-w-30 lg:max-w-40 relative z-10">
              {userEmail}
            </span>
          </Link>
        ) : (
          <button
            onClick={handleGoogle}
            aria-label="Google - Sign in to your account"
            className="relative flex items-center gap-2 px-2.5 sm:px-4 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 shrink-0"
            style={{
              background: 'linear-gradient(135deg, #1a1000, #2a1c00)',
              border: '1px solid rgba(212,175,55,0.3)',
              boxShadow: '0 0 20px rgba(212,175,55,0.08), 0 4px 20px rgba(0,0,0,0.6)'
            }}
          >
            <span className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              <span
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(110deg, transparent 30%, rgba(212,175,55,0.12) 50%, transparent 70%)',
                  animation: 'btnShine 4s infinite linear'
                }}
              />
            </span>
            <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0 relative z-10" aria-hidden="true" />
            <span className="oswald text-xs sm:text-sm font-black uppercase tracking-widest text-white/80 hidden sm:inline relative z-10">
              Sign In
            </span>
          </button>
        )}

        {/* Cart */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setOpen((o) => !o)
            if (!open) openCartDropdown()
            useCartDropdown.getState().open()
          }}
          aria-label={`Open cart — ${count} item${count !== 1 ? 's' : ''}`}
          className="relative flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1a1000, #2a1c00)',
            border: '1px solid rgba(212,175,55,0.3)',
            boxShadow: '0 0 20px rgba(212,175,55,0.08), 0 4px 20px rgba(0,0,0,0.6)'
          }}
        >
          <span className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <span
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(110deg, transparent 30%, rgba(212,175,55,0.12) 50%, transparent 70%)',
                animation: 'btnShine 4s infinite linear'
              }}
            />
          </span>
          <ShoppingCart
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0 relative z-10"
            aria-hidden="true"
          />
          <span className="oswald text-xs sm:text-sm font-black uppercase tracking-widest text-white/80 relative z-10 hidden sm:inline">
            Cart
          </span>
          {count > 0 && (
            <span
              className="oswald text-[10px] sm:text-[11px] font-black px-1.5 sm:px-2 sm:py-0.5 text-black relative z-10 shrink-0"
              style={{ background: 'linear-gradient(135deg, #d4af37, #f5e678)' }}
              aria-hidden="true"
            >
              {count}
            </span>
          )}
        </motion.button>
      </div>
    </>
  )
}
