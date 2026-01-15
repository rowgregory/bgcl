import { ITeamMember } from '@/types/entities/team-member'

const validateTeamMemberForm = (
  inputs: Partial<ITeamMember> | null,
  setErrors: (newErrors: Record<string, string>) => void
) => {
  const newErrors: Record<string, string> = {}

  if (!inputs?.name || typeof inputs.name !== 'string' || !inputs.name.trim()) {
    newErrors.name = 'Please enter a valid name'
  }

  if (!inputs?.role || typeof inputs.role !== 'string' || !inputs.role.trim()) {
    newErrors.role = 'Please select a valid role'
  } else if (
    ![
      'officer',
      'director',
      'corporator',
      'admin_staff',
      'program_staff',
      'maintenance_staff',
      'honoree',
      'youth'
    ].includes(inputs.role)
  ) {
    newErrors.role = 'Please select a valid role'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

export default validateTeamMemberForm
