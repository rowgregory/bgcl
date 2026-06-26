import ContactUsClient from '@/app/components/pages/ContactUsClient'
import { getClosings } from '@/app/lib/actions/closing/getClosings'
import { getPageBySlugClient } from '@/app/lib/actions/page/getPageBySlugClient'

export default async function ContactUsPage() {
  const [closings, pageData] = await Promise.all([getClosings(), getPageBySlugClient('contact')])
  return <ContactUsClient closings={closings} pageData={pageData} />
}
