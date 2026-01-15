'use client'

import { PageContentEditor } from '@/app/components/common/PageContentEditor'

const Contact = () => {
  const initialContent = {
    hero: {
      heading: 'Get in Touch',
      subheading: `We'd love to hear from you`
    },
    form: {
      heading: 'Send us a Message',
      description: `Fill out the form below and we'll get back to you as soon as possible.`
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

export default Contact
