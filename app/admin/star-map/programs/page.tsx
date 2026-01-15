'use client'

import { PageContentEditor } from '@/app/components/common/PageContentEditor'

const Programs = () => {
  const initialContent = {
    hero: {
      heading: 'Our Programs',
      subheading: 'Discover opportunities for growth and learning',
      description:
        'From academics to athletics, arts to technology, we offer comprehensive programming designed to inspire and empower every young person in our community.'
    },
    cta: {
      heading: 'Ready to Get Involved?',
      subheading: 'Join one of our programs today',
      buttonText: 'Enroll Now',
      buttonLink: '/enroll'
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

export default Programs
