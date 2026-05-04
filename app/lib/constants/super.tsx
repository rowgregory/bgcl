import { LogLevel } from '@/types/super'
import { OrderStatus } from '@prisma/client'
import { AlertCircle, Info, ScrollText, Users } from 'lucide-react'

export const ORDER_TYPE_LABEL: Record<string, string> = {
  TICKET_PURCHASE: 'Ticket',
  ONE_TIME_DONATION: 'Donation',
  RECURRING_DONATION: 'Recurring'
}

export const STATUS_STYLES: Record<OrderStatus, string> = {
  CONFIRMED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  FAILED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  REFUNDED: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400',
  PROCESSING: '',
  CANCELLED: '',
  PENDING_CANCELLATION: ''
}

export const ROLE_STYLES: Record<string, string> = {
  SUPERUSER: 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400',
  ADMIN: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  SUPPORTER: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  PROGRAM: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400'
}

export const LOG_ICON: Record<LogLevel, React.ReactNode> = {
  INFO: <Info className="w-3.5 h-3.5 text-sky-500" />,
  ERROR: <AlertCircle className="w-3.5 h-3.5 text-red-500" />,
  WARN: <AlertCircle className="w-3.5 h-3.5 text-yellow-500" />
}

export const LOG_ROW_STYLES: Record<LogLevel, string> = {
  INFO: 'bg-sky-50/50 dark:bg-sky-950/20',
  ERROR: 'bg-red-50/50 dark:bg-red-950/20',
  WARN: 'bg-yellow-50/50 dark:bg-yellow-950/20'
}

export const TABS = [
  { key: 'users', label: 'Users', icon: Users },
  { key: 'logs', label: 'Logs', icon: ScrollText }
] as const
