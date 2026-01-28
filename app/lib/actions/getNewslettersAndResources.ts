import prisma from '@/prisma/client'
import { createLog } from './createLog'

export interface NewsletterAndResourcesData {
  newsletters: Array<{
    id: string
    order: number
    month: string
    year: number
    pdfUrl: string
    createdAt: Date
    updatedAt: Date
  }>
  resources: Array<{
    id: string
    order: number
    title: string
    url: string
    createdAt: Date
    updatedAt: Date
  }>
}

export const getNewslettersAndResources = async (): Promise<NewsletterAndResourcesData> => {
  try {
    const [newsletters, resources] = await Promise.all([
      prisma.newsletter.findMany({
        orderBy: [{ order: 'desc' }]
      }),
      prisma.resource.findMany({
        orderBy: [{ order: 'asc' }]
      })
    ])

    return {
      newsletters,
      resources
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch newsletters and resources', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
