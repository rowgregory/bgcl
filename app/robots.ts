import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/supporter/', '/events/']
    },
    sitemap: 'https://bgcl.org/sitemap.xml'
  }
}
