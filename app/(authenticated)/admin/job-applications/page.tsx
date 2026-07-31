import { getJobApplications } from '@/lib/actions/job-application/getJobApplications'
import AdminJobApplicationsClient from './AdminJobApplicationsClient'

export default async function AdminJobApplicationsPage() {
  const jobApplications = await getJobApplications()
  return <AdminJobApplicationsClient jobApplications={jobApplications} />
}
