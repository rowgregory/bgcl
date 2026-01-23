import { revalidateTag } from 'next/cache'

export async function GET() {
  revalidateTag('Campaign', 'default')
  return Response.json({ cleared: true })
}
