'use client'

import { IProgram } from '@/types/entities/program'
import { Hero } from '../home/Hero'
import { HomePrograms } from '../home/HomePrograms'
import { MissionSection } from '../home/MissionSection'
import FacilitySection from '../home/FacilitySection'
import { IHero } from '@/types/entities/hero'

interface HomeClientProps {
  initialPageData?: any
  programs: IProgram[]
  hero: IHero
}

const HomeClient = ({ initialPageData, programs, hero }: HomeClientProps) => {
  const sections = initialPageData?.sections
  const facility = sections?.facility
  const mission = sections?.mission

  if (!sections) {
    return (
      <div role="status" aria-live="polite" aria-label="Page loading">
        <span className="sr-only">Loading page content, please wait...</span>
      </div>
    )
  }

  return (
    <main id="main-content" className="dark:bg-neutral-950 bg-white">
      <Hero hero={hero} />
      <div className="relative z-10">
        <HomePrograms programText={sections?.programs} programs={programs} />
        <MissionSection mission={mission} />
        <FacilitySection facility={facility} />
      </div>
    </main>
  )
}

export default HomeClient
