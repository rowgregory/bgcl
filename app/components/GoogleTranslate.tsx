// components/LanguageSwitcher.tsx
'use client'

import { useState, useEffect } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { store } from '../lib/store/store'
import { setIsNotSpanish, setIsSpanish } from '../lib/store/slices/appSlice'

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
    }
  }, [])

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode)
    setIsOpen(false)

    if (langCode === 'es') {
      store.dispatch(setIsSpanish())
    } else {
      store.dispatch(setIsNotSpanish())
    }

    // Find and trigger the Google Translate select
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
    if (select) {
      select.value = langCode
      select.dispatchEvent(new Event('change', { bubbles: true }))

      // Force a small delay to ensure translation triggers
      setTimeout(() => {
        const frame = document.querySelector('.goog-te-menu-frame') as HTMLElement
        if (frame) {
          frame.style.display = 'none'
        }
      }, 100)
    } else {
      console.warn('Google Translate not ready yet')
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
          className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-200 dark:bg-neutral-800/50 hover:bg-neutral-300 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg transition-all notranslate"
          disabled={!isReady}
        >
          <Globe className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          <span className="text-sm font-medium text-neutral-900 dark:text-white">
            {LANGUAGES.find((l) => l.code === currentLang)?.name}
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
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    currentLang === lang.code
                      ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold'
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
