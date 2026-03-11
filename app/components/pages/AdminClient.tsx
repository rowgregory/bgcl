'use client'

import { FC } from 'react'
import { getCurrentPageId } from '../../lib/utils/getCurrentPageId'
import { motion } from 'framer-motion'
import HeroStudio from '../hero-studio/HeroStudio'
import EventDrawer from '../drawers/EventDrawer'
import TicketDrawer from '../drawers/TicketDrawer'
import { store, useDashboardSelector } from '../../lib/store/store'
import ProgramDrawer from '../drawers/ProgramDrawer'
import { ILayout } from '@/types/common'
import UserDrawer from '../drawers/UserDrawer'
import { setCloseAdminSidebar, setToggleAdminSidebar } from '../../lib/store/slices/dashboardSlice'
import { adminNavigationLinkData } from '../../lib/constants/adminNavLinks'
import { usePathname } from 'next/navigation'
import AdminSidebar from '../../admin/sidebar'
import { Menu } from 'lucide-react'
import ActionMenuButton from '../ui/buttons/ActionMenuButton'
import MobileMenuButton from '../ui/buttons/MobileMenuButton'
import LogoutButton from '../ui/buttons/LogoutButton'
import ActionMenuDropdown from '../navigation/ActionMenuDropdown'
import dropdownActionItems from '../../lib/constants/dropdownActionItems'
import TeamMemberDrawer from '../drawers/TeamMemberDrawer'
import NewsDrawer from '../drawers/NewsDrawer'
import NewsletterDrawer from '../drawers/NewsletterDrawer'
import ClubResourceDrawer from '../drawers/ClubResourceDrawer'
import CampaignDrawer from '../drawers/CampaignDrawer'
import ClosingDrawer from '../drawers/ClosingDrawer'
import FailedPaymentsDrawer from '../drawers/FailedPaymentDrawer'
import DonationDrawer from '../drawers/DonationDrawer'
import { useSession } from 'next-auth/react'
import { TicketOrderDrawer } from '../drawers/AdminTicketOrderDrawer'
import { PartnerDrawer } from '../drawers/PartnerDrawer'

const AdminLayout: FC<ILayout> = ({ children, themes, isModalEnabled }) => {
  const pathname = usePathname()
  const session = useSession()
  const navigationGroups = adminNavigationLinkData(pathname, session?.data?.user?.role === 'SUPERUSER')
  const selectedPage = getCurrentPageId(pathname, navigationGroups)
  const { adminSidebar } = useDashboardSelector()
  const onClose = () => store.dispatch(setCloseAdminSidebar())

  return (
    <>
      <HeroStudio />
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
      <TicketOrderDrawer />
      <PartnerDrawer />

      {/* Desktop Fixed Header */}
      <header className="hidden lg:block fixed top-0 left-64 right-0 dark:bg-neutral-950 dark:border-neutral-800 bg-white border-neutral-200 border-b py-2.5 px-6 z-30 h-15.25">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold dark:text-neutral-100 text-neutral-900 capitalize">{selectedPage}</h1>
          <div className="flex items-center space-x-2 md:space-x-4 h-full">
            <ActionMenuButton />
            <MobileMenuButton />
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="min-h-screen dark:bg-neutral-950 bg-white flex">
        {/* Mobile Sidebar Overlay */}
        {adminSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 dark:bg-black/50 bg-black/30 z-40 lg:hidden"
          />
        )}
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block fixed left-0 top-0 h-screen w-64 z-20">
          <AdminSidebar />
        </div>

        {/* Mobile Sidebar */}
        <motion.div
          initial={false}
          animate={{ x: adminSidebar ? 0 : '-100%' }}
          transition={{ duration: 0.3 }}
          className="fixed lg:hidden inset-y-0 left-0 z-50 w-64"
        >
          <AdminSidebar />
        </motion.div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto flex flex-col lg:ml-64 lg:mt-15">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border-b px-4 py-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => store.dispatch(setToggleAdminSidebar(adminSidebar))}
              className="p-2 dark:hover:bg-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 dark:text-white text-neutral-900" />
            </motion.button>
            <h1 className="text-lg font-bold dark:text-white text-neutral-900 capitalize">{selectedPage}</h1>
            <div className="w-10" />
          </div>

          {/* Content */}
          {children}
        </main>
      </div>
    </>
  )
}

export default AdminLayout
