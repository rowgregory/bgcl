import ContactUsClient from '@/app/(public)/contact/ContactUsClient'
import { getClosings } from '@/lib/actions/closing/getClosings'
import { getPageBySlugClient } from '@/lib/actions/page/getPageBySlugClient'
import { getPrograms } from '@/lib/actions/program/getPrograms'
import { Suspense } from 'react'

export default async function ContactUsPage() {
  const [closings, pageData, programsResult] = await Promise.all([
    getClosings(),
    getPageBySlugClient('contact'),
    getPrograms()
  ])
  return (
    <Suspense fallback={null}>
      <ContactUsClient closings={closings.data} pageData={pageData} programs={programsResult.data} />
    </Suspense>
  )
}
