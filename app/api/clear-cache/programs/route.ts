import { revalidateTag } from 'next/cache'

export async function GET() {
  revalidateTag('Program', 'default')
  revalidateTag('Theme', 'default')
  return Response.json({ cleared: true })
}
