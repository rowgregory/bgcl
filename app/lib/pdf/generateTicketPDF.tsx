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
  const stubW = 52
  const mainW = ticketW - stubW
  const headerH = 24
  const stripeH = 2
  const bodyH = 56
  const footerH = 14
  const ticketH = headerH + stripeH + bodyH + footerH
  const x = margin
  const y = startY
  const isRaffle = !!item.raffleTicketNumber

  // ── Shadow / depth ────────────────────────────────────────────────────────
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
  doc.rect(x, y + headerH - 4, ticketW, 4, 'F') // flush bottom

  // Org label
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(200, 225, 255)
  doc.text('BOYS & GIRLS CLUB OF LYNN', x + 8, y + 7)

  // Event title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...WHITE)
  const titleText = data.event.title.toUpperCase()
  doc.text(titleText, x + 8, y + 18, { maxWidth: mainW - 12 })

  // Subtitle in header (italic, gold)
  if (data.event.subtitle) {
    doc.setFont('helvetica', 'bolditalic')
    doc.setFontSize(8)
    doc.setTextColor(...GOLD_LIGHT)
    // Put subtitle after title if it fits, otherwise skip (header is compact)
  }

  // Raffle badge
  if (isRaffle) {
    const badgeLabel = 'RAFFLE'
    const badgePad = 5
    const badgeH = 8
    const badgeW = doc.getTextWidth(badgeLabel) + badgePad * 2
    const badgeX = x + mainW + (stubW - badgeW) / 2
    const badgeY = y + (headerH - badgeH) / 2
    doc.setFillColor(...GOLD)
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(...WHITE)
    doc.text(badgeLabel, badgeX + badgePad, badgeY + 5.5)
  }

  // ── Gold accent stripe ─────────────────────────────────────────────────────
  const stripeY = y + headerH
  // Gradient-like: 3 rects transitioning gold
  doc.setFillColor(...GOLD)
  doc.rect(x, stripeY, ticketW * 0.5, stripeH, 'F')
  doc.setFillColor(...GOLD_LIGHT)
  doc.rect(x + ticketW * 0.5, stripeY, ticketW * 0.3, stripeH, 'F')
  doc.setFillColor(253, 230, 138)
  doc.rect(x + ticketW * 0.8, stripeY, ticketW * 0.2, stripeH, 'F')

  // ── Body background ───────────────────────────────────────────────────────
  const bodyY = stripeY + stripeH
  doc.setFillColor(...WHITE)
  doc.rect(x, bodyY, mainW, bodyH, 'F')

  // Stub background
  doc.setFillColor(...STUB_BG)
  doc.rect(x + mainW, bodyY, stubW, bodyH, 'F')

  // ── Body content ──────────────────────────────────────────────────────────
  const bp = 8 // body padding

  // Ticket name
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...DARK_GRAY)
  doc.text(item.ticketName, x + bp, bodyY + 10)

  // Description
  if (item.ticketDescription) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...MID_GRAY)
    const lines = doc.splitTextToSize(item.ticketDescription, mainW - bp * 2)
    doc.text(lines.slice(0, 2), x + bp, bodyY + 17)
  }

  // Divider
  doc.setDrawColor(...BORDER)
  doc.setLineWidth(0.2)
  doc.line(x + bp, bodyY + 24, x + mainW - bp, bodyY + 24)

  // Date row — icon + text
  const iconSize = 4
  const iconY = bodyY + 27
  const textY = bodyY + 31

  // Calendar icon (simple rect with lines)
  doc.setFillColor(...BGCL_BLUE)
  doc.setDrawColor(...BGCL_BLUE)
  doc.setLineWidth(0.3)
  doc.roundedRect(x + bp, iconY, iconSize, iconSize, 0.5, 0.5, 'FD')
  doc.setFillColor(...WHITE)
  doc.rect(x + bp + 0.5, iconY + 1.5, iconSize - 1, iconSize - 2, 'F')
  doc.setFillColor(...BGCL_BLUE)
  doc.rect(x + bp, iconY, iconSize, 1.5, 'F')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...DARK_GRAY)
  doc.text(`${formatDate(data.event.date)}  ·  ${formatTime(data.event.date)}`, x + bp + iconSize + 2, textY)

  // Location row — pin icon
  const locIconY = bodyY + 36
  const locTextY = bodyY + 40

  doc.setFillColor(...BGCL_BLUE)
  doc.setDrawColor(...BGCL_BLUE)
  doc.circle(x + bp + iconSize / 2, locIconY + 1.5, 1.5, 'F')
  doc.triangle(
    x + bp + 0.5,
    locIconY + 2,
    x + bp + iconSize - 0.5,
    locIconY + 2,
    x + bp + iconSize / 2,
    locIconY + iconSize,
    'F'
  )
  doc.setFillColor(...WHITE)
  doc.circle(x + bp + iconSize / 2, locIconY + 1.5, 0.6, 'F')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...DARK_GRAY)
  const locationText = data.event.address ? `${data.event.location}  —  ${data.event.address}` : data.event.location
  doc.text(locationText, x + bp + iconSize + 2, locTextY, { maxWidth: mainW - bp * 2 - iconSize - 2 })

  // Price
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...BGCL_BLUE)
  doc.text(`$${item.totalPrice.toFixed(2)}`, x + bp, bodyY + bodyH - 5)

  // ── Stub content ──────────────────────────────────────────────────────────
  const stubX = x + mainW
  const stubCX = stubX + stubW / 2

  if (isRaffle) {
    // Label
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6)
    doc.setTextColor(...MID_GRAY)
    doc.text('TICKET NO.', stubCX, bodyY + 10, { align: 'center' })

    // Big number
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(26)
    doc.setTextColor(...BGCL_BLUE)
    doc.text(padTicketNumber(item.raffleTicketNumber!), stubCX, bodyY + 26, { align: 'center' })

    // Horizontal divider in stub
    doc.setDrawColor(...BORDER)
    doc.setLineWidth(0.3)
    doc.line(stubX + 5, bodyY + 30, stubX + stubW - 5, bodyY + 30)

    // Code
    if (item.raffleTicketCode) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(...MID_GRAY)
      doc.text(item.raffleTicketCode, stubCX, bodyY + 36, { align: 'center' })
    }

    // "of X total" if we have total quantity
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)
    doc.setTextColor(...MID_GRAY)
    doc.text('ADMIT ONE', stubCX, bodyY + 44, { align: 'center' })
  } else {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(...MID_GRAY)
    doc.text('ADMIT', stubCX, bodyY + 18, { align: 'center' })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(28)
    doc.setTextColor(...BGCL_BLUE)
    doc.text('1', stubCX, bodyY + 32, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(...MID_GRAY)
    doc.text('GUEST', stubCX, bodyY + 38, { align: 'center' })
  }

  // ── Dashed tear line ──────────────────────────────────────────────────────
  doc.setDrawColor(...BORDER)
  doc.setLineWidth(0.4)
  doc.setLineDashPattern([1.5, 1.5], 0)
  doc.line(stubX, bodyY, stubX, bodyY + bodyH)
  doc.setLineDashPattern([], 0)

  // Notch circles
  doc.setFillColor(...NEAR_WHITE)
  doc.setDrawColor(...BORDER)
  doc.setLineWidth(0.3)
  doc.circle(stubX, bodyY, 3, 'FD')
  doc.circle(stubX, bodyY + bodyH, 3, 'FD')

  // ── Footer ────────────────────────────────────────────────────────────────
  const footerY = bodyY + bodyH
  doc.setFillColor(...LIGHT_GRAY)
  doc.rect(x, footerY, ticketW, footerH, 'F')
  // Round bottom corners
  doc.setFillColor(...LIGHT_GRAY)
  doc.roundedRect(x, footerY + footerH - 3, ticketW, 3, 0, 0, 'F')
  doc.roundedRect(x, footerY + footerH - 3, ticketW, 3 + 0.5, 3, 3, 'F')

  const terms =
    data.event.raffleTerms ?? 'Must be present at time of draw to claim prize. Non-transferable. No cash value.'
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(5.5)
  doc.setTextColor(...MID_GRAY)
  doc.text(`* ${terms}`, x + bp, footerY + 5.5, { maxWidth: ticketW - bp * 2 })

  // Holder name in footer
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6)
  doc.setTextColor(...MID_GRAY)
  doc.text(`Holder: ${data.order.customerName}`, x + ticketW - bp, footerY + 5.5, { align: 'right' })

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
