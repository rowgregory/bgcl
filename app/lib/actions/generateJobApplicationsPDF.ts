'use server'

import prisma from '@/prisma/client'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const exportApplicationsAction = async () => {
  const applications = await prisma.jobApplication.findMany({
    include: {
      references: true
    }
  })

  const stats = calculateApplicationStats(applications)

  const pdfBuffer = await createApplicationsPDF(applications, stats)

  return pdfBuffer
}
const calculateApplicationStats = (applications: any[]) => {
  const stats = {
    total: applications.length,
    byStatus: {} as Record<string, number>,
    byEmploymentType: {} as Record<string, number>,
    licenseStats: {
      hasLicense: 0,
      noLicense: 0
    }
  }

  applications.forEach((app) => {
    // STATUS
    stats.byStatus[app.status] = (stats.byStatus[app.status] || 0) + 1

    // EMPLOYMENT TYPE
    stats.byEmploymentType[app.employmentType] = (stats.byEmploymentType[app.employmentType] || 0) + 1

    // LICENSE
    if (app.hasValidDriverLicense) {
      stats.licenseStats.hasLicense++
    } else {
      stats.licenseStats.noLicense++
    }
  })

  return stats
}

export const createApplicationsPDF = async (applications: any[], stats: any) => {
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
  doc.text('Job Applications Export Report', pageWidth / 2, 24, {
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
      ['In Review', stats.byStatus['REVIEW'] || 0],
      ['Approved', stats.byStatus['APPROVED'] || 0],
      ['Rejected', stats.byStatus['REJECTED'] || 0]
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

  autoTable(doc, {
    startY: y,
    head: [['Employment Type', 'Count']],
    body: Object.entries(stats.byEmploymentType || {}),
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 90 },
      1: { halign: 'right' }
    }
  })

  // =========================
  // FULL APPLICATION DETAILS (PAGE 2+)
  // =========================

  applications.forEach((app: any, index: number) => {
    doc.addPage()
    y = 18

    // Applicant header
    doc.setFontSize(14)
    doc.setTextColor(...primary)
    doc.setFont('helvetica', 'bold')
    doc.text(app.applicantName, margin, y)

    y += 6

    doc.setFontSize(10)
    doc.setTextColor(...muted)
    doc.setFont('helvetica', 'normal')
    doc.text(app.email, margin, y)

    y += 10

    // =========================
    // PERSONAL INFO
    // =========================

    autoTable(doc, {
      startY: y,
      head: [['Personal Information', '']],
      body: [
        ['Employment Type', app.employmentType],
        ['Hours Available', app.hoursAvailable],
        ['Languages', app.languages],
        ['Youth Org Employment', app.youthOrgEmployment || 'N/A'],
        ['Education', app.education || 'N/A'],
        ['Extracurriculars Skills', app.extracurricularsSkills || 'N/A']
      ],
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: text, cellWidth: 80 }
      }
    })

    y = (doc as any).lastAutoTable.finalY + 6

    // =========================
    // DRIVING INFO
    // =========================

    autoTable(doc, {
      startY: y,
      head: [['Driving Information', '']],
      body: [
        ['Has Valid License', app.hasValidDriverLicense ? 'Yes' : 'No'],
        ['License Number', app.licenseNumber || 'N/A'],
        ['License Expiration', app.licenseExpiration ? new Date(app.licenseExpiration).toLocaleDateString() : 'N/A'],
        ['No License Reason', app.noLicenseReason || 'N/A'],
        ['License Suspended', app.licenseSuspended ? 'Yes' : 'No'],
        ['Suspension Explanation', app.suspensionExplanation || 'N/A'],
        ['Traffic Violations', app.trafficViolations || 'N/A']
      ],
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: text, cellWidth: 80 }
      }
    })

    y = (doc as any).lastAutoTable.finalY + 6

    // =========================
    // REFERENCES
    // =========================

    const refs = app.references || []

    autoTable(doc, {
      startY: y,
      head: [['References']],
      body:
        refs.length > 0
          ? refs.map((r: any) => [
              `${r.name} | ${r.positionAndCompany} | ${r.workRelationship} | ${r.phone} | ${r.email}`
            ])
          : [['No references provided']],
      theme: 'grid',
      styles: { fontSize: 9 }
    })

    y = (doc as any).lastAutoTable.finalY + 6

    // =========================
    // RESUME
    // =========================

    doc.setFontSize(11)
    doc.setTextColor(...primary)
    doc.setFont('helvetica', 'bold')
    doc.text('Resume', margin, y)

    y += 6

    if (app.resumeUrl) {
      doc.setFontSize(10)
      doc.setTextColor(0, 102, 204)

      doc.textWithLink('Open Resume', margin, y, {
        url: app.resumeUrl
      })
    } else {
      doc.setTextColor(...muted)
      doc.text('No resume uploaded', margin, y)
    }

    y += 10

    // =========================
    // CERTIFICATION
    // =========================

    autoTable(doc, {
      startY: y,
      head: [['Certification', '']],
      body: [
        ['Agree To Terms', app.agreeToTerms ? 'Yes' : 'No'],
        ['Certify Information', app.certifyInformation ? 'Yes' : 'No'],
        ['Authorize Background', app.authorizeBackground ? 'Yes' : 'No'],
        ['Understand Active Status', app.understandActiveStatus ? 'Yes' : 'No'],
        ['Signature', app.signature || 'N/A'],
        ['Signed At', app.createdAt ? new Date(app.createdAt).toLocaleString() : 'N/A']
      ],
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 85 }
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
        ['Submission Status', app.submissionStatus],
        ['Created At', new Date(app.createdAt).toLocaleString()],
        ['Updated At', new Date(app.updatedAt).toLocaleString()],
        ['Resume Uploaded', app.resumeUploadedAt || 'N/A']
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
