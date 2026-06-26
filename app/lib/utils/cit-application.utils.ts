import { CITFormData } from '@/types/entities/cit-application.types'
import { isValidEmail } from './regex'

export function validateCITStep(step: number, data: CITFormData): Record<string, string> {
  const errors: Record<string, string> = {}

  if (step === 1) {
    if (!data.name.trim()) errors.name = 'Required'
    if (!data.dateOfBirth) errors.dateOfBirth = 'Required'
    if (!data.age.trim()) errors.age = 'Required'
    else if (Number.isNaN(Number(data.age))) errors.age = 'Must be a number'
    if (!data.city.trim()) errors.city = 'Required'
    if (!data.school.trim()) errors.school = 'Required'
    if (!data.grade.trim()) errors.grade = 'Required'
  }

  if (step === 2) {
    if (!data.cellPhone.trim()) errors.cellPhone = 'Required'
    if (!data.parentGuardianEmail.trim()) errors.parentGuardianEmail = 'Required'
    else if (!isValidEmail(data.parentGuardianEmail)) errors.parentGuardianEmail = 'Enter a valid email'
    if (data.personalEmail && !isValidEmail(data.personalEmail)) errors.personalEmail = 'Enter a valid email'
    if (!data.emergencyContact1.trim()) errors.emergencyContact1 = 'Required'
    if (!data.emergencyContact2.trim()) errors.emergencyContact2 = 'Required'
  }

  if (step === 3) {
    if (data.weeksAvailable.length === 0) errors.weeksAvailable = 'Select at least one week'
  }

  if (step === 4) {
    if (!data.strengths.trim()) errors.strengths = 'Required'
    if (!data.hopesToLearn.trim()) errors.hopesToLearn = 'Required'
    if (!data.hobbiesExtracurriculars.trim()) errors.hobbiesExtracurriculars = 'Required'
  }

  return errors
}
