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
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            createdAt: true
          }
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
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPos = 20

  // ============ PAGE 1: HEADER & SUMMARY ============

  // Header with colored banner
  doc.setFillColor(74, 139, 179)
  doc.rect(0, 0, pageWidth, 35, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('Boys & Girls Club of Lynn', pageWidth / 2, 15, { align: 'center' })

  doc.setFontSize(16)
  doc.setFont('helvetica', 'normal')
  doc.text('Donation Financial Report', pageWidth / 2, 25, { align: 'center' })

  // Reset text color
  doc.setTextColor(0, 0, 0)
  yPos = 45

  // Report metadata
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, yPos)

  if (filters.startDate || filters.endDate) {
    yPos += 5
    const dateRange = `Period: ${filters.startDate?.toLocaleDateString() || 'Beginning'} - ${filters.endDate?.toLocaleDateString() || 'Present'}`
    doc.text(dateRange, 14, yPos)
  }

  yPos += 12
  doc.setTextColor(0, 0, 0)

  // Summary Statistics Section
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Executive Summary', 14, yPos)
  yPos += 10

  const summaryData = [
    ['Total Revenue', `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
    ['Total Donations', stats.totalDonations.toString()],
    ['Average Donation', `$${stats.averageDonation.toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
    ['Fees Covered by Donors', `$${stats.totalFeesCovered.toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
    ['', ''],
    [
      'One-Time Donations',
      `${stats.oneTimeDonations.count} donations ($${stats.oneTimeDonations.total.toLocaleString('en-US', { minimumFractionDigits: 2 })})`
    ],
    [
      'Recurring Donations',
      `${stats.recurringDonations.count} donations ($${stats.recurringDonations.total.toLocaleString('en-US', { minimumFractionDigits: 2 })})`
    ],
    ['Active Subscriptions', stats.recurringDonations.activeSubscriptions.toString()]
  ]

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: summaryData,
    theme: 'plain',
    styles: {
      fontSize: 11,
      cellPadding: 4
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 85, textColor: [60, 60, 60] },
      1: { halign: 'right', fontStyle: 'bold', textColor: [0, 0, 0] }
    }
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Donations by Campaign
  if (stats.byCampaign.length > 0) {
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Donations by Campaign', 14, yPos)
    yPos += 8

    autoTable(doc, {
      startY: yPos,
      head: [['Campaign', 'Count', 'Total Amount']],
      body: stats.byCampaign.map((c) => [
        c.name,
        c.count.toString(),
        `$${c.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
      ]),
      theme: 'striped',
      headStyles: {
        fillColor: [74, 139, 179],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11
      },
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { halign: 'center', cellWidth: 30 },
        2: { halign: 'right', cellWidth: 40 }
      }
    })

    yPos = (doc as any).lastAutoTable.finalY + 15
  }

  // ============ PAGE 2: DONOR DIRECTORY ============
  doc.addPage()
  yPos = 20

  if (orders.length > 0) {
    // Section Header
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Donor Directory', 14, yPos)
    yPos += 6

    // Subtitle
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(100, 100, 100)
    doc.text(`Total Unique Donors: ${new Set(orders.map((o) => o.userId || o.customerEmail)).size}`, 14, yPos)
    yPos += 10

    doc.setTextColor(0, 0, 0)

    const donorMap = new Map<string, any>()

    orders.forEach((order) => {
      const donorKey = order.userId || order.customerEmail
      const existing = donorMap.get(donorKey)

      if (existing) {
        existing.count += 1
        existing.total += order.totalAmount
        // Keep the first billing address encountered
        if (!existing.billingAddress && order.billingAddress) {
          existing.billingAddress = order.billingAddress
        }
      } else {
        donorMap.set(donorKey, {
          name: order.user
            ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'Anonymous'
            : order.customerName || 'Anonymous',
          email: order.user?.email || order.customerEmail,
          billingAddress: order.billingAddress,
          count: 1,
          total: order.totalAmount,
          notes: order.notes
        })
      }
    })

    // Sort donors by total contribution (highest first)
    const sortedDonors = Array.from(donorMap.values()).sort((a, b) => b.total - a.total)

    const donorData = sortedDonors.map((donor, index) => {
      // Parse billing address from JSON
      let addressStr = 'N/A'
      if (donor.billingAddress) {
        try {
          const addr =
            typeof donor.billingAddress === 'string' ? JSON.parse(donor.billingAddress) : donor.billingAddress

          // Check if it's an empty array or valid object
          if (Array.isArray(addr) || Object.keys(addr).length === 0) {
            addressStr = 'N/A'
          } else {
            // Format full address
            const parts = []
            if (addr.address) parts.push(addr.address)
            if (addr.addressLine1) parts.push(addr.addressLine1)
            if (addr.addressLine2) parts.push(addr.addressLine2)
            if (addr.city) parts.push(addr.city)
            if (addr.state) parts.push(addr.state)
            if (addr.zipCode || addr.zip) parts.push(addr.zipCode || addr.zip)

            addressStr = parts.length > 0 ? parts.join(', ') : 'N/A'
          }
        } catch (e) {
          addressStr = 'N/A'
        }
      }

      return [
        (index + 1).toString(), // Rank number
        donor.name,
        donor.email,
        addressStr,
        donor.count.toString(),
        `$${donor.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        donor.notes
      ]
    })

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Donor Name', 'Email Address', 'Billing Address', '# of Gifts', 'Total', 'Notes']],
      body: donorData,
      theme: 'striped',
      tableWidth: 'auto',
      margin: { left: 10, right: 10 },
      headStyles: {
        fillColor: [74, 139, 179],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center'
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
        overflow: 'linebreak'
      },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center', textColor: [100, 100, 100] },
        1: { cellWidth: 28, fontStyle: 'bold' },
        2: { cellWidth: 38 },
        3: { cellWidth: 45 },
        4: { cellWidth: 14, halign: 'center' },
        5: { cellWidth: 20, halign: 'right', fontStyle: 'bold', textColor: [74, 139, 179] },
        6: { cellWidth: 30 }
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      didDrawPage: (data) => {
        doc.setFontSize(8)
        doc.setTextColor(128, 128, 128)
        doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
      }
    })
  }

  // ============ PAGE 3: TRANSACTION DETAILS ============
  doc.addPage()
  yPos = 20

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Transaction History', 14, yPos)
  yPos += 8

  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(100, 100, 100)
  doc.text(`Showing ${Math.min(orders.length, 100)} most recent transactions`, 14, yPos)
  yPos += 10

  doc.setTextColor(0, 0, 0)

  const transactionData = orders
    .slice(0, 100)
    .map((order) => [
      new Date(order.createdAt).toLocaleDateString(),
      order.customerName || 'Anonymous',
      order.campaign?.name || 'General Fund',
      order.type === 'ONE_TIME_DONATION' ? 'One-time' : 'Recurring',
      `$${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    ])

  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Donor', 'Campaign', 'Type', 'Amount']],
    body: transactionData,
    theme: 'striped',
    headStyles: {
      fillColor: [74, 139, 179],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    styles: { fontSize: 8, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 50 },
      2: { cellWidth: 55 },
      3: { cellWidth: 26, halign: 'center' },
      4: { halign: 'right', cellWidth: 25, fontStyle: 'bold', textColor: [74, 139, 179] }
    },
    didDrawPage: (data) => {
      // Add page numbers
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
    }
  })

  // Footer on last page
  const finalY = (doc as any).lastAutoTable.finalY
  if (finalY < pageHeight - 40) {
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.setFont('helvetica', 'italic')
    doc.text('This report is confidential and intended for internal use only.', 14, pageHeight - 20)
    doc.text('Boys & Girls Club of Lynn © 2026', 14, pageHeight - 15)
  }

  return doc
}
