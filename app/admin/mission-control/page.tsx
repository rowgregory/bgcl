'use client'

import EmailTemplateCard from '@/app/components/admin/mission-control/EmailTemplateCard'
import GoogleAnalyticsCard from '@/app/components/admin/mission-control/GoogleAnalyticsCard'
import GoogleSearchConsoleCard from '@/app/components/admin/mission-control/GoogleSearchConsoleCard'
import HotjarCard from '@/app/components/admin/mission-control/HotjarCard'
import MetaPixelCard from '@/app/components/admin/mission-control/MetaPixelCard'
import ParentPortalCard from '@/app/components/admin/mission-control/ParentPortalCard'
import StripeCard from '@/app/components/admin/mission-control/StripeCard'
import { containerVariants } from '@/app/lib/constants/motion'
import { motion } from 'framer-motion'

const MissionControl = () => {
  return (
    <>
      <div className="h-full dark:bg-neutral-950 bg-white p-6">
        <div className="mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 gap-6 mb-6"
          >
            <GoogleAnalyticsCard />
            <GoogleSearchConsoleCard />
            <StripeCard />
            <MetaPixelCard />
            <HotjarCard />
            <EmailTemplateCard />
            <ParentPortalCard />
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default MissionControl
