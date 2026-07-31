import { createMultiRoleAdminPage } from '@/app/(authenticated)/admin/_utils/createMultiRoleAdminPage'

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
