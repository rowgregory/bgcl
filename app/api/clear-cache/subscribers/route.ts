import { revalidateTag } from 'next/cache'

export async function GET() {
  revalidateTag('Subscriber', 'default')
  return Response.json({ cleared: true })
}
