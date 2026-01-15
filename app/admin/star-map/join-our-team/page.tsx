'use client'

import { PageContentEditor } from '@/app/components/common/PageContentEditor'

const JoinOurTeam = () => {
  const initialContent = {
    hero: {
      heading: 'Join Our Team',
      subheading: 'Help us make a difference in Lynn'
    },
    content: {
      heading: 'Work With Us',
      paragraph1: `Do you have a passion for working with children or teenagers? Do you want to make a positive impact in your community? If so, join our team at Boys & Girls Clubs of Lynn and make a difference! At the Boys & Girls Club of Lynn, we believe that hiring, developing and retaining skilled, passionate staff members is where it all begins. That’s because our work is anchored in our staff’s ability to bring our mission to life by enabling young people to realize their full potential. Our Club continuously looks for talented individuals interested in working with youth to join our team.`,
      paragraph2: `The Boys & Girls Clubs of Lynn is committed to a policy of equal employment opportunity and does not discriminate against employees or applicants for employment on the basis of any characteristic that is protected by law.`,
      buttonText: 'Apply Here',
      buttonLink: '/careers'
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

export default JoinOurTeam
