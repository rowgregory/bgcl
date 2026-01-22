import { revalidateTag } from 'next/cache'

export async function GET() {
  revalidateTag('Page', 'default')
  return Response.json({ cleared: true })
}
