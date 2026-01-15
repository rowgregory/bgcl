import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { useAppDispatch } from '@/app/lib/store/store'
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit'

interface IQuickAction {
  action: {
    func?: ActionCreatorWithoutPayload<'event/setOpenEventDrawer'>
    color: string
    icon: LucideIcon
    label: string
  }
}

const QuickAction: FC<IQuickAction> = ({ action }) => {
  const IconComponent = action.icon
  const dispatch = useAppDispatch()

  return (
    <motion.button
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
          <IconComponent className="w-5 h-5" />
        </div>
        <span className="font-medium text-sm">{action.label}</span>
      </div>
    </motion.button>
  )
}

export default QuickAction
