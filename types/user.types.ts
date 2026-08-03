import type { User, Address, Order, PaymentMethod, Role, StaffStatus } from '@prisma/client'

export type { User, Role, StaffStatus }

export type UserWithAddress = User & {
  address: Address | null
}

export type UserWithOrders = User & {
  orders: Order[]
}

export type UserWithPaymentMethods = User & {
  paymentMethods: PaymentMethod[]
}
