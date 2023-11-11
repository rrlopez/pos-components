import { NextShield } from 'next-shield'
import { useRouter } from 'next/router'
import Loading from '../components/loading'
import useAuth from './auth.store'

function Auth({ children, onFetchUser }: any) {
  const router = useRouter()
  const user = useAuth((state: any) => state.user) as any || {}
  const inactive = useAuth((state: any) => state.inactive) as any
  const authenticating = useAuth((state: any) => state.authenticating) as any
  const authenticate = useAuth((state: any) => state.authenticate) as any
  authenticate(user.id, onFetchUser)

  // workaround if when redirect link has /#/
  if (router.asPath.split('#')[1]) {
    router.replace(router.asPath.split('#/auth')[1])
    return null
  }

  return (
    <NextShield
      isAuth={!!user.id || inactive}
      isLoading={authenticating}
      router={router}
      privateRoutes={process.env.PRIVATE_ROUTES as any}
      publicRoutes={process.env.PUBLIC_ROUTES as any}
      accessRoute='/'
      loginRoute='/login'
      LoadingComponent={<Loading className='h-screen' />}
    >
      {children}
    </NextShield>
  )
}

export default Auth
