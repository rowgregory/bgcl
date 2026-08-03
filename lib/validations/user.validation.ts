import { z } from 'zod'
import { Role } from '@prisma/client'

const phoneRegex = /^[\d\s\-()]+$/

export const userSchema = z.object({
  email: z.email({ error: 'Please enter a valid email' }),
  firstName: z.string().trim().min(1, { error: 'Please enter a valid first name' }),
  lastName: z.string().trim().min(1, { error: 'Please enter a valid last name' }),
  role: z.enum(Role, { error: 'Please select a valid role' }),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, { error: 'Please enter a valid phone number' })
    .or(z.literal(''))
    .nullish(),
  position: z.string().trim().nullish(),
  department: z.string().trim().nullish()
})

export type UserFormInput = z.input<typeof userSchema>
export type UserFormValues = z.output<typeof userSchema>

export const EMPTY_USER: UserFormInput = {
  email: '',
  firstName: '',
  lastName: '',
  role: 'SUPPORTER',
  phone: ''
}
