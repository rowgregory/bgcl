import { getDonationOrders } from './getDonationOrders'
import { getHero } from './getHero'
import { getPageBySlugClient } from './getPageBySlugClient'
import { getPrograms } from './getPrograms'

export async function getHomePageData() {
  const [programs, donationOrders, homePage, capitalPage, hero] = await Promise.all([
    getPrograms().catch(() => null),
    getDonationOrders().catch(() => null),
    getPageBySlugClient('home').catch(() => null),
    getPageBySlugClient('capital').catch(() => null),
    getHero().catch(() => null)
  ])

  return { programs, donationOrders, homePage, capitalPage, hero }
}
