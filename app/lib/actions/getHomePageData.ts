import { getDonationOrders } from './getDonationOrders'
import { getHero } from './hero/getHero'
import { getPageBySlugClient } from './page/getPageBySlugClient'
import { getPrograms } from './program/getPrograms'

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
