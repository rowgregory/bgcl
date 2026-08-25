'use client'

import { TPublicEventDetailsClient } from '@/types/casino.types'
import { CasinoEventClient } from './_components/casino/CasinoEventClient'
import { GalaEventClient } from './_components/gala/GalaEventClient'

export function PublicEventDetailsClient({ data, name, savedCards, address }: TPublicEventDetailsClient) {
  if (data?.id === 'cmndt9jok00001iaq8wte1a2z')
    return <CasinoEventClient address={address} data={data} name={name} savedCards={savedCards} />

  return <GalaEventClient data={data} />
}
