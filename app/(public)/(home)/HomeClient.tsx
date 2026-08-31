'use client'

import { Hero } from './_components/Hero'
import { HomePrograms } from './_components/HomePrograms'
import { IHero } from '@/types/entities/hero'
import { Program } from '@prisma/client'
import RegistrationModal from '@/components/home/RegistrationModal'
import { MissionSection } from '@/components/home/MissionSection'
import FacilitySection from '@/components/home/FacilitySection'
import VolunteerDrawer from '@/components/drawers/VolunteerDrawer'

interface Props {
  pageContent?: any
  programs: Program[]
  hero: IHero
}

export default function HomeClient({ pageContent, programs, hero }: Props) {
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
      <VolunteerDrawer programs={programs} />

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
