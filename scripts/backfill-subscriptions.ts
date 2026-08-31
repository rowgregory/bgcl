import prisma from '@/prisma/client'
import { stripe } from '@/lib/stripe/stripeClient'

async function main() {
  const subIds = await prisma.order.findMany({
    where: { type: 'RECURRING_DONATION', stripeSubscriptionId: { not: null } },
    select: { stripeSubscriptionId: true },
    distinct: ['stripeSubscriptionId']
  })

  for (const { stripeSubscriptionId } of subIds) {
    if (!stripeSubscriptionId) continue

    const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId).catch(() => null)

    if (!sub) {
      console.log('missing in stripe:', stripeSubscriptionId)
      continue
    }

    if (sub.status === 'canceled') {
      await prisma.order.updateMany({
        where: { stripeSubscriptionId },
        data: {
          subscriptionCanceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : new Date(),
          subscriptionCancelsAt: null
        }
      })
    }

    // Any cycle Stripe says was paid should read CONFIRMED
    const invoices = await stripe.invoices.list({ subscription: stripeSubscriptionId, limit: 100 })
    const paidCount = invoices.data.filter((i) => i.status === 'paid').length

    const rows = await prisma.order.findMany({
      where: { stripeSubscriptionId },
      orderBy: { createdAt: 'asc' },
      select: { id: true, status: true }
    })

    const toConfirm = rows.slice(0, paidCount).filter((r) => r.status !== 'CONFIRMED')

    if (toConfirm.length > 0) {
      console.log(
        'correcting to CONFIRMED: ',
        toConfirm.map((r) => r.id)
      )

      await prisma.order.updateMany({
        where: { id: { in: toConfirm.map((r) => r.id) } },
        data: { status: 'CONFIRMED' }
      })
    }
  }
}

main()
