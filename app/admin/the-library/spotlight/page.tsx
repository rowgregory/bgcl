import { createMultiRoleAdminPage } from '@/app/lib/utils/createMultiRoleAdminPage'

const { metadata, default: Page } = createMultiRoleAdminPage(
  [
    { id: 'honoree', label: 'Honorees' },
    { id: 'youth', label: 'Youth of the Year' }
  ],
  'Spotlight'
)
export { metadata }
export default Page
