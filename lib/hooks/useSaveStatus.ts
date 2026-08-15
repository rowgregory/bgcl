import { useState } from 'react'

export function useSaveStatus() {
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const flash = (next: 'success' | 'error', text = '') => {
    setStatus(next)
    setMessage(text)
    setTimeout(() => setStatus('idle'), next === 'error' ? 3000 : 2000)
  }

  return { status, message, setStatus, flash }
}
