import ContactUsClient from '@/components/pages/ContactUsClient'
import { getClosings } from '@/lib/actions/closing/getClosings'
import { getPageBySlugClient } from '@/lib/actions/page/getPageBySlugClient'

export default async function ContactUsPage() {
  const [closings, pageData] = await Promise.all([getClosings(), getPageBySlugClient('contact')])
  return <ContactUsClient closings={closings} pageData={pageData} />
}
