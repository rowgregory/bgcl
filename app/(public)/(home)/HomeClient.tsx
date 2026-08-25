'use client'

import { Hero } from './_components/Hero'
import { HomePrograms } from './_components/HomePrograms'
import { IHero } from '@/types/entities/hero'
import { Program } from '@prisma/client'
import RegistrationModal from '@/components/modals/RegistrationModal'
import { MissionSection } from '@/components/home/MissionSection'
import FacilitySection from '@/components/home/FacilitySection'

interface HomeClientProps {
  pageContent?: any
  programs: Program[]
  hero: IHero
}

const HomeClient = ({ pageContent, programs, hero }: HomeClientProps) => {
  const sections = pageContent?.sections
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
    <>
      <RegistrationModal modal={sections?.modal} />

      <main id="main-content" className="dark:bg-neutral-950 bg-white">
        <Hero hero={hero} />
        <div className="relative z-10">
          <HomePrograms programText={sections?.programs} programs={programs} />
          <MissionSection mission={mission} />
          <FacilitySection facility={facility} />
        </div>
      </main>
    </>
  )
}

export default HomeClient
