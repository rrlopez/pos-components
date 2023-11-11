import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Toaster } from 'react-hot-toast'
import { SkeletonTheme } from 'react-loading-skeleton'
import { QueryClient, QueryClientProvider } from 'react-query'
import Auth from './auth'
import LoadingBar from './components/loadingBar'
import Overlay, { clearModals } from './utils/Overlay'

import "react-datepicker/dist/react-datepicker.css"
import 'react-loading-skeleton/dist/skeleton.css'

export const queryClient = new QueryClient()

function App({ children, onFetchUser }: any) {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(()=>{
    clearModals()
    setIsMounted(true)
  }, [router.pathname])

  return (
    <ThemeProvider enableSystem={false} enableColorScheme attribute='data-theme'>
      {isMounted &&
        <SkeletonTheme baseColor='#d3d3d333' highlightColor='#d3d3d31a'>
        <DndProvider backend={HTML5Backend}>
          <QueryClientProvider client={queryClient}>
              <Overlay />
              <LoadingBar />
              <Toaster position="top-right" toastOptions={{ duration: 5000 }} containerStyle={{ top: 60 }}/>
              <Auth onFetchUser={onFetchUser}>{children}</Auth>
          </QueryClientProvider>
        </DndProvider>
      </SkeletonTheme>
      }
    </ThemeProvider>
  )
}

export default App
