import { createMultiRoleAdminPage } from '@/app/lib/utils/createMultiRoleAdminPage'

const { metadata, default: Page } = createMultiRoleAdminPage(
  [
    { id: 'officer', label: 'Officers' },
    { id: 'director', label: 'Directors' },
    { id: 'corporator', label: 'Corporators' }
  ],
  'Board of Directors'
)
export { metadata }
export default Page
