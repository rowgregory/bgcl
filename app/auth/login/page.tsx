import { Suspense } from 'react'
import LoginClient from './LoginClient'

export default function Loginpage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  )
}
