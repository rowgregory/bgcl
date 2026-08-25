import { Suspense } from 'react'
import AuthErrorClient from './AuthErrorClient'

export const dynamic = 'force-dynamic'

export default function AuthErrorPage() {
  return (
    <Suspense fallback={null}>
      <AuthErrorClient />
    </Suspense>
  )
}
