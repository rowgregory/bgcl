import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TicketItem {
  ticketName: string
  ticketDescription?: string | null
  pricePerUnit: number
  totalPrice: number
  quantity: number
  raffleTicketNumber?: number | null
  raffleTicketCode?: string | null
}

interface TicketPDFData {
  order: {
    id: string
    customerName: string
    customerEmail: string
    paidAt: Date | string
    totalAmount: number
  }
  event: {
    title: string
    subtitle?: string | null
    date: Date | string
    location: string
    address?: string | null
    raffleTerms?: string | null
    raffleDrawDate?: Date | string | null
  }
  items: TicketItem[]
}

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

const BGCL_BLUE = [26, 114, 184] as [number, number, number]
const GOLD = [217, 119, 6] as [number, number, number]
const GOLD_LIGHT = [251, 191, 36] as [number, number, number]
const WHITE = [255, 255, 255] as [number, number, number]
const NEAR_WHITE = [249, 250, 251] as [number, number, number]
const LIGHT_GRAY = [243, 244, 246] as [number, number, number]
const MID_GRAY = [107, 114, 128] as [number, number, number]
const DARK_GRAY = [31, 41, 55] as [number, number, number]
const BORDER = [209, 213, 219] as [number, number, number]
const STUB_BG = [239, 246, 255] as [number, number, number]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatTime(value: Date | string): string {
  return new Date(value).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York'
  })
}

function padTicketNumber(n: number): string {
  return String(n).padStart(4, '0')
}

// ---------------------------------------------------------------------------
// Draw one ticket
// ---------------------------------------------------------------------------

function drawTicket(doc: jsPDF, item: TicketItem, data: TicketPDFData, startY: number): number {
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 14
  const ticketW = pageWidth - margin * 2
  const headerH = 18
  const stripeH = 1.5
  const bodyH = 36
  const footerH = 10
  const ticketH = headerH + stripeH + bodyH + footerH
  const x = margin
  const y = startY
  const isRaffle = !!item.raffleTicketNumber

  // ── Shadow ────────────────────────────────────────────────────────────────
  doc.setFillColor(200, 210, 220)
  doc.roundedRect(x + 1, y + 1.5, ticketW, ticketH, 3, 3, 'F')

  // ── Outer card ────────────────────────────────────────────────────────────
  doc.setFillColor(...WHITE)
  doc.setDrawColor(...BORDER)
  doc.setLineWidth(0.3)
  doc.roundedRect(x, y, ticketW, ticketH, 3, 3, 'FD')

  // ── Header ────────────────────────────────────────────────────────────────
  doc.setFillColor(...BGCL_BLUE)
  doc.roundedRect(x, y, ticketW, headerH, 3, 3, 'F')
  doc.rect(x, y + headerH - 4, ticketW, 4, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(5.5)
  doc.setTextColor(200, 225, 255)
  doc.text('BOYS & GIRLS CLUB OF LYNN', x + 6, y + 5.5)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...WHITE)
  doc.text(data.event.title.toUpperCase(), x + 6, y + 14, { maxWidth: ticketW - 60 })

  // Date + location inline in header
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6)
  doc.setTextColor(200, 225, 255)
  const metaText = `${formatDate(data.event.date)}  ·  ${formatTime(data.event.date)}${data.event.location ? `  ·  ${data.event.location}` : ''}`
  doc.text(metaText, x + ticketW - 6, y + 14, { align: 'right', maxWidth: ticketW * 0.5 })

  // ── Gold stripe ───────────────────────────────────────────────────────────
  const stripeY = y + headerH
  doc.setFillColor(...GOLD)
  doc.rect(x, stripeY, ticketW * 0.5, stripeH, 'F')
  doc.setFillColor(...GOLD_LIGHT)
  doc.rect(x + ticketW * 0.5, stripeY, ticketW * 0.5, stripeH, 'F')

  // ── Body ──────────────────────────────────────────────────────────────────
  const bodyY = stripeY + stripeH
  doc.setFillColor(...WHITE)
  doc.rect(x, bodyY, ticketW, bodyH, 'F')

  const bp = 6

  // Ticket name + price on same line
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...DARK_GRAY)
  doc.text(item.ticketName, x + bp, bodyY + 9)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...BGCL_BLUE)
  doc.text(`$${item.totalPrice.toFixed(2)}`, x + ticketW - bp, bodyY + 9, { align: 'right' })

  // Description — single line
  if (item.ticketDescription) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(...MID_GRAY)
    const lines = doc.splitTextToSize(item.ticketDescription, ticketW - bp * 2)
    doc.text(lines[0], x + bp, bodyY + 16)
  }

  // Divider
  doc.setDrawColor(...BORDER)
  doc.setLineWidth(0.2)
  doc.line(x + bp, bodyY + 20, x + ticketW - bp, bodyY + 20)

  // Holder + raffle info on same row
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  doc.setTextColor(...MID_GRAY)
  doc.text(`Holder: ${data.order.customerName}`, x + bp, bodyY + 27)

  if (isRaffle) {
    // Raffle ticket number right-aligned
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6.5)
    doc.setTextColor(...BGCL_BLUE)
    doc.text(`Ticket No. ${padTicketNumber(item.raffleTicketNumber!)}`, x + ticketW - bp, bodyY + 27, {
      align: 'right'
    })

    if (item.raffleTicketCode) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(6)
      doc.setTextColor(...MID_GRAY)
      doc.text(item.raffleTicketCode, x + ticketW - bp, bodyY + 33, { align: 'right' })
    }
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  const footerY = bodyY + bodyH
  doc.setFillColor(...LIGHT_GRAY)
  doc.rect(x, footerY, ticketW, footerH, 'F')
  doc.roundedRect(x, footerY + footerH - 3, ticketW, 3 + 0.5, 3, 3, 'F')

  const terms =
    data.event.raffleTerms ?? 'Must be present at time of draw to claim prize. Non-transferable. No cash value.'
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(5)
  doc.setTextColor(...MID_GRAY)
  doc.text(`* ${terms}`, x + bp, footerY + 6, { maxWidth: ticketW - bp * 2 })

  return y + ticketH
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function generateTicketPDF(data: TicketPDFData): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 14

  // ── Page header ───────────────────────────────────────────────────────────
  doc.setFillColor(...BGCL_BLUE)
  doc.rect(0, 0, pageWidth, 30, 'F')

  // Gold accent under header
  doc.setFillColor(...GOLD)
  doc.rect(0, 30, pageWidth, 2, 'F')
  doc.setFillColor(...GOLD_LIGHT)
  doc.rect(0, 32, pageWidth, 1, 'F')

  // Org name
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.setTextColor(...WHITE)
  doc.text('BOYS & GIRLS CLUB OF LYNN', margin, 13)

  // Subline
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(180, 215, 245)
  doc.text('Ticket Confirmation', margin, 21)

  // Order info right side
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(200, 225, 255)
  doc.text(`Order #${data.order.id.slice(-10).toUpperCase()}`, pageWidth - margin, 10, { align: 'right' })
  doc.text(data.order.customerName, pageWidth - margin, 17, { align: 'right' })
  doc.text(data.order.customerEmail, pageWidth - margin, 23, { align: 'right' })

  // ── Tickets ───────────────────────────────────────────────────────────────
  let currentY = 40

  data.items.forEach((item, i) => {
    if (i > 0 && currentY + 100 > pageHeight - 20) {
      doc.addPage()
      currentY = 15
    }
    currentY = drawTicket(doc, item, data, currentY) + 10
  })

  // ── Draw date callout ─────────────────────────────────────────────────────
  if (data.event.raffleDrawDate && data.items.some((i) => i.raffleTicketNumber)) {
    if (currentY + 22 > pageHeight - 20) {
      doc.addPage()
      currentY = 15
    }

    doc.setFillColor(...GOLD)
    doc.setGState(new (doc as any).GState({ opacity: 0.12 }))
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 18, 3, 3, 'F')
    doc.setGState(new (doc as any).GState({ opacity: 1 }))

    doc.setDrawColor(...GOLD)
    doc.setLineWidth(0.5)
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 18, 3, 3, 'S')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(...GOLD)
    doc.text('RAFFLE DRAW', pageWidth / 2, currentY + 7, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...DARK_GRAY)
    doc.text(
      `${formatDate(data.event.raffleDrawDate)}  at  ${formatTime(data.event.raffleDrawDate)} EST`,
      pageWidth / 2,
      currentY + 14,
      { align: 'center' }
    )

    currentY += 24
  }

  // ── Summary table ─────────────────────────────────────────────────────────
  if (currentY + 30 > pageHeight - 20) {
    doc.addPage()
    currentY = 15
  }

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [['Ticket', 'Qty', 'Unit Price', 'Total']],
    body: data.items.map((item) => [
      item.raffleTicketNumber
        ? `${item.ticketName} (No. ${padTicketNumber(item.raffleTicketNumber)})`
        : item.ticketName,
      item.quantity,
      `$${item.pricePerUnit.toFixed(2)}`,
      `$${item.totalPrice.toFixed(2)}`
    ]),
    foot: [['', '', 'Total Paid', `$${data.order.totalAmount.toFixed(2)}`]],
    headStyles: {
      fillColor: BGCL_BLUE,
      textColor: WHITE,
      fontStyle: 'bold',
      fontSize: 8
    },
    bodyStyles: {
      fontSize: 8,
      textColor: DARK_GRAY
    },
    footStyles: {
      fillColor: LIGHT_GRAY,
      textColor: DARK_GRAY,
      fontStyle: 'bold',
      fontSize: 8
    },
    alternateRowStyles: { fillColor: NEAR_WHITE },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 18, halign: 'center' },
      2: { cellWidth: 28, halign: 'right' },
      3: { cellWidth: 28, halign: 'right' }
    }
  })

  // ── Page footer ───────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  doc.setTextColor(...MID_GRAY)
  doc.text(
    'Please bring this document to the event. Questions? Visit bgcl.org or email esousa@bgcl.org',
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  )

  doc.setFont('helvetica', 'bold')
  doc.text(`Generated ${new Date().toLocaleDateString('en-US')}`, pageWidth - margin, pageHeight - 8, {
    align: 'right'
  })

  // ── Save ──────────────────────────────────────────────────────────────────
  doc.save(`bgcl-tickets-${data.order.id.slice(-8).toLowerCase()}.pdf`)
}
