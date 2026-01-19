'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="dark:bg-neutral-950 bg-white min-h-screen flex items-center justify-center px-6">
      <motion.div
        className="text-center space-y-8 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 404 Text */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="dark:text-white text-neutral-900 text-9xl font-black">404</h1>
          <p className="dark:text-neutral-600 text-neutral-500 text-xs font-semibold uppercase tracking-widest">
            Page Not Found
          </p>
        </motion.div>

        {/* Description */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="dark:text-white text-neutral-900 text-3xl font-black">Oops!</h2>
          <p className="dark:text-neutral-400 text-neutral-600 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors">
              <Home className="w-5 h-5" />
              Go Home
            </button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-700 bg-neutral-200 hover:bg-neutral-300 border-neutral-300 text-dark:white text-neutral-900 font-semibold rounded-lg transition-colors border"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
