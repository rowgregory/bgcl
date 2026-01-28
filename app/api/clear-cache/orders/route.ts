import { revalidateTag } from 'next/cache'

export async function GET() {
  revalidateTag('Order', 'default')
  return Response.json({ cleared: true })
}
