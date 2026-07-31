import { useState } from 'react'
import { updateAddress } from '@/lib/actions/address/updateAddress'
import { useUiSelector } from '@/lib/store/store'
import useSoundEffect from '@/lib/hooks/useSoundEffect'
import { useRouter } from 'next/navigation'
import { US_STATES } from '@/lib/constants/states'
import { motion } from 'framer-motion'

export function CasinoAddressForm() {
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipPostalCode, setzipPostalCode] = useState('')
  const [savingAddress, setSavingAddress] = useState(false)
  const { soundOn } = useUiSelector()

  const { play } = useSoundEffect('/sound-effects/casino-1.mp3', soundOn)
  const router = useRouter()

  const handleSaveAddress = async () => {
    if (!addressLine1.trim() || !city.trim() || !state || !zipPostalCode.trim()) return
    setSavingAddress(true)
    try {
      await updateAddress({
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim() || undefined,
        city: city.trim(),
        state,
        zipPostalCode: zipPostalCode.trim(),
        country: 'US'
      })
      play()
      router.refresh()
    } catch {}
    setSavingAddress(false)
  }

  return (
    <div className="space-y-2 w-full max-w-sm mx-auto">
      {/* Street */}
      <input
        type="text"
        value={addressLine1}
        onChange={(e) => setAddressLine1(e.target.value)}
        placeholder="Street address"
        autoComplete="address-line1"
        autoFocus
        className="w-full px-4 py-3 text-sm text-white placeholder-white/20 bg-white/4 border border-white/8 focus:border-amber-400/40 focus:outline-none transition-colors"
      />

      {/* Apt / Unit */}
      <input
        type="text"
        value={addressLine2}
        onChange={(e) => setAddressLine2(e.target.value)}
        placeholder="Apt, suite, unit (optional)"
        autoComplete="address-line2"
        className="w-full px-4 py-3 text-sm text-white placeholder-white/20 bg-white/4 border border-white/8 focus:border-amber-400/40 focus:outline-none transition-colors"
      />

      {/* City / State / ZIP */}
      <div className="grid grid-cols-5 gap-2">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          autoComplete="address-level2"
          className="col-span-2 px-4 py-3 text-sm text-white placeholder-white/20 bg-white/4 border border-white/8 focus:border-amber-400/40 focus:outline-none transition-colors"
        />
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          autoComplete="address-level1"
          className="col-span-1 px-2 py-3 text-sm text-white bg-white/4 border border-white/8 focus:border-amber-400/40 focus:outline-none transition-colors"
        >
          <option value="" disabled>
            State
          </option>
          {US_STATES.map((s) => (
            <option key={s} value={s} className="bg-neutral-900">
              {s}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={zipPostalCode}
          onChange={(e) => setzipPostalCode(e.target.value)}
          placeholder="ZIP"
          autoComplete="postal-code"
          inputMode="numeric"
          maxLength={10}
          className="col-span-2 px-4 py-3 text-sm text-white placeholder-white/20 bg-white/4 border border-white/8 focus:border-amber-400/40 focus:outline-none transition-colors"
        />
      </div>

      {/* Save button */}
      <button
        onClick={handleSaveAddress}
        disabled={savingAddress || !addressLine1.trim() || !city.trim() || !state || !zipPostalCode.trim()}
        className="oswald relative w-full flex items-center justify-center gap-2 py-3.5 text-[13px] font-black uppercase tracking-widest text-white overflow-hidden focus:outline-none active:scale-[0.98] transition-transform disabled:opacity-40 disabled:cursor-not-allowed mt-1"
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
          {savingAddress ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              aria-hidden="true"
            />
          ) : (
            <span className="suit">♠</span>
          )}
          {savingAddress ? 'Saving...' : 'Save & Continue'}
        </span>
      </button>
    </div>
  )
}
