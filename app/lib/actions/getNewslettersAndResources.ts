'use server'

import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'

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

export const getNewslettersAndResources = unstable_cache(
  async (): Promise<NewsletterAndResourcesData> => {
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
      await prisma.log.create({
        data: {
          level: 'error',
          message: 'Failed to fetch newsletters and resources',
          metadata: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      })

      return {
        newsletters: [],
        resources: []
      }
    }
  },
  ['getNewslettersAndResources'],
  { tags: ['Newsletter', 'Resource'] }
)
