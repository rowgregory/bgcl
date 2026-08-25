import { TeamMemberList } from '@/app/(authenticated)/admin/the-library/_components/TeamMemberList'
import { TeamMemberDrawer } from '@/app/(authenticated)/admin/the-library/_components/TeamMemberDrawer'
import { getTeamMembersByRole } from '@/lib/actions/team-member/getTeamMembersByRole'
import { TeamMemberRole } from '@/lib/validations/team-member.validation'

interface RoleGroup {
  id: TeamMemberRole
  label: string
}

export function createMultiRoleAdminPage(roles: RoleGroup[], pageTitle: string) {
  return {
    metadata: { title: `${pageTitle} - Admin` },
    default: async function Page() {
      const roleData = await Promise.all(
        roles.map(async (role) => ({
          role: role.id,
          label: role.label,
          data: await getTeamMembersByRole(role.id)
        }))
      )

      return (
        <>
          <TeamMemberDrawer />

          <div className="min-h-screen dark:bg-neutral-950 bg-white p-6 md:p-8">
            <div className="w-full space-y-12">
              <div>
                <h1 className="text-2xl font-semibold dark:text-neutral-100 text-neutral-900">{pageTitle}</h1>
              </div>
              {roleData.map((group) => (
                <TeamMemberList key={group.role} data={group.data.data} role={group.role} roleLabel={group.label} />
              ))}
            </div>
          </div>
        </>
      )
    }
  }
}
