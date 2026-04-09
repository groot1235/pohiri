import HomeView from '@/modules/home/ui/views/home-view'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

type Props = {}

const page = async (props: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    redirect("/sign-in")
  }
  return (
    <div>
      <HomeView />
    </div>
  )
}

export default page