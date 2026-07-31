import { createMultiRolePartnerPage } from '@/app/(authenticated)/admin/_utils/createMultiRolePartnerPage'

const { metadata, default: Page } = createMultiRolePartnerPage(
  [
    { id: 'FOUNDATION', label: 'Foundation' },
    { id: 'CORPORATE_BUSINESS', label: 'Corporate & Business' },
    { id: 'GOVERNMENT_PUBLIC', label: 'Government & Public' },
    { id: 'COMMUNITY_PROGRAM', label: 'Community & Program' }
  ],
  'Partners'
)
export { metadata }
export default Page
