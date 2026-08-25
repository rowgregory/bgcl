'use server'

import { getHero } from '../hero/getHero'
import { getPageBySlugClient } from '../page/getPageBySlugClient'
import { getPrograms } from '../program/getPrograms'

export async function getHomePageData() {
  try {
    const [pageData, programs, hero] = await Promise.all([getPageBySlugClient('home'), getPrograms(), getHero()])

    return {
      success: true,
      data: {
        pageContent: pageData,
        programs: programs?.data ?? [],
        hero: hero?.data ?? null
      },
      error: null
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Could not load the home page'
    }
  }
}
