import { z } from 'zod'
import { PositionType, EmploymentType } from '@prisma/client'

const phoneRegex = /^[\d\s\-()+]{10,}$/

export const referenceSchema = z.object({
  name: z.string().trim().min(1, { error: 'Name is required' }),
  positionAndCompany: z.string().trim().min(1, { error: 'Position & company is required' }),
  workRelationship: z.string().trim().min(1, { error: 'Work relationship is required' }),
  phone: z
    .string()
    .trim()
    .min(1, { error: 'Phone number is required' })
    .regex(phoneRegex, { error: 'Invalid phone number' }),
  email: z
    .string()
    .trim()
    .min(1, { error: 'Email is required' })
    .pipe(z.email({ error: 'Invalid email format' }))
})

// ── Per-step schemas (used to validate as the user advances) ──────────────────

export const step1Schema = z.object({
  positionTypes: z.array(z.enum(PositionType)).min(1, { error: 'At least one position is required' }),
  youthOrgEmployment: z.string().trim().min(1, { error: 'Please indicate your youth organization employment history' }),
  education: z.string().trim().min(1, { error: 'Education is required' }),
  extracurricularsSkills: z.string().trim().optional()
})

export const step2Schema = z.object({
  applicantName: z.string().trim().min(1, { error: 'Name is required' }),
  email: z
    .string()
    .trim()
    .min(1, { error: 'Email is required' })
    .pipe(z.email({ error: 'Invalid email format' })),
  employmentType: z.enum(EmploymentType, { error: 'Employment type is required' }),
  hoursAvailable: z.string().trim().min(1, { error: 'Hours available is required' }),
  languages: z.array(z.string()).transform((arr) => arr.join(', '))
})

export const step3Schema = z.object({
  references: z.array(referenceSchema).length(3, { error: '3 references are required' })
})

export const step4Schema = z
  .object({
    hasValidDriverLicense: z.boolean({ error: "Please indicate if you have a valid driver's license" }),
    licenseNumber: z.string().trim().optional(),
    licenseExpiration: z.coerce.date().optional(),
    noLicenseReason: z.string().trim().optional(),
    licenseSuspended: z.boolean().default(false),
    suspensionExplanation: z.string().trim().optional(),
    trafficViolations: z.string().trim().optional()
  })
  .superRefine((data, ctx) => {
    if (data.hasValidDriverLicense) {
      if (!data.licenseNumber?.trim()) {
        ctx.addIssue({ code: 'custom', path: ['licenseNumber'], message: 'License number is required' })
      }
      if (!data.licenseExpiration) {
        ctx.addIssue({
          code: 'custom',
          path: ['licenseExpiration'],
          message: 'License expiration date is required'
        })
      } else if (data.licenseExpiration < new Date()) {
        ctx.addIssue({ code: 'custom', path: ['licenseExpiration'], message: 'License is expired' })
      }
    } else {
      if (!data.noLicenseReason?.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['noLicenseReason'],
          message: "Please explain why you don't have a license"
        })
      }
    }

    if (data.licenseSuspended && !data.suspensionExplanation?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['suspensionExplanation'],
        message: 'Please explain the suspension'
      })
    }
  })

export const step5Schema = z.object({
  resumeUrl: z.string().min(1, { error: 'Resume is required' }),
  resumeFileName: z.string().optional(),
  resumeFileSize: z.number().optional(),
  resumeUploadedAt: z.coerce.date().optional()
})

export const step6Schema = z.object({
  agreeToTerms: z.literal(true, { error: 'You must agree to the terms' }),
  certifyInformation: z.literal(true, { error: 'You must certify the information is accurate' }),
  authorizeBackground: z.literal(true, { error: 'You must authorize the background check' }),
  understandActiveStatus: z.literal(true, { error: 'You must acknowledge the active status requirement' }),
  signature: z.string().trim().min(1, { error: 'Signature is required' })
})

// ── The whole application ─────────────────────────────────────────────────────

export const jobApplicationSchema = step1Schema
  .extend(step2Schema.shape)
  .extend(step3Schema.shape)
  .extend(step5Schema.shape)
  .extend(step6Schema.shape)
  .extend({
    hasValidDriverLicense: z.boolean(),
    licenseNumber: z.string().trim().optional(),
    licenseExpiration: z.coerce.date().optional(),
    noLicenseReason: z.string().trim().optional(),
    licenseSuspended: z.boolean().default(false),
    suspensionExplanation: z.string().trim().optional(),
    trafficViolations: z.string().trim().optional()
  })

export type JobApplicationFormInput = z.input<typeof jobApplicationSchema>
export type JobApplicationFormValues = z.output<typeof jobApplicationSchema>

/** Step index → the fields RHF should validate before advancing. */
export const STEP_FIELDS = {
  1: ['positionTypes', 'youthOrgEmployment', 'education'],
  2: ['applicantName', 'email', 'employmentType', 'hoursAvailable'],
  3: ['references'],
  4: ['hasValidDriverLicense', 'licenseNumber', 'licenseExpiration', 'noLicenseReason', 'suspensionExplanation'],
  5: ['resumeUrl'],
  6: ['agreeToTerms', 'certifyInformation', 'authorizeBackground', 'understandActiveStatus', 'signature']
} as const satisfies Record<number, readonly (keyof JobApplicationFormValues)[]>
