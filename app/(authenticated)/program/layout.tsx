import { ProgramLayoutClient } from '@/app/components/pages/ProgramLayoutClient'

export default async function ProgramPage({ children }: { children: React.ReactNode }) {
  return <ProgramLayoutClient>{children}</ProgramLayoutClient>
}
