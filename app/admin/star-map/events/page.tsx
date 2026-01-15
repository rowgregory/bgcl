'use client'

import { PageContentEditor } from '@/app/components/common/PageContentEditor'

const Events = () => {
  const initialContent = {
    hero: {
      heading: 'Events',
      subheading: 'Join us for fun and community'
    },
    cta: {
      heading: 'Have an Event in Mind?',
      subheading: `We'd love to hear your ideas`,
      buttonText: 'Contact Us',
      buttonLink: '/contact'
    }
  }
  return (
    <PageContentEditor
      initialContent={initialContent}
      onSave={(content: any) => {
        return content
      }}
    />
  )
}

export default Events
