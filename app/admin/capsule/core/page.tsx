'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  MapPin,
  Ticket,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Plus
} from 'lucide-react'
import { containerVariants, itemVariants } from '@/app/lib/constants/motion'
import { setOpenEventDrawer } from '@/app/redux/features/eventSlice'
import { useAppDispatch, useEventSelector } from '@/app/redux/store'
import { setInputs } from '@/app/redux/features/formSlice'

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

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'on-sale':
      return {
        text: 'On Sale',
        color: 'bg-green-500/20 text-green-400 border-green-500/30'
      }
    case 'sold-out':
      return {
        text: 'Sold Out',
        color: 'bg-red-500/20 text-red-400 border-red-500/30'
      }
    case 'low-availability':
      return {
        text: 'Low Availability',
        color: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      }
    default:
      return {
        text: 'Draft',
        color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
      }
  }
}

const TheCapsuleCore = () => {
  const dispatch = useAppDispatch()
  const { events } = useEventSelector()
  console.log('Events:: ', events)
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
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-zinc-900/90 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div
                    className={`flex items-center ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'} text-sm font-medium`}
                  >
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-zinc-400 text-sm mb-1">{stat.label}</h3>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.period}</p>
              </motion.div>
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
              {events?.map((event, index) => {
                const progress = (event.attendeeCount / event.capacity) * 100
                const badge = getStatusBadge(event.status)

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="p-5 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-all border border-zinc-700/50 hover:border-zinc-600 cursor-pointer"
                    onClick={() => {
                      dispatch(setOpenEventDrawer())
                      dispatch(setInputs({ formName: 'eventForm', data: { ...event, isUpdating: true } }))
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <span className={`px-2 py-1 border rounded-full text-xs font-medium ${badge.color}`}>
                            {badge.text}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-zinc-400">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {event.date.toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {event.time}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Capacity</span>
                        <span className="font-medium">
                          {event.attendeeCount} / {event.capacity} attendees
                        </span>
                      </div>

                      <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className={`h-full bg-linear-to-r from-purple-600 to-blue-600 rounded-full`}
                        />
                      </div>

                      {/* <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-zinc-400">Revenue</span>
                        <span className="text-lg font-bold text-green-400">${event.revenue.toLocaleString()}</span>
                      </div> */}
                    </div>
                  </motion.div>
                )
              })}
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
                <motion.button
                  key={index}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full group relative overflow-hidden rounded-lg"
                  onClick={() => {
                    if (action.func) {
                      dispatch(action.func())
                    }
                  }}
                >
                  {/* Gradient border */}
                  <div
                    className={`absolute inset-0 bg-linear-to-r ${action.color} opacity-50 group-hover:opacity-100 transition-opacity`}
                  />
                  <div className="absolute inset-px bg-zinc-900 rounded-lg" />

                  {/* Content */}
                  <div className="relative px-4 py-3 flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-linear-to-br ${action.color}`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm">{action.label}</span>
                  </div>
                </motion.button>
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
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-3 bg-zinc-800/30 rounded-lg hover:bg-zinc-800/50 transition-all border border-zinc-800/50 hover:border-zinc-700/50 cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-1.5 rounded-full shrink-0 ${
                        activity.type === 'sale'
                          ? 'bg-green-500/20 text-green-400'
                          : activity.type === 'registration'
                            ? 'bg-blue-500/20 text-blue-400'
                            : activity.type === 'checkin'
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {activity.type === 'sale' && <DollarSign className="w-3.5 h-3.5" />}
                      {activity.type === 'registration' && <Ticket className="w-3.5 h-3.5" />}
                      {activity.type === 'checkin' && <CheckCircle className="w-3.5 h-3.5" />}
                      {activity.type === 'update' && <AlertCircle className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-white">{activity.event}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{activity.action}</p>
                      <p className="text-xs text-zinc-500 mt-1 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
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
