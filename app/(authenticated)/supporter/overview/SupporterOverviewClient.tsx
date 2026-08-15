'use client'

import { useState } from 'react'
import {
  PageHeader,
  Stats,
  Name,
  PhoneNumber,
  CompactCTAs,
  ActivityGrid,
  TicketOrders,
  PaymentMethods,
  SupporterOverviewFooter
} from './_components'
import { Address } from './_components/Address'

export default function SupporterOverviewClient({ dashboard, address, name, savedCards, phone }) {
  const [firstName, setFirstName] = useState(name?.firstName ?? '')
  const [lastName, setLastName] = useState(name?.lastName ?? '')

  return (
    <div className="min-h-screen dark:bg-neutral-950 bg-white">
      <main className="p-6 md:p-8 lg:p-12 space-y-10">
        <div className="max-w-334 mx-auto space-y-10">
          {/* Page header */}
          <PageHeader dashboard={dashboard} firstName={firstName} lastName={lastName} />

          {/* Stats */}
          <Stats dashboard={dashboard} />

          {/* Name */}
          <Name
            firstName={firstName}
            lastName={lastName}
            name={name}
            setFirstName={setFirstName}
            setLastName={setLastName}
          />

          {/* Phone Number */}
          <PhoneNumber phone={phone} />

          {/* Compact CTAs */}
          <CompactCTAs />

          {/* Activity Grid */}
          <ActivityGrid dashboard={dashboard} />

          {/* Ticket Orders */}
          <TicketOrders dashboard={dashboard} />

          {/* Payment Methods */}
          <PaymentMethods savedCards={savedCards} />

          {/* Address */}
          <Address address={address} />
        </div>
      </main>

      <SupporterOverviewFooter />
    </div>
  )
}
