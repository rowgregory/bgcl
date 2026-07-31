'use client'

import { store } from '@/lib/store/store'
import { setOpenDonationDrawer } from '@/lib/store/slices/dashboardSlice'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, CreditCard, RefreshCw, AlertCircle, Check, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils/date-utils'
import { IOrder } from '@/types/entities/order'

export default function FuelTankTransactionOrderRow({ order, index }: { order: IOrder; index: number }) {
  const isFailed = order?.status === 'FAILED'
  const isCancelled = order?.status === 'CANCELLED'

  return (
    <motion.tr
      onClick={() => store.dispatch(setOpenDonationDrawer(order))}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.02 }}
      className={`border-b border-neutral-100 dark:border-neutral-800/50 cursor-pointer transition-colors ${
        isFailed
          ? 'bg-red-50/50 dark:bg-red-900/5 hover:bg-red-50 dark:hover:bg-red-900/10 opacity-75'
          : isCancelled
            ? 'opacity-50 hover:bg-neutral-50 dark:hover:bg-neutral-900/30'
            : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/30'
      }`}
    >
      {/* Amount */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-sm font-bold ${
              isFailed
                ? 'text-red-600 dark:text-red-400'
                : isCancelled
                  ? 'text-neutral-400 line-through'
                  : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order?.totalAmount)}
          </span>
          {isFailed && <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
        </div>
      </td>

      {/* Name */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="text-sm text-neutral-900 dark:text-white max-w-30 truncate">{order?.customerName}</span>
        </div>
      </td>

      {/* Email */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          {order?.customerEmail ? (
            <a
              href={`mailto:${order?.customerEmail}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline max-w-40 truncate block"
            >
              {order?.customerEmail}
            </a>
          ) : (
            <span className="text-xs text-neutral-400">—</span>
          )}
        </div>
      </td>

      {/* Date */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            {formatDate(order?.paidAt || order?.createdAt)}
          </span>
        </div>
      </td>

      {/* Campaign */}
      <td className="px-4 py-3 whitespace-nowrap">
        {order?.campaign ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 rounded-full text-xs font-semibold max-w-30 truncate">
            <Tag className="w-3 h-3 shrink-0" />
            {order?.campaign.name}
          </span>
        ) : (
          <span className="text-xs text-neutral-400">—</span>
        )}
      </td>

      {/* Type */}
      <td className="px-4 py-3 whitespace-nowrap">
        {order?.isRecurring ? (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
            <RefreshCw className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 capitalize">
              {order?.recurringFrequency || 'Sub'}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full">
            <CreditCard className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Once</span>
          </div>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            order?.status === 'CONFIRMED'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : order?.status === 'FAILED'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                : order?.status === 'CANCELLED'
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
          }`}
        >
          <Check className="w-3 h-3" />
          {order?.status}
        </span>
      </td>
    </motion.tr>
  )
}
