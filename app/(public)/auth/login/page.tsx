import { Suspense } from 'react'
import LoginClient from './LoginClient'

export const dynamic = 'force-dynamic'

export default function Loginpage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  )
}
