export interface ITeamMember {
  id?: string
  name: string
  title?: string
  image?: string
  email?: string
  phone?: string
  bio?: string | null
  role: 'officer' | 'director' | 'corporator' | 'admin_staff' | 'program_staff' | 'honoree' | 'youth'
  order?: number
  year?: number | null
  company?: string
  paragraph1?: string | null
  paragraph2?: string | null
  paragraph3?: string | null
  createdAt?: Date
  updatedAt?: Date
}
