'use client'

import { IProgram } from '@/types/entities/program'
import { Hero } from '../home/Hero'
import { HomePrograms } from '../home/HomePrograms'
import FacilitySection from '../home/FacilitySection'
import MissionSection from '../home/MissionSection'

interface HomeClientProps {
  initialPageData?: any
  programs: IProgram[]
}

const HomeClient = ({ initialPageData, programs }: HomeClientProps) => {
  const sections = initialPageData?.sections
  const hero = sections?.hero
  const facility = sections?.facility
  const mission = sections?.mission

  if (!sections) {
    return <div>Loading...</div>
  }

  return (
    <div className="dark:bg-neutral-950 bg-white">
      <Hero hero={hero} />

      {/* Content that scrolls over */}
      <div className="relative z-10">
        <HomePrograms programText={sections?.programs} programs={programs} />

        <MissionSection mission={mission} />

        <FacilitySection facility={facility} />
      </div>
    </div>
  )
}

export default HomeClient
