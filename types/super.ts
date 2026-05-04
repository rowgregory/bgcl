export type OrderStatus = 'CONFIRMED' | 'PENDING' | 'FAILED' | 'REFUNDED'
export type LogLevel = 'INFO' | 'ERROR' | 'WARN'

export interface Order {
  id: string
  createdAt: string
  type: string
  status: OrderStatus
  totalAmount: number
  customerName: string
  customerEmail: string
  paymentIntentId: string
  feesCovered: any
  event: { title: string } | null
  user: { id: string; firstName: string | null; lastName: string | null; email: string } | null
}

export interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
}

export interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
  createdAt: string
  lastLoginAt: string | null
  stripeCustomerId: string | null
  address: any
  paymentMethods: PaymentMethod[]
  orders: { id: string; totalAmount: number; status: string; type: string; createdAt: string }[]
  _count: { orders: number }
}

export interface Log {
  id: string
  level: LogLevel
  message: string
  metadata: any
  createdAt: string
}
