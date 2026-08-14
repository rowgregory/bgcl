import { z } from 'zod'

/** What the user actually types in the modal. Seeds `useForm`. */
export const paymentMethodFormSchema = z.object({
  cardholderName: z.string().trim().min(1, { error: 'Please enter the cardholder name' }),
  isDefault: z.boolean().default(false)
})

export type PaymentMethodFormInput = z.input<typeof paymentMethodFormSchema>
export type PaymentMethodFormValues = z.output<typeof paymentMethodFormSchema>

export const EMPTY_PAYMENT_METHOD: PaymentMethodFormInput = {
  cardholderName: '',
  isDefault: false
}

/** What the client sends after Stripe Elements returns a payment method. */
export const savePaymentMethodSchema = z.object({
  stripePaymentId: z.string().trim().min(1, { error: 'Missing Stripe payment method id' }),
  isDefault: z.boolean().default(false)
})

export type SavePaymentMethodInput = z.input<typeof savePaymentMethodSchema>
export type SavePaymentMethodValues = z.output<typeof savePaymentMethodSchema>

export const EMPTY_SAVE_PAYMENT_METHOD: SavePaymentMethodInput = {
  stripePaymentId: '',
  isDefault: false
}

/** The card fields, retrieved from Stripe server-side rather than from the client. */
export const paymentMethodCardSchema = z.object({
  cardholderName: z.string().trim().nullish(),
  cardBrand: z.string().trim().min(1),
  cardLast4: z.string().trim().length(4),
  cardExpMonth: z.coerce.number().int().gte(1).lte(12),
  cardExpYear: z.coerce.number().int().gte(new Date().getFullYear())
})

export type PaymentMethodCardValues = z.output<typeof paymentMethodCardSchema>

// `cardholderName` is the only nullable column. Stripe may return no billing name,
// and an empty string should clear it rather than store ''.
export const PAYMENT_METHOD_NULLABLE_FIELDS = ['cardholderName'] as const
