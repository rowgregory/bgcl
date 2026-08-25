'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/stores/useCartStore'
import {
  AmountCard,
  BillingAddressCard,
  CampaignCard,
  ConfirmationActions,
  ConfirmationHeader,
  ConfirmationHero,
  CustomerInfoCard,
  DonationInfoCard,
  EventInfoCard,
  FeesCard,
  PaymentDetailsCard,
  NextSteps,
  NotesCard,
  OrderIdsCard,
  SupporterNotice,
  TicketsGrid
} from './_components'

export default function OrderConfirmationClient({ order }: { order: any }) {
  const isDonation = Boolean(order?.type?.includes('DONATION'))
  const isRecurring = order?.type === 'RECURRING_DONATION'
  const isTicket = order?.type === 'TICKET_PURCHASE'

  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    window.scrollTo(0, 0)
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <ConfirmationHeader isDonation={isDonation} />

      <div className="max-w-6xl mx-auto px-4 py-12 lg:px-8">
        <ConfirmationHero isDonation={isDonation} />

        <AmountCard order={order} isDonation={isDonation} isRecurring={isRecurring} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <CustomerInfoCard order={order} />
          <BillingAddressCard address={order?.billingAddress} />
          <PaymentDetailsCard order={order} />
          {isDonation && <DonationInfoCard order={order} isRecurring={isRecurring} />}
          <FeesCard order={order} />
          <CampaignCard campaign={order?.campaign} />
          {isTicket && <EventInfoCard event={order?.event} />}
          <OrderIdsCard order={order} />
        </div>

        <NotesCard notes={order?.notes} />

        <SupporterNotice isRecurring={isRecurring} />

        {isTicket && <TicketsGrid order={order} />}

        <NextSteps isDonation={isDonation} isRecurring={isRecurring} customerEmail={order?.customerEmail} />

        <ConfirmationActions isTicket={isTicket} />
      </div>
    </div>
  )
}
