import { TeamMemberList } from '@/app/components/admin/the-library/TeamMemberList'
import { getTeamMembersByRole } from '../actions/getTeamMembersByRole'

export function createRoleAdminPage(role: string, roleLabel: string) {
  return {
    metadata: { title: `${roleLabel} - Admin` },
    default: async function Page() {
      const data = await getTeamMembersByRole(role)
      return <TeamMemberList data={data} role={role} roleLabel={roleLabel} />
    }
  }
}
