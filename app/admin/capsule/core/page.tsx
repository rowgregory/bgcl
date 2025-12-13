'use client'

import { motion } from 'framer-motion'
import { Calendar, DollarSign, Users, TrendingUp, Ticket, CheckCircle, Plus } from 'lucide-react'
import { containerVariants } from '@/app/lib/constants/motion'
import { setOpenEventDrawer } from '@/app/redux/features/eventSlice'
import { useEventSelector } from '@/app/redux/store'
import UpcomingEvent from '@/app/components/admin/capsule/UpcomingEvent'
import Stat from '@/app/components/admin/capsule/Stat'
import QuickAction from '@/app/components/admin/capsule/QuickAction'
import RecentActivity from '@/app/components/admin/capsule/RecentActivity'

const stats = [
  {
    icon: Calendar,
    label: 'Active Events',
    value: '12',
    change: '+3',
    trend: 'up',
    color: 'bg-purple-500',
    period: 'this month'
  },
  {
    icon: Ticket,
    label: 'Tickets Sold',
    value: '847',
    change: '+156',
    trend: 'up',
    color: 'bg-blue-500',
    period: 'this week'
  },
  {
    icon: DollarSign,
    label: 'Revenue',
    value: '$24,580',
    change: '+18.2%',
    trend: 'up',
    color: 'bg-green-500',
    period: 'this month'
  },
  {
    icon: Users,
    label: 'Total Attendees',
    value: '1,234',
    change: '+12.5%',
    trend: 'up',
    color: 'bg-amber-500',
    period: 'this month'
  }
]

// const upcomingEvents = [
//   {
//     id: 1,
//     name: 'Summer Gala Fundraiser',
//     date: 'Oct 15, 2025',
//     time: '6:00 PM',
//     location: 'Main Hall',
//     attendees: 156,
//     capacity: 200,
//     revenue: 7800,
//     status: 'on-sale',
//     color: 'from-purple-600 to-blue-600'
//   },
//   {
//     id: 2,
//     name: 'Youth Basketball Tournament',
//     date: 'Oct 18, 2025',
//     time: '9:00 AM',
//     location: 'Gymnasium',
//     attendees: 89,
//     capacity: 120,
//     revenue: 2670,
//     status: 'on-sale',
//     color: 'from-blue-600 to-cyan-600'
//   },
//   {
//     id: 3,
//     name: 'Community Art Show',
//     date: 'Oct 22, 2025',
//     time: '2:00 PM',
//     location: 'Arts Center',
//     attendees: 45,
//     capacity: 80,
//     revenue: 1125,
//     status: 'low-availability',
//     color: 'from-cyan-600 to-teal-600'
//   },
//   {
//     id: 4,
//     name: 'Family Movie Night',
//     date: 'Oct 25, 2025',
//     time: '7:00 PM',
//     location: 'Auditorium',
//     attendees: 180,
//     capacity: 180,
//     revenue: 0,
//     status: 'sold-out',
//     color: 'from-green-600 to-emerald-600'
//   }
// ]

const recentActivity = [
  {
    id: 1,
    type: 'sale',
    event: 'Summer Gala Fundraiser',
    action: '5 tickets sold',
    time: '5m ago'
  },
  {
    id: 2,
    type: 'registration',
    event: 'Youth Basketball Tournament',
    action: 'Team registered',
    time: '12m ago'
  },
  {
    id: 3,
    type: 'checkin',
    event: 'Family Movie Night',
    action: '12 attendees checked in',
    time: '1h ago'
  },
  {
    id: 4,
    type: 'update',
    event: 'Community Art Show',
    action: 'Event details updated',
    time: '2h ago'
  }
]

const quickActions = [
  {
    icon: Plus,
    label: 'Create Event',
    color: 'from-purple-600 to-blue-600',
    action: 'create',
    func: setOpenEventDrawer
  },
  {
    icon: Ticket,
    label: 'Sell Tickets',
    color: 'from-blue-600 to-cyan-600',
    action: 'sell'
  },
  {
    icon: CheckCircle,
    label: 'Check-in',
    color: 'from-green-600 to-emerald-600',
    action: 'checkin'
  },
  {
    icon: TrendingUp,
    label: 'View Reports',
    color: 'from-amber-600 to-orange-600',
    action: 'reports'
  }
]

const TheCapsuleCore = () => {
  const { events } = useEventSelector()

  return (
    <div className="mx-auto text-white">
      <div className="flex flex-col lg:flex-row">
        <div className="p-6 flex-1 flex flex-col w-full">
          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
          >
            {stats.map((stat, index) => (
              <Stat key={index} stat={stat} />
            ))}
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-zinc-900/90 backdrop-blur-sm rounded-xl p-6 border border-zinc-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Upcoming Events</h2>
              <button className="text-sm text-zinc-400 hover:text-white transition-colors">View All</button>
            </div>

            <div className="space-y-4">
              {events?.map((event, index) => (
                <UpcomingEvent key={index} event={event} index={index} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="block w-full md:w-80 bg-zinc-900/30 border-l border-zinc-800/50 p-6 overflow-y-auto space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-bold text-zinc-300">Quick Actions</h2>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <QuickAction key={index} action={action} />
              ))}
            </div>
          </motion.div>

          {/* Divider */}
          <div className="border-t border-zinc-800/50" />

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-300">Recent Activity</h2>
              <TrendingUp className="w-4 h-4 text-zinc-500" />
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <RecentActivity key={index} activity={activity} index={index} />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-2.5 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg text-sm font-medium transition-colors border border-zinc-800/50 hover:border-zinc-700/50"
            >
              View All Activity
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default TheCapsuleCore
