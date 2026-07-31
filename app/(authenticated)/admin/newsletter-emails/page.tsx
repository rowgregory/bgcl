import NewsletterEmailsClient from '@/app/(authenticated)/admin/newsletter-emails/NewsletterEmailsClient'
import { getSubscribers } from '@/lib/actions/subscriber/getSubscribers'

export default async function NewsletterEmailsPage() {
  const subscribers = await getSubscribers()
  return <NewsletterEmailsClient subscribers={subscribers} />
}
