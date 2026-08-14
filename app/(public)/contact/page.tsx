import ContactUsClient from '@/app/(public)/contact/ContactUsClient'
import { getClosings } from '@/lib/actions/closing/getClosings'
import { getPageBySlugClient } from '@/lib/actions/page/getPageBySlugClient'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function ContactUsPage() {
  const [closings, pageData] = await Promise.all([getClosings(), getPageBySlugClient('contact')])
  return (
    <Suspense fallback={null}>
      <ContactUsClient closings={closings} pageData={pageData} />
    </Suspense>
  )
}
