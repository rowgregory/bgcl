'use client'

import { IProgram } from '@/types/entities/program'
import { Hero } from '../home/Hero'
import { HomePrograms } from '../home/HomePrograms'
import FacilitySection from '../home/FacilitySection'

interface HomeClientProps {
  initialPageData?: any
  programs: IProgram[]
}

const HomeClient = ({ initialPageData, programs }: HomeClientProps) => {
  const sections = initialPageData?.sections
  const hero = sections?.hero
  const facility = sections?.facility

  if (!sections) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Hero hero={hero} />

      {/* Content that scrolls over */}
      <div className="relative z-10">
        <HomePrograms
          subheading={sections?.programs?.subheading}
          heading1={sections?.programs?.heading1}
          heading2={sections?.programs?.heading2}
          items={programs}
        />

        <FacilitySection facility={facility} />
      </div>
    </>
  )
}

export default HomeClient
