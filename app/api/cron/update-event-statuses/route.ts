import { updateEventStatuses } from '@/app/lib/actions/updateEventStatuses'
import { NextResponse } from 'next/server'

export async function GET() {
  await updateEventStatuses()
  return NextResponse.json({ success: true })
}
