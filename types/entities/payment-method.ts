export interface IPaymentMethod {
  cardholderName: string
  id: string
  stripePaymentId: string

  cardBrand: string
  cardLast4: string
  cardExpMonth: number
  cardExpYear: number

  isDefault: boolean

  userId: string

  createdAt: Date
  updatedAt: Date
}
