'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { store, useApplicationSelector } from '@/app/lib/store/store'
import { setCloseLanguageDropdown, setSelectedLanguage } from '@/app/lib/store/slices/appSlice'
import { useEffect, useState } from 'react'

const LANGUAGES = [
  { code: 'en', name: 'English', comingSoon: 'Coming Soon' },
  { code: 'es', name: 'Spanish', comingSoon: 'Próximamente' },
  { code: 'ht', name: 'Creole', comingSoon: 'Byento disponib' },
  { code: 'zh', name: 'Mandarin', comingSoon: '即将推出' }
]

export const LanguageDropdown = () => {
  const { languageDropdown, selectedLanguage } = useApplicationSelector()
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null)
  const onClose = () => store.dispatch(setCloseLanguageDropdown())

  useEffect(() => {
    if (languageDropdown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [languageDropdown])

  const handleSelect = (language: string) => {
    // Only allow English selection for now
    if (language === 'English') {
      store.dispatch(setSelectedLanguage(language))
      onClose()
    }
  }

  return (
    <div className="max-w-334 w-full mx-auto relative">
      <AnimatePresence>
        {languageDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-10 left-10 mt-2 w-40 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-120"
          >
            <div className="py-2">
              {LANGUAGES.map((language, index) => (
                <div key={language.code} className="relative">
                  <motion.button
                    onClick={() => handleSelect(language.name)}
                    onMouseEnter={() => language.name !== 'English' && setHoveredLanguage(language.code)}
                    onMouseLeave={() => setHoveredLanguage(null)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      selectedLanguage === language.name
                        ? 'bg-linear-to-r from-sky-500 via-indigo-500 to-indigo-500 text-white font-medium'
                        : language.name === 'English'
                          ? 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                          : 'text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-not-allowed'
                    }`}
                  >
                    {language.name}
                  </motion.button>

                  {/* Coming Soon Tooltip */}
                  <AnimatePresence>
                    {hoveredLanguage === language.code && language.name !== 'English' && (
                      <motion.div
                        initial={{ opacity: 0, x: -5, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-md shadow-md whitespace-nowrap z-130"
                      >
                        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                          {language.comingSoon}
                        </span>
                        {/* Arrow pointing left */}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-neutral-100 dark:border-r-neutral-700" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close dropdown */}
      <AnimatePresence>
        {languageDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-110 backdrop-blur-md"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
