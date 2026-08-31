import { exportCITApplicationsAction } from '@/lib/actions/exports/generateCITApplicationsPDF'
import { useState } from 'react'

export function ExportCITButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleExport = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await exportCITApplicationsAction()

      if (!result?.data) {
        setError('Export failed')
        return
      }

      const blob = new Blob([result.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const date = new Date().toLocaleDateString('en-CA')

      const a = document.createElement('a')
      a.href = url
      a.download = `BGCLynn_CITApplications_Report_${date}.pdf`
      a.click()

      window.URL.revokeObjectURL(url)
    } catch {
      setError('Export failed')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
      <button
        type="button"
        onClick={handleExport}
        disabled={loading}
        className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1"
      >
        {loading ? 'Exporting…' : 'Export PDF'}
      </button>
    </div>
  )
}
