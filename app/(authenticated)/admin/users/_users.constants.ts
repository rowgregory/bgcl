export const ROLE_COLORS: Record<string, string> = {
  SUPERUSER: 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300',
  ADMIN: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  SUPPORTER: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  PROGRAM: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
}

export const ROLE_LABEL: Record<string, string> = {
  SUPERUSER: 'Super User',
  ADMIN: 'Admin',
  PROGRAM: 'Program',
  SUPPORTER: 'Supporter'
}

export const ORDER_TYPE_LABEL: Record<string, string> = {
  TICKET_PURCHASE: 'Ticket Purchase',
  ONE_TIME_DONATION: 'One-Time Donation',
  RECURRING_DONATION: 'Recurring Donation'
}

export const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  FAILED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  REFUNDED: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
}
