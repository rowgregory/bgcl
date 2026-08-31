'use client'

import { SupporterHeader } from '@/app/(authenticated)/supporter/_components/SupporterHeader'
import { ReactNode } from 'react'
import { SupporterFooter } from './SupporterFooter'

export default function SupporterShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <SupporterHeader />
      <main className="flex-1">{children}</main>
      <SupporterFooter />
    </div>
  )
}
