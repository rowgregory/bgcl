'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'
import { store } from '@/lib/store/store'
import { setIsNotSpanish, setIsSpanish } from '@/lib/store/slices/appSlice'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'zh-CN', name: 'Mandarin' },
  { code: 'ht', name: 'Creole' }
]

export default function GoogleTranslate() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('en')
  const [isReady, setIsReady] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const pathname = usePathname()

  // Function to get current language from Google Translate
  const getCurrentLanguage = () => {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
    if (select && select.value) {
      return select.value
    }

    // Fallback: check cookie
    const cookies = document.cookie.split(';')
    const googleTransCookie = cookies.find((c) => c.trim().startsWith('googtrans='))
    if (googleTransCookie) {
      const lang = googleTransCookie.split('/')[2]
      return lang || 'en'
    }

    return 'en'
  }

  // Sync state with Google Translate
  const syncLanguageState = useCallback(() => {
    const lang = getCurrentLanguage()
    setCurrentLang(lang)

    // Update Redux state
    if (lang === 'es') {
      store.dispatch(setIsSpanish())
    } else {
      store.dispatch(setIsNotSpanish())
    }
  }, [])

  useEffect(() => {
    // Initialize Google Translate
    ;(window as any).googleTranslateElementInit = function () {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,es,zh-CN,ht',
          autoDisplay: false
        },
        'google_translate_element_hidden'
      )

      // Wait for the select element to be ready
      const checkInterval = setInterval(() => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
        if (select) {
          setIsReady(true)
          clearInterval(checkInterval)

          // Sync state on initial load
          setTimeout(() => {
            syncLanguageState()
          }, 500)
        }
      }, 100)

      // Stop checking after 5 seconds
      setTimeout(() => clearInterval(checkInterval), 5000)
    }

    // Load the script
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement('script')
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      document.body.appendChild(script)
    } else {
      // Script already loaded, just sync state
      setTimeout(() => {
        syncLanguageState()
        setIsReady(true)
      }, 500)
    }
  }, [syncLanguageState])

  // Re-sync on route change
  useEffect(() => {
    if (isReady) {
      setTimeout(() => {
        syncLanguageState()
      }, 300)
    }
  }, [isReady, pathname, syncLanguageState])

  const changeLanguage = async (langCode: string) => {
    if (isTranslating) return // Prevent multiple clicks

    setIsTranslating(true)
    setCurrentLang(langCode)
    setIsOpen(false)

    if (langCode === 'es') {
      store.dispatch(setIsSpanish())
    } else {
      store.dispatch(setIsNotSpanish())
    }

    // Retry mechanism with increasing delays
    const attemptTranslation = async (attempt: number = 0): Promise<boolean> => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement

      if (!select && attempt < 10) {
        // Wait and retry if select not found
        await new Promise((resolve) => setTimeout(resolve, 200))
        return attemptTranslation(attempt + 1)
      }

      if (!select) {
        setIsTranslating(false)
        return false
      }

      // Set the value
      select.value = langCode

      // Trigger multiple events to ensure it fires
      select.dispatchEvent(new Event('change', { bubbles: true }))
      select.dispatchEvent(new Event('input', { bubbles: true }))

      // Also trigger click event on select
      select.click()

      // Wait for translation to start
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Verify the translation happened by checking if the language changed
      const newLang = getCurrentLanguage()

      if (newLang !== langCode && attempt < 3) {
        // Translation didn't work, retry
        await new Promise((resolve) => setTimeout(resolve, 500))
        return attemptTranslation(attempt + 1)
      }

      // Hide the Google Translate frame
      setTimeout(() => {
        const frame = document.querySelector('.goog-te-menu-frame') as HTMLElement
        if (frame) {
          frame.style.display = 'none'
        }
      }, 100)

      setIsTranslating(false)
      return true
    }

    // Start the translation attempt
    const success = await attemptTranslation()

    if (!success) {
      // Force a page reload as last resort if translation completely fails
      setTimeout(() => {
        if (getCurrentLanguage() !== langCode) {
          // Set cookie manually and reload
          document.cookie = `googtrans=/en/${langCode}; path=/`
          window.location.reload()
        }
      }, 1000)
    }
  }

  return (
    <>
      {/* Hidden Google Translate element */}
      <div id="google_translate_element_hidden" style={{ display: 'none' }}></div>

      {/* Custom UI */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-200 dark:bg-neutral-800/50 hover:bg-neutral-300 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg transition-all notranslate disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isReady || isTranslating}
        >
          <Globe className={`w-4 h-4 text-neutral-600 dark:text-neutral-400 ${isTranslating ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium text-neutral-900 dark:text-white">
            {isTranslating ? 'Translating...' : LANGUAGES.find((l) => l.code === currentLang)?.name}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-neutral-600 dark:text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div
              className="absolute left-0 mt-2 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl z-50 py-2 notranslate"
              translate="no"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  disabled={isTranslating}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    currentLang === lang.code
                      ? 'bg-linear-to-r from-sky-400 via-sky-500 to-sky-600 text-white font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        /* Hide all Google Translate UI elements */
        .goog-te-banner-frame,
        .goog-te-menu-frame,
        .skiptranslate iframe,
        #google_translate_element_hidden,
        #google_translate_element_hidden * {
          display: none !important;
          visibility: hidden !important;
        }

        /* Prevent body offset */
        body {
          top: 0 !important;
          position: static !important;
        }

        .notranslate,
        .notranslate * {
          translate: no !important;
        }
      `}</style>
    </>
  )
}
