import { revalidateTag } from 'next/cache'

export async function GET() {
  revalidateTag('Event', 'default')
  return Response.json({ cleared: true })
}
