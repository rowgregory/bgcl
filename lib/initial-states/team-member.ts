import { ITeamMember } from '@/types/entities/team-member'

export const initialTeamMemberFormState: Partial<ITeamMember> = {
  name: '',
  title: '',
  image: '',
  company: '',
  email: '',
  phone: '',
  role: 'admin_staff',
  order: 0,
  year: 2026,
  paragraph1: '',
  paragraph2: '',
  paragraph3: ''
}
