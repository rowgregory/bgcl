'use client'

import React, { FC, useState } from 'react'
import useCustomPathname from '@/hooks/useCustomPathname'
import getCurrentPageId from '../lib/utils/getCurrentPageId'
import { motion } from 'framer-motion'
import { adminNavLinks } from '../lib/constants/navigation/adminNavLinks'
import HeroStudio from '../components/studios/HeroStudio'
import FixedLeftNavigationPanel from '../components/navigation/FixedLeftNavigationPanel'
import FixedHeader from '../components/navigation/FixedHeader'
import { IAdminLayoutClient } from '@/types/admin'
import { useHydrateAdminData } from '@/hooks/useHydrateAdminData'
import EventDrawer from '../components/drawers/EventDrawer'
import EventTicketDrawer from '../components/drawers/EventTicketDrawer'
import { useUserSelector } from '../redux/store'

const AdminLayoutClient: FC<IAdminLayoutClient> = ({ children, data }) => {
  const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(false)
  const path = useCustomPathname()
  const selectedPage = getCurrentPageId(path, adminNavLinks)
  const { user } = useUserSelector()
  useHydrateAdminData(data)

  return (
    <>
      <HeroStudio />
      <EventDrawer />
      <EventTicketDrawer />
      <div className="min-h-screen bg-neutral-950 flex">
        <FixedLeftNavigationPanel
          isNavigationCollapsed={isNavigationCollapsed}
          setIsNavigationCollapsed={setIsNavigationCollapsed}
          selectedPage={selectedPage}
          links={adminNavLinks}
          user={user}
        />

        {/* Main Content Area */}
        <div className={`${isNavigationCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'} flex-1 flex flex-col`}>
          {/* Fixed Header */}
          <FixedHeader
            isNavigationCollapsed={isNavigationCollapsed}
            selectedPage={selectedPage}
            links={adminNavLinks}
          />

          <main className="flex-1 pt-[68px] overflow-hidden">
            <motion.div
              key={selectedPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="h-full overflow-y-auto"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </>
  )
}

export default AdminLayoutClient
