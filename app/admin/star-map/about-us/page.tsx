'use client'

import { PageContentEditor } from '@/app/components/common/PageContentEditor'

const AboutUsPage = () => {
  const initialContent = {
    mission: {
      heading: 'Our Mission',
      paragraph1:
        'Since 1985, the Boys & Girls Club of Lynn has been dedicated to enabling all young people, especially those who need us most, to reach their full potential as productive, caring, and responsible citizens.',
      paragraph2:
        'We provide a safe, supportive environment where youth can develop critical skills, build meaningful relationships, and discover their passions through engaging programs and mentorship.',
      paragraph3:
        'Our commitment extends beyond programs—we invest in the whole child, addressing their academic, social, emotional, and physical development to create lasting positive change.'
    },
    whyChooseUs: {
      heading: 'Why Choose Us',
      subheading: 'What sets the Boys & Girls Club of Lynn apart',
      reason1Title: 'Expert Staff',
      reason1Description:
        'Our trained professionals are passionate about youth development and create safe, inclusive spaces for all.',
      reason2Title: 'Proven Results',
      reason2Description:
        'Years of data show our programs significantly improve academic performance, attendance, and social skills.',
      reason3Title: 'Community Focused',
      reason3Description: `We deeply understand Lynn's unique needs and tailor programs to serve our most vulnerable youth.`,
      reason4Title: 'Affordable Access',
      reason4Description:
        'We believe every child deserves opportunity. Our sliding scale fees ensure no child is turned away.'
    },
    recognition: {
      heading: 'Boys & Girls Clubs of America is Highly Respected',
      description:
        'Our national organization has been accredited and recognized for decades as a leader in youth development, with a network of clubs serving millions of young people across the country.',
      subheading: 'Part of a National Movement'
    },
    covid: {
      heading: 'Our Response to COVID-19',
      subheading: 'Adapting to serve our community',
      description:
        'During unprecedented times, we pivoted our services to ensure youth stayed connected, supported, and learning despite challenges.',
      bullet1: 'Launched virtual programming to keep youth engaged during lockdowns',
      bullet2: 'Provided free meals and essential resources to families in need',
      bullet3: 'Offered mental health support and counseling services',
      bullet4: 'Safely reopened facilities with enhanced health and safety protocols'
    },
    history: {
      heading: 'Our History',
      paragraph1:
        'The Boys & Girls Club of Lynn was founded in 1985 with a simple vision: to provide a safe haven for the youth of Lynn. Starting small with a handful of staff and volunteers, we grew into the comprehensive youth development organization we are today.',
      paragraph2: `Over nearly four decades, we've served thousands of young people, helping them graduate high school, pursue higher education, and become productive members of their communities. Our legacy is written in the success stories of the youth we serve.`
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

export default AboutUsPage
