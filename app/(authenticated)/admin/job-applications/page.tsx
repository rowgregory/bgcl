import { getJobApplications } from '@/lib/actions/job-application/getJobApplications'
import JobApplicationsClient from './JobApplicationsClient'

export default async function JobApplicationsPage() {
  const result = await getJobApplications()
  return <JobApplicationsClient jobApplications={result.data} />
}
