'use server'

import prisma from '@/prisma/client'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Add this interface extension
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

interface ReportFilters {
  startDate?: Date
  endDate?: Date
  campaignId?: string
  status?: string
  type?: 'ONE_TIME_DONATION' | 'RECURRING_DONATION'
}

interface DonationStats {
  totalRevenue: number
  totalDonations: number
  totalFeesCovered: number
  averageDonation: number
  oneTimeDonations: {
    count: number
    total: number
  }
  recurringDonations: {
    count: number
    total: number
    activeSubscriptions: number
  }
  byCampaign: {
    name: string
    count: number
    total: number
  }[]
  byMonth: {
    month: string
    count: number
    total: number
  }[]
}

export async function generateDonationReport(filters: ReportFilters = {}) {
  try {
    const { startDate, endDate, campaignId, status, type } = filters

    // Build query
    const where: any = {
      type: type || { in: ['ONE_TIME_DONATION', 'RECURRING_DONATION'] },
      status: status || { in: ['CONFIRMED', 'PENDING'] }
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    if (campaignId) {
      where.campaignId = campaignId
    }

    // Fetch orders
    const orders = await prisma.order.findMany({
      where,
      include: {
        campaign: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate statistics
    const stats = calculateStats(orders)

    // Generate PDF
    const pdf = createPDF(orders, stats, filters)

    // Return base64 PDF
    return {
      success: true,
      pdf: pdf.output('dataurlstring')
    }
  } catch (error) {
    console.error('Error generating donation report:', error)
    return {
      success: false,
      error: 'Failed to generate report'
    }
  }
}

function calculateStats(orders: any[]): DonationStats {
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalFeesCovered = orders.reduce((sum, order) => sum + order.feesCovered / 100, 0)
  const totalDonations = orders.length

  const oneTime = orders.filter((o) => o.type === 'ONE_TIME_DONATION')
  const recurring = orders.filter((o) => o.type === 'RECURRING_DONATION')
  const activeSubscriptions = orders.filter(
    (o) => o.type === 'RECURRING_DONATION' && o.status === 'CONFIRMED' && o.isRecurring
  ).length

  // Group by campaign
  const campaignMap = new Map<string, { count: number; total: number }>()
  orders.forEach((order) => {
    const campaignName = order.campaign?.name || 'Area of Greatest Need'
    const existing = campaignMap.get(campaignName) || { count: 0, total: 0 }
    campaignMap.set(campaignName, {
      count: existing.count + 1,
      total: existing.total + order.totalAmount
    })
  })

  // Group by month
  const monthMap = new Map<string, { count: number; total: number }>()
  orders.forEach((order) => {
    const month = new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
    const existing = monthMap.get(month) || { count: 0, total: 0 }
    monthMap.set(month, {
      count: existing.count + 1,
      total: existing.total + order.totalAmount
    })
  })

  return {
    totalRevenue,
    totalDonations,
    totalFeesCovered,
    averageDonation: totalDonations > 0 ? totalRevenue / totalDonations : 0,
    oneTimeDonations: {
      count: oneTime.length,
      total: oneTime.reduce((sum, o) => sum + o.totalAmount, 0)
    },
    recurringDonations: {
      count: recurring.length,
      total: recurring.reduce((sum, o) => sum + o.totalAmount, 0),
      activeSubscriptions
    },
    byCampaign: Array.from(campaignMap.entries()).map(([name, data]) => ({
      name,
      ...data
    })),
    byMonth: Array.from(monthMap.entries()).map(([month, data]) => ({
      month,
      ...data
    }))
  }
}

function createPDF(orders: any[], stats: DonationStats, filters: ReportFilters): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 20

  // Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Boys & Girls Club of Lynn Donation Financial Report', pageWidth / 2, yPos, { align: 'center' })

  yPos += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' })

  if (filters.startDate || filters.endDate) {
    yPos += 5
    const dateRange = `Period: ${filters.startDate?.toLocaleDateString() || 'All'} - ${filters.endDate?.toLocaleDateString() || 'Present'}`
    doc.text(dateRange, pageWidth / 2, yPos, { align: 'center' })
  }

  yPos += 15

  // Summary Statistics
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Summary', 14, yPos)
  yPos += 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  const summaryData = [
    ['Total Revenue', `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
    ['Total Donations', stats.totalDonations.toString()],
    ['Average Donation', `$${stats.averageDonation.toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
    ['Fees Covered by Donors', `$${stats.totalFeesCovered.toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
    ['', ''],
    [
      'One-Time Donations',
      `${stats.oneTimeDonations.count} ($${stats.oneTimeDonations.total.toLocaleString('en-US', { minimumFractionDigits: 2 })})`
    ],
    [
      'Recurring Donations',
      `${stats.recurringDonations.count} ($${stats.recurringDonations.total.toLocaleString('en-US', { minimumFractionDigits: 2 })})`
    ],
    ['Active Subscriptions', stats.recurringDonations.activeSubscriptions.toString()]
  ]

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: summaryData,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { halign: 'right' }
    }
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Donations by Campaign
  if (stats.byCampaign.length > 0) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('By Campaign', 14, yPos)
    yPos += 8
    autoTable(doc, {
      startY: yPos,
      head: [['Campaign', 'Count', 'Total']],
      body: stats.byCampaign.map((c) => [
        c.name,
        c.count.toString(),
        `$${c.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
      ]),
      theme: 'striped',
      headStyles: { fillColor: [74, 139, 179] },
      styles: { fontSize: 10 },
      columnStyles: {
        1: { halign: 'center' },
        2: { halign: 'right' }
      }
    })

    yPos = (doc as any).lastAutoTable.finalY + 15
  }

  // Add new page for transactions
  doc.addPage()
  yPos = 20

  // Recent Transactions
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Recent Transactions', 14, yPos)
  yPos += 8

  const transactionData = orders
    .slice(0, 50)
    .map((order) => [
      new Date(order.createdAt).toLocaleDateString(),
      order.customerName,
      order.campaign?.name || 'General',
      order.type === 'ONE_TIME_DONATION' ? 'One-time' : 'Recurring',
      `$${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      order.status
    ])

  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Donor', 'Campaign', 'Type', 'Amount', 'Status']],
    body: transactionData,
    theme: 'striped',
    headStyles: { fillColor: [74, 139, 179] },
    styles: { fontSize: 8 },
    columnStyles: {
      4: { halign: 'right' },
      5: { halign: 'center' }
    }
  })

  return doc
}
