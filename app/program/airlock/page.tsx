import AirlockClient from '@/app/components/pages/AirlockClient'
import { getJobApplications } from '@/app/lib/actions/getJobApplications'

export default async function AirlockPage() {
  const jobApplications = await getJobApplications()
  return <AirlockClient jobApplications={jobApplications} />
}
