import JobApplicationsClient from '@/components/pages/JobApplicationsClient'
import { getJobApplications } from '@/lib/actions/job-application/getJobApplications'

export default async function ProgramJobApplicationsPage() {
  const jobApplications = await getJobApplications()
  return <JobApplicationsClient jobApplications={jobApplications} />
}
