import { AdminListPage } from '@/app/components/admin/AdminList'
import prisma from '@/prisma/client'

export const metadata = { title: 'Events - Admin' }

export default async function CapsuleEventsPage() {
  const data = await prisma.event.findMany({
    include: {
      tickets: true
    },
    orderBy: {
      order: 'asc'
    }
  })

  return <AdminListPage data={data} pageTitle="Events" itemType="event" />
}
