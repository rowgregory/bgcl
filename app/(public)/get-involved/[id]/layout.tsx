import { getJobApplicationById } from '@/app/lib/actions/getJobApplicationById'
import JobApplicationPage from './page'

export default async function JobApplicationLayout({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const application = await getJobApplicationById(id)
  return <JobApplicationPage application={application} />
}
