import { getCITApplications } from '@/app/lib/actions/cit-application/getCITApplications'
import { CITApplicationsClient } from './CITApplicationsClient'

export const metadata = {
  title: 'CIT Applications',
  description: 'Review and manage Counselor-in-Training applications'
}

export default async function CITApplicationsPage() {
  const res = await getCITApplications()

  if (!res.success) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="dark:bg-neutral-900 bg-white border dark:border-neutral-800 border-neutral-200 p-6">
          <h1 className="text-xl font-bold dark:text-white text-neutral-900 mb-2">CIT Applications</h1>
          <p className="text-sm dark:text-red-400 text-red-600">{(res as { success: false; error: string }).error}</p>
        </div>
      </div>
    )
  }

  return <CITApplicationsClient applications={res.data} />
}
