import SupporterPage from './page'

export const dynamic = 'force-dynamic'

export default async function SupporterLayout({ children }) {
  return <SupporterPage>{children}</SupporterPage>
}
