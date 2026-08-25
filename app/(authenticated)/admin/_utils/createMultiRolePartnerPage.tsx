import { getPartnersByTier } from '@/lib/actions/partner/getPartnerByTier'
import { PartnerTier } from '@prisma/client'
import PartnerList from '../the-library/_components/PartnerList'
import PartnerDrawer from '../the-library/partners/_components/PartnerDrawer'

interface TierGroup {
  id: PartnerTier
  label: string
}

export function createMultiRolePartnerPage(tiers: TierGroup[], pageTitle: string) {
  return {
    metadata: { title: `${pageTitle} - Admin` },
    default: async function Page() {
      const tierData = await Promise.all(
        tiers.map(async (tier) => ({
          tier: tier.id,
          label: tier.label,
          data: await getPartnersByTier(tier.id)
        }))
      )

      return (
        <>
          <PartnerDrawer />

          <div className="min-h-screen dark:bg-neutral-950 bg-white p-6 md:p-8">
            <div className="w-full space-y-12">
              <div>
                <h1 className="text-2xl font-semibold dark:text-neutral-100 text-neutral-900">{pageTitle}</h1>
              </div>
              {tierData.map((group) => (
                <PartnerList key={group.tier} data={group.data} tier={group.tier} tierLabel={group.label} />
              ))}
            </div>
          </div>
        </>
      )
    }
  }
}
