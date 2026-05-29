import { auth } from '../auth'
import { getDonationOrders } from './getDonationOrders'
import { getHero } from './getHero'
import { getPageBySlugClient } from './getPageBySlugClient'
import { getPrograms } from './getPrograms'

export async function getHomePageData() {
  const [session, programs, donationOrders, homePage, capitalPage, hero] = await Promise.all([
    auth().catch(() => null),
    getPrograms().catch(() => null),
    getDonationOrders().catch(() => null),
    getPageBySlugClient('home').catch(() => null),
    getPageBySlugClient('capital').catch(() => null),
    getHero().catch(() => null)
  ])

  return { session, programs, donationOrders, homePage, capitalPage, hero }
}
