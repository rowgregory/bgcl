'use client'

import { IProgram } from '@/types/entities/program'
import { Hero } from '../home/Hero'
import { HomePrograms } from '../home/HomePrograms'
import { HistorySection } from '../home/HistorySection'
import MissionSection from '../home/MissionSection'
import YouthOfTheYearSection from '../home/YouthOfTheYearSection'
import { ITeamMember } from '@/types/entities/team-member'

interface HomeClientProps {
  initialPageData?: any
  programs: IProgram[]
  youth: ITeamMember
}

const HomeClient = ({ initialPageData, programs, youth }: HomeClientProps) => {
  const pageContent = initialPageData?.content

  if (!pageContent) {
    return <div>Loading...</div>
  }

  return (
    <div className="text-white">
      <Hero initialPageData={pageContent} />

      {/* Content that scrolls over */}
      <div className="relative z-10">
        <HomePrograms
          subheading={pageContent.programs.subheading}
          heading1={pageContent.programs.heading1}
          heading2={pageContent.programs.heading2}
          items={programs}
        />

        <MissionSection pageContent={pageContent} />

        <HistorySection pageContent={pageContent} />

        <YouthOfTheYearSection youth={youth} />
      </div>
    </div>
  )
}

export default HomeClient
