import ContactUsClient from '@/app/components/pages/ContactUsClient'
import { getClosings } from '@/app/lib/actions/getClosings'
import { getPageBySlugClient } from '@/app/lib/actions/getPageBySlugClient'

export default async function ContactUsPage() {
  const [closings, pageData] = await Promise.all([getClosings(), getPageBySlugClient('contact')])
  return <ContactUsClient closings={closings} pageData={pageData} />
}
