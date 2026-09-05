import { generateDonationReport } from '@/lib/actions/exports/generateDonationsReport'
import { useState } from 'react'

export function ExportReportButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await generateDonationReport({})

      if (!result.success || !result.pdf) {
        setError(result.error ?? 'Export failed')
        return
      }

      const link = document.createElement('a')
      link.href = result.pdf
      link.download = `donation-report-${new Date().toISOString().split('T')[0]}.pdf`
      link.click()
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
        onClick={handleGenerate}
        disabled={loading}
        className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1"
      >
        {loading ? 'Generating…' : 'Export PDF'}
      </button>
    </div>
  )
}
