import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Clock, DollarSign, Ticket } from 'lucide-react'

interface IRecentActivity {
  activity: { type: string; event: string; action: string; time: string }
  index: number
}

const RecentActivity: FC<IRecentActivity> = ({ activity, index }) => {
  return (
    <motion.div
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
  )
}

export default RecentActivity
