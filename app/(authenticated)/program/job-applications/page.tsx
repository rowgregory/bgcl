import JobApplicationsClient from '@/app/(authenticated)/admin/job-applications/AdminJobApplicationsClient'
import { getJobApplications } from '@/lib/actions/job-application/getJobApplications'

export default async function ProgramJobApplicationsPage() {
  const jobApplications = await getJobApplications()
  return <JobApplicationsClient jobApplications={jobApplications} />
}
