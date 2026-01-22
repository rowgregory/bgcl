import { revalidateTag } from 'next/cache'

export async function GET() {
  revalidateTag('Closing', 'default')
  return Response.json({ cleared: true })
}
