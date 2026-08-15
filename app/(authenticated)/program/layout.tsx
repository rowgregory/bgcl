import ProgramLayoutClient from '@/app/(authenticated)/program/ProgramLayoutClient'

export const dynamic = 'force-dynamic'

export default async function ProgramPage({ children }: { children: React.ReactNode }) {
  return <ProgramLayoutClient>{children}</ProgramLayoutClient>
}
