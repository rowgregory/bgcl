'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Picture from '@/app/components/common/Picture'

export default function CustomCallback() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (session?.user) {
      const { role } = session.user

      if (role === 'ADMIN' || role === 'SUPERUSER') {
        router.push('/admin/mission-control')
      } else if (role === 'PROGRAM') {
        router.push('/program/airlock')
      } else {
        router.push('/supporter/overview')
      }
    } else {
      router.push('/auth/login')
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-sky-50 via-white to-blue-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 px-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl dark:shadow-2xl border border-neutral-200 dark:border-neutral-800 p-8 sm:p-12">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-20 h-20 sm:w-32">
              <Picture
                priority={true}
                src="/images/vertical-logo-light.png"
                alt="Boys & Girls Club Logo"
                className="object-contain w-full h-full block dark:hidden"
              />
              <Picture
                priority={true}
                src="/images/vertical-logo-dark.png"
                alt="Boys & Girls Club Logo"
                className="object-contain w-full h-full dark:block hidden"
              />
            </div>
          </div>

          {/* Loading Animation */}
          <div className="flex flex-col items-center space-y-6">
            {/* Loading Text */}
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                Launching Mission Control
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">Preparing your takeoff...</p>
            </div>

            {/* Progress Dots */}
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-sky-400 dark:bg-sky-500 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-sky-400 dark:bg-sky-500 animate-pulse [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-sky-400 dark:bg-sky-500 animate-pulse [animation-delay:0.4s]"></div>
            </div>
          </div>

          {/* Bottom Decoration */}
          <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-xs text-center text-neutral-500 dark:text-neutral-500">Boys & Girls Club of Lynn</p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse [animation-delay:0.5s]"></div>
      </div>
    </div>
  )
}
