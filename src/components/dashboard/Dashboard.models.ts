export interface dashboardProps {
  children?: React.ReactNode
  className?: string
}

export interface dashboardProviderProps {
  showSidebar: boolean
  setShowSidebar: (showSidebar: boolean) => void
  isTablet: boolean
  isPhone: boolean
}
