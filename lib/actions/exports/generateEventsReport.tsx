'use server'

import { formatCurrency } from '@/lib/utils/currency.utils'
import { requireAdmin } from '@/lib/utils/requireAdmin'
import prisma from '@/prisma/client'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

// ─── Color Palette ────────────────────────────────────────────────────────────
const C = {
  navy: [30, 58, 95] as [number, number, number],
  navyLight: [44, 82, 130] as [number, number, number],
  slate: [71, 85, 105] as [number, number, number],
  slateLight: [148, 163, 184] as [number, number, number],
  rowAlt: [246, 248, 251] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  black: [15, 23, 42] as [number, number, number],
  accent: [14, 165, 233] as [number, number, number] // sky-500 pop for amounts
}

interface ReportFilters {
  startDate?: Date
  endDate?: Date
  eventId?: string
  status?: string
  type?: 'TICKET_PURCHASE'
}

interface EventStats {
  totalRevenue: number
  uniqueEventCount: number
  totalFeesCovered: number
  averageEventOrder: number
  ticketPurchases: { count: number; total: number }
  byEvent: { title: string; count: number; total: number }[]
  byMonth: { month: string; count: number; total: number }[]
}

// ─── Server Action ─────────────────────────────────────────────────────────────
export async function generateEventsReport(filters: ReportFilters = {}) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const { startDate, endDate, eventId, status, type } = filters

    const where: any = {
      type: type || { in: ['TICKET_PURCHASE'] },
      status: status || { in: ['CONFIRMED'] }
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    if (eventId) where.eventId = eventId

    const orders = await prisma.order.findMany({
      where,
      include: {
        event: { select: { title: true, id: true } },
        orderItems: { select: { id: true, quantity: true, ticketId: true, ticketName: true } },
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

    const stats = calculateStats(orders)
    const pdf = createPDF(orders, stats, filters)

    return { success: true, pdf: pdf.output('dataurlstring') }
  } catch {
    return { success: false, error: 'Failed to generate report' }
  }
}

// ─── Stats ─────────────────────────────────────────────────────────────────────
function calculateStats(orders: any[]): EventStats {
  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0)
  const totalFeesCovered = orders.reduce((s, o) => s + Number(o.feesCovered), 0)
  const uniqueEventCount = new Set(orders.map((o) => o.event.id)).size
  const ticketPurchases = orders.filter((o) => o.type === 'TICKET_PURCHASE')

  const eventMap = new Map<string, { count: number; total: number }>()
  orders.forEach((o) => {
    const t = o.event?.title
    const e = eventMap.get(t) || { count: 0, total: 0 }
    eventMap.set(t, { count: e.count + 1, total: e.total + o.totalAmount })
  })

  const monthMap = new Map<string, { count: number; total: number }>()
  orders.forEach((o) => {
    const m = new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    const e = monthMap.get(m) || { count: 0, total: 0 }
    monthMap.set(m, { count: e.count + 1, total: e.total + o.totalAmount })
  })

  return {
    totalRevenue,
    uniqueEventCount,
    totalFeesCovered,
    averageEventOrder: uniqueEventCount > 0 ? totalRevenue / uniqueEventCount : 0,
    ticketPurchases: {
      count: ticketPurchases.length,
      total: ticketPurchases.reduce((s, o) => s + o.totalAmount, 0)
    },
    byEvent: Array.from(eventMap.entries()).map(([title, d]) => ({ title, ...d })),
    byMonth: Array.from(monthMap.entries()).map(([month, d]) => ({ month, ...d }))
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function drawPageNumber(doc: jsPDF) {
  const pw = doc.internal.pageSize.getWidth()
  const ph = doc.internal.pageSize.getHeight()
  doc.setFontSize(7.5)
  doc.setTextColor(...C.slateLight)
  doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, pw / 2, ph - 8, { align: 'center' })
}

function sectionHeader(doc: jsPDF, label: string, y: number): number {
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.navy)
  doc.text(label.toUpperCase(), 14, y)

  // thin underline
  doc.setDrawColor(...C.navyLight)
  doc.setLineWidth(0.4)
  doc.line(14, y + 1.5, doc.internal.pageSize.getWidth() - 14, y + 1.5)

  return y + 8
}

function parseAddress(raw: any): string {
  if (!raw) return '—'
  try {
    const addr = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (Array.isArray(addr) || !addr || Object.keys(addr).length === 0) return '—'
    const parts = [addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.zipCode || addr.zipPostalCode].filter(
      Boolean
    )
    return parts.length ? parts.join(', ') : '—'
  } catch {
    return '—'
  }
}

// ─── PDF Builder ───────────────────────────────────────────────────────────────
function createPDF(orders: any[], stats: EventStats, filters: ReportFilters): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'letter' })
  const pw = doc.internal.pageSize.getWidth()
  const ph = doc.internal.pageSize.getHeight()
  const margin = 14
  let y = 0

  // ══════════════════════════════════════════════════════════════════════
  // PAGE 1 — HEADER + SUMMARY
  // ══════════════════════════════════════════════════════════════════════

  // Header banner — slimmer
  doc.setFillColor(...C.navy)
  doc.rect(0, 0, pw, 28, 'F')

  // Thin accent stripe at bottom of banner
  doc.setFillColor(...C.accent)
  doc.rect(0, 27, pw, 1, 'F')

  doc.setTextColor(...C.white)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('Boys & Girls Club of Lynn', pw / 2, 11, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(180, 210, 240)
  doc.text('Events Financial Report', pw / 2, 20, { align: 'center' })

  y = 36

  // Metadata row
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.slateLight)
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y)

  if (filters.startDate || filters.endDate) {
    const range = `Period: ${filters.startDate?.toLocaleDateString() ?? 'Beginning'} – ${filters.endDate?.toLocaleDateString() ?? 'Present'}`
    doc.text(range, pw - margin, y, { align: 'right' })
  }

  y += 10

  // ── Executive Summary ──────────────────────────────────────────────────
  y = sectionHeader(doc, 'Executive Summary', y)

  autoTable(doc, {
    startY: y,
    head: [],
    body: [
      ['Total Revenue', formatCurrency(stats.totalRevenue)],
      ['Total Events', stats.uniqueEventCount.toString()],
      ['Fees Covered by Supporters', formatCurrency(stats.totalFeesCovered)],
      ['Event Orders', `${stats.ticketPurchases.count} orders (${formatCurrency(stats.ticketPurchases.total)})`]
    ],
    theme: 'plain',
    styles: { fontSize: 9.5, cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 } },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 75, textColor: C.slate },
      1: { halign: 'right', fontStyle: 'bold', textColor: C.black }
    }
  })

  y = (doc as any).lastAutoTable.finalY + 10

  // ── Orders by Event ────────────────────────────────────────────────────
  if (stats.byEvent.length > 0) {
    y = sectionHeader(doc, 'Orders by Event', y)

    autoTable(doc, {
      startY: y,
      head: [['Event', 'Orders', 'Revenue']],
      body: stats.byEvent.map((e) => [e.title, e.count.toString(), formatCurrency(e.total)]),
      theme: 'striped',
      headStyles: {
        fillColor: C.navy,
        textColor: C.white,
        fontStyle: 'bold',
        fontSize: 9,
        cellPadding: { top: 3, bottom: 3, left: 4, right: 4 }
      },
      styles: { fontSize: 9, cellPadding: { top: 2.5, bottom: 2.5, left: 4, right: 4 } },
      alternateRowStyles: { fillColor: C.rowAlt },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { halign: 'center', cellWidth: 22 },
        2: { halign: 'right', cellWidth: 34, fontStyle: 'bold', textColor: C.navyLight }
      }
    })

    y = (doc as any).lastAutoTable.finalY + 10
  }

  // ══════════════════════════════════════════════════════════════════════
  // PAGE 2 — SUPPORTER + TRANSACTION COMBINED
  // ══════════════════════════════════════════════════════════════════════
  doc.addPage()
  y = 14

  // Thin top banner to match brand
  doc.setFillColor(...C.navy)
  doc.rect(0, 0, pw, 10, 'F')
  doc.setFillColor(...C.accent)
  doc.rect(0, 9.5, pw, 0.5, 'F')

  doc.setTextColor(...C.white)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('Boys & Girls Club of Lynn — Events Report', pw / 2, 6.5, { align: 'center' })

  y = 20

  // ── Supporter + Transaction Combined Table ─────────────────────────────
  y = sectionHeader(doc, 'Supporter & Transaction Detail', y)

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...C.slateLight)
  const uniqueSupporters = new Set(orders.map((o) => o.userId || o.customerEmail)).size
  doc.text(`${uniqueSupporters} unique supporters · showing ${Math.min(orders.length, 200)} most recent transactions`, margin, y)
  y += 7

  // Build supporter name/address map (first occurrence wins)
  const supporterMeta: Record<string, { name: string; address: string }> = {}
  orders.forEach((order) => {
    const key = order.customerEmail ?? order.user?.email ?? ''
    if (!supporterMeta[key]) {
      const name = order.user
        ? `${order.user.firstName ?? ''} ${order.user.lastName ?? ''}`.trim() || 'Anonymous'
        : order.customerName || 'Anonymous'
      supporterMeta[key] = { name, address: parseAddress(order.billingAddress) }
    }
  })

  // Combined rows: one row per transaction, with supporter context baked in
  const combinedData = orders.slice(0, 200).map((order) => {
    const email = order.customerEmail ?? order.user?.email ?? '—'
    const meta = supporterMeta[email] ?? { name: 'Anonymous', address: '—' }
    const tickets = order.orderItems.reduce((s: number, i: any) => s + i.quantity, 0)
    const ticketName =
      order.orderItems
        .map((i: any) => i.ticketName)
        .filter(Boolean)
        .join(', ') || '—'
    const date = new Date(order.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: '2-digit'
    })

    return [
      date,
      meta.name,
      email,
      meta.address,
      order.event?.title ?? '—',
      ticketName,
      tickets.toString(),
      formatCurrency(order.totalAmount)
    ]
  })

  autoTable(doc, {
    startY: y,
    head: [['Date', 'Supporter', 'Email', 'Billing Address', 'Event', 'Ticket Type', 'Qty', 'Amount']],
    body: combinedData,
    theme: 'striped',
    tableWidth: 'auto',
    margin: { left: 10, right: 10 },
    headStyles: {
      fillColor: C.navy,
      textColor: C.white,
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
      cellPadding: { top: 3, bottom: 3, left: 2, right: 2 }
    },
    styles: {
      fontSize: 7,
      cellPadding: { top: 2.2, bottom: 2.2, left: 2, right: 2 },
      overflow: 'linebreak',
      lineColor: [220, 228, 236],
      lineWidth: 0.1
    },
    alternateRowStyles: { fillColor: C.rowAlt },
    columnStyles: {
      0: { cellWidth: 17, halign: 'center', textColor: C.slate },
      1: { cellWidth: 26, fontStyle: 'bold' },
      2: { cellWidth: 36 },
      3: { cellWidth: 32 },
      4: { cellWidth: 28 },
      5: { cellWidth: 24 },
      6: { cellWidth: 10, halign: 'center' },
      7: { cellWidth: 20, halign: 'right', fontStyle: 'bold', textColor: C.navyLight }
    },
    didDrawPage: () => drawPageNumber(doc)
  })

  // Confidentiality footer on last page
  const finalY = (doc as any).lastAutoTable.finalY
  if (finalY < ph - 30) {
    doc.setFontSize(7)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(...C.slateLight)
    doc.text('This report is confidential and intended for internal use only.', margin, ph - 14)
    doc.text('Boys & Girls Club of Lynn © 2026', margin, ph - 10)
  }

  return doc
}
