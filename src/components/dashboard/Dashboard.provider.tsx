/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useContext } from 'react'
import { BiLogOut } from 'react-icons/bi'
import { useIdleTimer } from 'react-idle-timer'
import useAuth from '../../auth/auth.store'
import { onInteractApp } from '../../utils'
import { showModal } from '../../utils/Overlay'
import useMediaQuery from '../../utils/hooks/useMediaQuery'
import usePersistedState from '../../utils/hooks/usePersistedState'
import { AlertPrompt } from '../dialog/Prompt'
import { dashboardProps, dashboardProviderProps } from './Dashboard.models'

const DashboardContext = createContext({} as dashboardProviderProps)

export const useDashboard = () => useContext(DashboardContext)

export default function DashboardProvider({ children, ...rest }: dashboardProps) {
  const isTablet = useMediaQuery('lg') as any
  const isPhone = useMediaQuery('sm') as any
  const [PersistedState, setPersistedState] = usePersistedState({ showSidebar: true }) as any

  useIdleTimer({
    onIdle:()=>{
      const {setState, logout} = useAuth.getState()
      onInteractApp(() => {location.replace('/login')})
      setState({inactive: true})
      logout(false)

      showModal(AlertPrompt, {
        icon: BiLogOut,
        description: `You have been automatically logged out due to inactivity.`,
        onClick: () => {location.replace('/login')},
        btnTxt: 'Logout',
      })
    },
    startOnMount:true,
    stopOnIdle:true,
    timeout: 60000 * (process.env.APP_IDLE_TIME || 15),
    throttle: 500
  })

  const setShowSidebar = (val = !PersistedState.showSidebar) => {
    setPersistedState({ showSidebar: val })
  }

  if (!isTablet && isPhone) PersistedState.showSidebar = false

  return PersistedState.showSidebar !== undefined ? (
    <DashboardContext.Provider value={{ ...rest, showSidebar: PersistedState.showSidebar, setShowSidebar, isPhone, isTablet }}>
      {children}
    </DashboardContext.Provider>
  ) : null
}
