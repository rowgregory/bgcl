import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { itemVariants } from '@/app/lib/constants/motion'
import { ArrowDownRight, ArrowUpRight, LucideIcon } from 'lucide-react'

interface IStat {
  stat: { icon: LucideIcon; label: string; value: string; period: string; color: string; trend: string; change: string }
}

const Stat: FC<IStat> = ({ stat }) => {
  return (
    <motion.div
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
  )
}

export default Stat
