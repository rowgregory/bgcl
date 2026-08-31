'use client'

import { useState } from 'react'
import {
  MailingAddressField,
  SupporterOverviewHeader,
  Stats,
  Name,
  PhoneNumber,
  UpcomingEvents,
  PaymentMethods
} from './_components'
import { getSupporterDashboard } from '@/lib/actions/_dashboard/getSupporterDashboard'
import { Address } from '@prisma/client'

type SupporterDashboard = NonNullable<Awaited<ReturnType<typeof getSupporterDashboard>>['data']>

type Props = {
  dashboard: SupporterDashboard
  address: Address | null
  name: { firstName: string | null; lastName: string | null } | null
  savedCards: {
    id: string
    stripePaymentId: string
    cardholderName: string
    cardBrand: string
    cardLast4: string
    cardExpMonth: number
    cardExpYear: number
    isDefault: boolean
    createdAt: Date
  }[]
  phone: string | null
}

export default function SupporterOverviewClient({ dashboard, address, name, savedCards, phone }: Props) {
  const [firstName, setFirstName] = useState(name?.firstName ?? '')
  const [lastName, setLastName] = useState(name?.lastName ?? '')

  return (
    <div className="p-6 md:p-8 lg:p-12">
      <div className="max-w-3xl mx-auto">
        <SupporterOverviewHeader dashboard={dashboard} firstName={firstName} lastName={lastName} />

        <div className="mt-8 pb-8 border-b border-neutral-200 dark:border-neutral-800">
          <Stats dashboard={dashboard} />
        </div>

        {dashboard.upcomingEvents.length > 0 && (
          <div className="py-8 border-b border-neutral-200 dark:border-neutral-800">
            <UpcomingEvents dashboard={dashboard} />
          </div>
        )}

        <div className="py-8 border-b border-neutral-200 dark:border-neutral-800 space-y-6">
          <Name
            firstName={firstName}
            lastName={lastName}
            name={name}
            setFirstName={setFirstName}
            setLastName={setLastName}
          />
          <PhoneNumber phone={phone} />
          <MailingAddressField address={address} />
        </div>

        <div className="py-8">
          <PaymentMethods savedCards={savedCards} />
        </div>
      </div>
    </div>
  )
}
