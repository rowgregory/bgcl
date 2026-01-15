import { getEvents } from '@/app/lib/actions/getEvents'
import TheCapsuleCore from './page'

export default async function TheCapsuleCoreLayout() {
  const data = await getEvents()
  return <TheCapsuleCore data={data} />
}
