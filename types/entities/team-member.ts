export interface ITeamMember {
  id?: string
  name: string
  role: string
  title?: string
  image?: string
  email?: string
  phone?: string
  bio?: string | null
  order?: number
  year?: number | null
  company?: string
  isSqysh?: boolean
  paragraph1?: string | null
  paragraph2?: string | null
  paragraph3?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export type CreateTeamMemberInput = Omit<ITeamMember, 'id' | 'createdAt' | 'updatedAt'>
