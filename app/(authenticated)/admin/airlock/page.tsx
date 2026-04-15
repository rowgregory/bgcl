import JobApplicationsClient from '@/app/components/pages/JobApplicationsClient'
import { getJobApplications } from '@/app/lib/actions/getJobApplications'

export default async function AdminJobApplicationsPage() {
  const jobApplications = await getJobApplications()
  return <JobApplicationsClient jobApplications={jobApplications} />
}
