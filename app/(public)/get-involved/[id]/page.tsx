import { getJobApplicationById } from '@/lib/actions/job-application/getJobApplicationById'
import JobApplicationClient from './JobApplicationClient'

export default async function JobApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const application = await getJobApplicationById(id)
  return <JobApplicationClient application={application} />
}
