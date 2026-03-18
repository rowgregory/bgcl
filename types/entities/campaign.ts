export interface ICampaign {
  id: string
  name: string
  description: string
  image?: string
  goalAmount: number
  currentAmount: number
  organizerName: string
  startDate: Date
  endDate?: Date
  isActive: boolean
  isListed: boolean
  externalLink?: string
  createdAt: Date
  updatedAt: Date
  _count?: {
    orders: number
  }
}

export interface UpdateCampaignInput {
  id: string
  name: string
  description: string
  image?: string
  goalAmount: number
  currentAmount: number
  organizerName: string
  startDate: Date
  endDate?: Date
  isActive?: boolean
  isListed?: boolean
  externalLink?: string
}
export interface CreateCampaignInput {
  name: string
  description: string
  image?: string
  goalAmount: number
  currentAmount: number
  organizerName: string
  startDate: Date
  endDate?: Date
  isActive: boolean
  isListed: boolean
  externalLink?: string
}
