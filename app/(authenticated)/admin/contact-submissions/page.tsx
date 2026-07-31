import ContactSubmissionsClient from '@/app/(authenticated)/admin/contact-submissions/ContactSubmissionsClient'
import { getContactSubmissions } from '@/lib/actions/contact-submission/getContactSubmissions'

export default async function ContactSubmissionsPage() {
  const contactSubmissions = await getContactSubmissions()
  return <ContactSubmissionsClient contactSubmissions={contactSubmissions} />
}
