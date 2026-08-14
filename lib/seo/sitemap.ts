import prisma from '@/prisma/client'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bgcl.org'

  // Fetch dynamic data from database
  const programs = await prisma.program.findMany({
    select: { id: true, updatedAt: true }
  })

  const events = await prisma.event.findMany({
    select: { id: true, updatedAt: true }
  })

  const campaigns = await prisma.campaign.findMany({
    select: { id: true, updatedAt: true },
    where: { isActive: true }
  })

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/programs`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/campaigns`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/award-winners`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/latest-news`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/get-involved`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9
    }
  ]

  // Dynamic program pages
  const programPages = programs.map((program) => ({
    url: `${baseUrl}/programs/${program.id}`,
    lastModified: program.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }))

  // Dynamic event pages
  const eventPages = events.map((event) => ({
    url: `${baseUrl}/events/${event.id}`,
    lastModified: event.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6
  }))

  // Dynamic blog/post pages
  const campaignPages = campaigns.map((campaign) => ({
    url: `${baseUrl}/campaigns/${campaign.id}`,
    lastModified: campaign.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.5
  }))

  return [...staticPages, ...programPages, ...eventPages, ...campaignPages]
}
