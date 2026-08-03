'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { adminNavigationLinkData } from '@/lib/utils/adminNavLinks'
import dropdownActionItems from '@/lib/constants/dropdownActionItems'
import { getCurrentPageId } from '@/lib/utils/getCurrentPageId'
import ActionMenuButton from '@/components/ui/buttons/ActionMenuButton'
import LogoutButton from '@/components/ui/buttons/LogoutButton'
import MobileMenuButton from '@/components/ui/buttons/MobileMenuButton'
import { CampaignDrawer } from './donations/_components/CampaignDrawer'
import ResourceDrawer from '@/app/(authenticated)/admin/the-library/resources/_components/ResourceDrawer'
import { DonationDrawer } from '@/app/(authenticated)/admin/donations/_components/DonationDrawer'
import { FailedPaymentsDrawer } from '@/components/drawers/FailedPaymentDrawer'
import { NewsDrawer } from '@/app/(authenticated)/admin/the-library/news/_components/NewsDrawer'
import { PartnerDrawer } from '@/components/drawers/PartnerDrawer'
import ProgramDrawer from '@/app/(authenticated)/admin/the-library/programs/_components/ProgramDrawer'
import { TeamMemberDrawer } from '@/app/(authenticated)/admin/the-library/_components/TeamMemberDrawer'
import { ContactSubmissionDrawer } from '@/components/drawers/ContactSubmissionDrawer'
import AdminSidebar from '@/app/(authenticated)/admin/sidebar'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import ActionMenuDropdown from '@/app/(authenticated)/admin/_components/ActionMenuDropdown'
import ClosingDrawer from '@/app/(authenticated)/admin/the-library/closings/_components/ClosingDrawer'
import { useSidebarStore } from '@/stores/useSidebarStore'
import UserDrawer from '@/app/(authenticated)/admin/users/_components/UserDrawer'
import NewsletterDrawer from '@/app/(authenticated)/admin/the-library/newsletters/_components/NewsletterDrawer'
import { Theme } from '@prisma/client'

type Props = {
  children: ReactNode
  themes?: Theme[]
  isModalEnabled?: boolean
}

export default function AdminLayoutClient({ children, themes, isModalEnabled }: Props) {
  const pathname = usePathname()
  const navigationGroups = adminNavigationLinkData(pathname)
  const selectedPage = getCurrentPageId(pathname, navigationGroups)
  const adminSidebar = useSidebarStore((s) => s.adminSidebar)
  const toggleAdminSidebar = useSidebarStore((s) => s.toggleAdminSidebar)
  const onClose = useSidebarStore((s) => s.closeAdminSidebar)
  const session = useSession()

  const isEventDetailsPage = pathname.includes('/admin/events/events/')

  return (
    <>
      <ProgramDrawer themes={themes} />
      <UserDrawer />
      <TeamMemberDrawer />
      <NewsDrawer />
      <NewsletterDrawer />
      <ResourceDrawer />
      <CampaignDrawer />
      <ClosingDrawer />
      <ActionMenuDropdown actionItems={dropdownActionItems(isModalEnabled)} isModalEnabled={isModalEnabled} />
      <FailedPaymentsDrawer />
      <DonationDrawer />

      <PartnerDrawer />
      <ContactSubmissionDrawer />

      {/* ── Desktop header ── */}
      {!isEventDetailsPage && (
        <header className="hidden lg:flex fixed top-0 left-64 right-0 items-center justify-between dark:bg-neutral-950 dark:border-neutral-800 bg-white border-neutral-200 border-b py-2.5 px-6 z-30 h-15.25">
          <h1 className="text-lg font-bold dark:text-neutral-100 text-neutral-900 capitalize">{selectedPage}</h1>
          <div className="flex items-center gap-2 md:gap-4">
            {session.data?.user?.role === 'SUPERUSER' && (
              <Link
                href="/super"
                className="text-xs font-mono text-neutral-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
              >
                super
              </Link>
            )}
            <ActionMenuButton />
            <MobileMenuButton />
            <LogoutButton />
          </div>
        </header>
      )}

      <div className="min-h-screen dark:bg-neutral-950 bg-white flex">
        {!isEventDetailsPage && (
          <>
            {/* ── Mobile sidebar backdrop ── */}
            {adminSidebar && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 dark:bg-black/50 bg-black/30 z-40 lg:hidden"
              />
            )}

            {/* ── Desktop sidebar ── */}
            <div className="hidden lg:block fixed left-0 top-0 h-screen w-64 z-20">
              <AdminSidebar />
            </div>

            {/* ── Mobile sidebar ── */}
            <motion.div
              initial={false}
              animate={{ x: adminSidebar ? 0 : '-100%' }}
              transition={{ duration: 0.3 }}
              className="fixed lg:hidden inset-y-0 left-0 z-50 w-64"
            >
              <AdminSidebar />
            </motion.div>
          </>
        )}

        {/* ── Main content ── */}
        {isEventDetailsPage ? (
          <>{children}</>
        ) : (
          <main className="flex-1 flex flex-col lg:ml-64 overflow-y-auto lg:mt-15">
            {/* Mobile header */}
            <div className="fixed w-full z-20 top-0 lg:hidden flex items-center justify-between dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border-b px-4 py-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleAdminSidebar()}
                className="p-2 dark:hover:bg-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-6 h-6 dark:text-white text-neutral-900" aria-hidden="true" />
              </motion.button>
              <h1 className="text-lg font-bold dark:text-white text-neutral-900 capitalize">{selectedPage}</h1>
              <div className="w-10" aria-hidden="true" />
            </div>

            {children}
          </main>
        )}
      </div>
    </>
  )
}
