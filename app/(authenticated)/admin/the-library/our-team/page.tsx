import { createMultiRoleAdminPage } from '@/app/lib/utils/createMultiRoleAdminPage'

const { metadata, default: Page } = createMultiRoleAdminPage(
  [
    { id: 'admin_staff', label: 'Administrative Staff' },
    { id: 'program_staff', label: 'Program Staff' },
    { id: 'maintenance_staff', label: 'Maintenance & Facilities Staff' }
  ],
  'Our Team'
)
export { metadata }
export default Page
