import { createMultiRoleAdminPage } from '@/app/lib/utils/createMultiRoleAdminPage'

const { metadata, default: Page } = createMultiRoleAdminPage(
  [
    { id: 'honoree', label: 'Honorees' },
    { id: 'fame', label: 'Hall of Fame Inductees' },
    { id: 'helping', label: 'Helping Hands Business of the Year' },
    { id: 'commitment', label: 'Commitment to Youth Recipients' },
    { id: 'youth', label: 'Youth of the Year' }
  ],
  'Spotlight'
)
export { metadata }
export default Page
