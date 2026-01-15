'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { store, useApplicationSelector } from '@/app/lib/store/store'
import { setCloseLanguageDropdown, setSelectedLanguage } from '@/app/lib/store/slices/appSlice'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'ht', name: 'Creole' },
  { code: 'zh', name: 'Mandarin' }
]

export const LanguageDropdown = () => {
  const { languageDropdown, selectedLanguage } = useApplicationSelector()
  const onClose = () => store.dispatch(setCloseLanguageDropdown())

  const handleSelect = (language: string) => {
    store.dispatch(setSelectedLanguage(language))
    onClose()
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
            className="absolute top-10 left-10 mt-2 w-40 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-100"
          >
            <div className="py-2">
              {LANGUAGES.map((language, index) => (
                <motion.button
                  key={language.code}
                  onClick={() => handleSelect(language.name)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    selectedLanguage === language.name
                      ? 'bg-linear-to-r from-sky-500 via-indigo-500 to-indigo-500 text-white font-medium'
                      : 'text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {language.name}
                </motion.button>
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
            className="fixed inset-0 z-90"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
