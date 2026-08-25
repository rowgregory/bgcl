import { useEffect, useRef } from 'react'

import { useLockBodyScroll } from './useLockBodyScroll'

export function useOverlayAccessibility(isOpen: boolean) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useLockBodyScroll(isOpen)

  useEffect(() => {
    if (!isOpen) return

    previousFocusRef.current = document.activeElement as HTMLElement

    // Wait for the open animation before moving focus
    const id = setTimeout(() => closeButtonRef.current?.focus(), 50)

    return () => {
      clearTimeout(id)
      previousFocusRef.current?.focus()
      previousFocusRef.current = null
    }
  }, [isOpen])

  return { closeButtonRef }
}
