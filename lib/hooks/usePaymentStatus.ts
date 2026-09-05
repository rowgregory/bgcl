'use client'

import { useCallback, useMemo, useState } from 'react'
import { useFormContext, type FieldValues } from 'react-hook-form'

export type ProcessingStatus = 'idle' | 'processing' | 'success' | 'failed'

/** The listeners take three positional callbacks: error, status, loading reset */
export type PusherCallbacks = readonly [(value: string) => void, (value: string) => void, () => void]

/**
 * Owns the submit lifecycle shared by the donation and ticket checkout hooks:
 * the processing flag, root-level form errors, and the callbacks the Pusher
 * listeners expect.
 */
export function usePaymentStatus<T extends FieldValues>() {
  const { setError } = useFormContext<T>()
  const [status, setStatus] = useState<ProcessingStatus>('idle')

  const fail = useCallback(
    (message: string) => {
      setError('root', { message })
      setStatus('failed')
    },
    [setError]
  )

  const start = useCallback(() => setStatus('processing'), [])

  const pusherCallbacks: PusherCallbacks = useMemo(
    () => [
      (value: string) => setError('root', { message: value }),
      (value: string) => setStatus(value as ProcessingStatus),
      () => setStatus((current) => (current === 'processing' ? 'idle' : current))
    ],
    [setError]
  )

  return { isProcessing: status === 'processing' || status === 'success', start, fail, pusherCallbacks }
}
