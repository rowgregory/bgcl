import { getHero } from '../hero/getHero'
import { getPageBySlugClient } from '../page/getPageBySlugClient'
import { getDonationNotificationOrders } from '../order/getDonationNotificationOrders'

export async function getPublicLayoutData() {
  const [donationOrders, capitalPage, hero] = await Promise.all([
    getDonationNotificationOrders().catch(() => null),
    getPageBySlugClient('capital').catch(() => null),
    getHero().catch(() => null)
  ])

  return { donationOrders, capitalPage, hero }
}
