import { z } from 'zod'

export const addressSchema = z.object({
  addressLine1: z.string().trim().min(1, { error: 'Please enter a street address' }),
  addressLine2: z.string().trim().nullish(),
  city: z.string().trim().min(1, { error: 'Please enter a city' }),
  state: z.string().trim().min(1, { error: 'Please select a state' }),
  zipPostalCode: z
    .string()
    .trim()
    .min(1, { error: 'Please enter a ZIP code' })
    .regex(/^\d{5}(-\d{4})?$/, { error: 'Enter a valid ZIP code' }),
  country: z.string().trim().default('US')
})

export type AddressFormInput = z.input<typeof addressSchema>
export type AddressFormValues = z.output<typeof addressSchema>

export const EMPTY_ADDRESS: AddressFormInput = {
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipPostalCode: '',
  country: 'US'
}
