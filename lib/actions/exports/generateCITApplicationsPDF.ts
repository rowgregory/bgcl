'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireAdmin } from '@/lib/utils/requireAdmin'
import { CITApplication } from '@prisma/client'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const exportCITApplicationsAction = async (): Promise<{
  success: boolean
  data: string | null
  error: string | null
}> => {
  const auth = await requireAdmin({ allowProgram: true })
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const applications = await prisma.cITApplication.findMany({
      orderBy: { createdAt: 'desc' }
    })

    if (applications.length === 0) {
      return { success: false, data: null, error: 'There are no applications to export.' }
    }

    const stats = calculateApplicationStats(applications)
    const pdfBuffer = await createCITApplicationsPDF(applications, stats)

    await createLog('info', 'Exported CIT applications report', {
      userId: auth.user.id,
      count: applications.length
    })

    return { success: true, data: Buffer.from(pdfBuffer).toString('base64'), error: null }
  } catch (error) {
    await createLog('error', 'Failed to export CIT applications', {
      userId: auth.user.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not generate the report.' }
  }
}
interface CITStats {
  total: number
  byStatus: Record<string, number>
  weekStats: Record<string, number>
  healthFormStats: {
    submitted: number
    missing: number
  }
}

const calculateApplicationStats = (applications: CITApplication[]): CITStats => {
  const stats: CITStats = {
    total: applications.length,
    byStatus: {},
    weekStats: {},
    healthFormStats: {
      submitted: 0,
      missing: 0
    }
  }

  applications.forEach((app) => {
    // STATUS
    stats.byStatus[app.status] = (stats.byStatus[app.status] || 0) + 1

    // WEEK AVAILABILITY (count selections per week)
    app.weeksAvailable.forEach((week) => {
      stats.weekStats[week] = (stats.weekStats[week] || 0) + 1
    })
  })

  return stats
}

export const createCITApplicationsPDF = async (applications: CITApplication[], stats: CITStats) => {
  const doc = new jsPDF()

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  const margin = 14
  let y = 20

  const primary: [number, number, number] = [14, 165, 233]
  const text: [number, number, number] = [30, 30, 30]
  const muted: [number, number, number] = [120, 120, 120]

  // =========================
  // PAGE 1 HEADER
  // =========================

  doc.setFillColor(...primary)
  doc.rect(0, 0, pageWidth, 32, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Boys & Girls Club of Lynn', pageWidth / 2, 14, {
    align: 'center'
  })

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('CIT Applications Export Report', pageWidth / 2, 24, {
    align: 'center'
  })

  // =========================
  // METADATA
  // =========================

  doc.setTextColor(...muted)
  doc.setFontSize(9)

  y = 45
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y)

  y += 10
  doc.setTextColor(0, 0, 0)

  // =========================
  // EXECUTIVE SUMMARY (PAGE 1)
  // =========================

  doc.setFontSize(15)
  doc.setFont('helvetica', 'bold')
  doc.text('Applications Summary', margin, y)

  y += 8

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Total Applications', stats.total],
      ['Pending', stats.byStatus['PENDING'] || 0],
      ['Reviewed', stats.byStatus['REVIEWED'] || 0],
      ['Accepted', stats.byStatus['ACCEPTED'] || 0],
      ['Rejected', stats.byStatus['REJECTED'] || 0],
      ['Health Form Submitted', stats.healthFormStats.submitted],
      ['Health Form Missing', stats.healthFormStats.missing]
    ],
    theme: 'plain',
    styles: {
      fontSize: 11,
      cellPadding: 4
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: text, cellWidth: 90 },
      1: { halign: 'right', fontStyle: 'bold' }
    }
  })

  y = (doc as any).lastAutoTable.finalY + 8

  // WEEK AVAILABILITY BREAKDOWN
  const weekEntries = Object.entries(stats.weekStats || {})
  if (weekEntries.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Week Availability', 'Applicants']],
      body: weekEntries,
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 120 },
        1: { halign: 'right' }
      }
    })
  }

  // =========================
  // FULL APPLICATION DETAILS (PAGE 2+)
  // =========================

  applications.forEach((app) => {
    doc.addPage()
    y = 18

    // Applicant header
    doc.setFontSize(14)
    doc.setTextColor(...primary)
    doc.setFont('helvetica', 'bold')
    doc.text(app.name, margin, y)

    y += 6

    doc.setFontSize(10)
    doc.setTextColor(...muted)
    doc.setFont('helvetica', 'normal')
    doc.text(app.personalEmail || app.parentGuardianEmail, margin, y)

    y += 10

    // =========================
    // APPLICANT INFO
    // =========================

    autoTable(doc, {
      startY: y,
      head: [['Applicant Information', '']],
      body: [
        ['Date of Birth', new Date(app.dateOfBirth).toLocaleDateString()],
        ['Age', String(app.age)],
        ['City / Town', app.city],
        ['School', app.school],
        ['Grade', app.grade]
      ],
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: text, cellWidth: 80 }
      }
    })

    y = (doc as any).lastAutoTable.finalY + 6

    // =========================
    // CONTACT & EMERGENCY
    // =========================

    autoTable(doc, {
      startY: y,
      head: [['Contact & Emergency', '']],
      body: [
        ['Cell Phone', app.cellPhone],
        ['Personal Email', app.personalEmail || 'N/A'],
        ['Parent / Guardian Email', app.parentGuardianEmail],
        ['Emergency Contact 1', app.emergencyContact1],
        ['Emergency Contact 2', app.emergencyContact2]
      ],
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: text, cellWidth: 80 }
      }
    })

    y = (doc as any).lastAutoTable.finalY + 6

    // =========================
    // AVAILABILITY
    // =========================

    autoTable(doc, {
      startY: y,
      head: [['Weeks Available']],
      body: app.weeksAvailable.length > 0 ? app.weeksAvailable.map((week) => [week]) : [['No weeks selected']],
      theme: 'grid',
      styles: { fontSize: 9 }
    })

    y = (doc as any).lastAutoTable.finalY + 6

    // =========================
    // APPLICATION QUESTIONS
    // =========================

    autoTable(doc, {
      startY: y,
      head: [['Application Questions', '']],
      body: [
        ['Strengths', app.strengths],
        ['Hopes to Learn', app.hopesToLearn],
        ['Hobbies & Extracurriculars', app.hobbiesExtracurriculars]
      ],
      theme: 'plain',
      styles: { fontSize: 10, cellWidth: 'wrap' },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: text, cellWidth: 50 },
        1: { cellWidth: pageWidth - margin * 2 - 50 }
      }
    })

    y = (doc as any).lastAutoTable.finalY + 6

    // =========================
    // STATUS + TIMESTAMPS
    // =========================

    autoTable(doc, {
      startY: y,
      head: [['Status & System Info', '']],
      body: [
        ['Status', app.status],
        ['Created At', new Date(app.createdAt).toLocaleString()],
        ['Updated At', new Date(app.updatedAt).toLocaleString()]
      ],
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 85 }
      }
    })
  })

  // =========================
  // PAGE NUMBERS
  // =========================

  const pages = doc.getNumberOfPages()

  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)

    doc.setFontSize(9)
    doc.setTextColor(...muted)

    doc.text(`Page ${i} of ${pages}`, pageWidth - margin, pageHeight - 10, { align: 'right' })
  }

  return doc.output('arraybuffer')
}
