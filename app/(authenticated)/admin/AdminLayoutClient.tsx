'use client'

import { FC } from 'react'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { ILayout } from '@/types/common.types'

import { store, useDashboardSelector } from '@/lib/store/store'
import { setCloseAdminSidebar, setToggleAdminSidebar } from '@/lib/store/slices/dashboardSlice'
import { adminNavigationLinkData } from '@/lib/constants/adminNavLinks'
import dropdownActionItems from '@/lib/constants/dropdownActionItems'
import { getCurrentPageId } from '@/lib/utils/getCurrentPageId'

import ActionMenuButton from '../../../components/ui/buttons/ActionMenuButton'
import LogoutButton from '../../../components/ui/buttons/LogoutButton'
import MobileMenuButton from '../../../components/ui/buttons/MobileMenuButton'

import { CampaignDrawer } from '../../../components/drawers/CampaignDrawer'
import { ClubResourceDrawer } from '../../../components/drawers/ClubResourceDrawer'
import { ClosingDrawer } from '../../../components/drawers/ClosingDrawer'
import { DonationDrawer } from '../../../components/drawers/DonationDrawer'
import { EventDrawer } from '../../../components/drawers/EventDrawer'
import { FailedPaymentsDrawer } from '../../../components/drawers/FailedPaymentDrawer'
import { NewsDrawer } from '../../../components/drawers/NewsDrawer'
import { NewsletterDrawer } from '../../../components/drawers/NewsletterDrawer'
import { PartnerDrawer } from '../../../components/drawers/PartnerDrawer'
import { ProgramDrawer } from '../../../components/drawers/ProgramDrawer'
import { TeamMemberDrawer } from '../../../components/drawers/TeamMemberDrawer'
import { TicketDrawer } from '../../../components/drawers/TicketDrawer'
import { AdminTicketOrderDrawer } from '../../../components/drawers/AdminTicketOrderDrawer'
import { UserDrawer } from '../../../components/drawers/UserDrawer'
import { ContactSubmissionDrawer } from '../../../components/drawers/ContactSubmissionDrawer'
import AdminSidebar from '@/app/(authenticated)/admin/sidebar'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import ActionMenuDropdown from '@/app/(authenticated)/admin/_components/ActionMenuDropdown'

export const AdminLayoutClient: FC<ILayout> = ({ children, themes, isModalEnabled }) => {
  const pathname = usePathname()
  const navigationGroups = adminNavigationLinkData(pathname)
  const selectedPage = getCurrentPageId(pathname, navigationGroups)
  const { adminSidebar } = useDashboardSelector()
  const onClose = () => store.dispatch(setCloseAdminSidebar())
  const session = useSession()

  const isEventDetailsPage = pathname.includes('/admin/events/events/')

  return (
    <>
      {/* ── Drawers & overlays ── */}
      <EventDrawer />
      <TicketDrawer />
      <ProgramDrawer themes={themes} />
      <UserDrawer />
      <TeamMemberDrawer />
      <NewsDrawer />
      <NewsletterDrawer />
      <ClubResourceDrawer />
      <CampaignDrawer />
      <ClosingDrawer />
      <ActionMenuDropdown actionItems={dropdownActionItems(isModalEnabled)} isModalEnabled={isModalEnabled} />
      <FailedPaymentsDrawer />
      <DonationDrawer />
      <AdminTicketOrderDrawer />
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
                onClick={() => store.dispatch(setToggleAdminSidebar(adminSidebar))}
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
