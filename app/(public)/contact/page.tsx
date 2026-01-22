import ContactUsClient from '@/app/components/pages/ContactUsClient'
import { getClosings } from '@/app/lib/actions/getClosings'

export default async function ContactUsPage() {
  const closings = await getClosings()
  return <ContactUsClient closings={closings} />
}
