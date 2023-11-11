/* eslint-disable @next/next/no-img-element */
import { useDashboard } from '../../dashboard/Dashboard.provider'
import Link from '../../link'
import SidebarGroupLinks from './SidebarGroupLinks'

interface SidebarLinkProps {
  href?: string
  path?: string
  className?: string
  icon?: string
  src?: string
  label?: any
  shortLabel?: string
  onClick?: any
  showLabel?: boolean
  links?: [string]
  title?: string
  active?: string
  notifCount?: number
}

function SidebarButton({ showLabel, className, notifCount, ...rest }: any) {
  const { showSidebar } = useDashboard()
  const label = showSidebar || showLabel ? rest.label : ''

  return (
    <div
      {...rest}
      className={`sidebar-item ${className} ${rest.active ? 'active' : ''}`}
      data-tip={rest.title || rest.label}
      children={
        <>
          <div className='indicator'>
            {notifCount ? (
              <div className='h-5 border text-gray-800 font-bold border-base-100 indicator-item badge badge-xs bg-secondary min-w-[20px]'>{notifCount}</div>
            ) : null}
            {rest.icon}
          </div>
          <span className={showLabel ? '' : 'block sm:hidden lg:block'}>{label}</span>
        </>
      }
    />
  )
}

function SidebarLink({ className = 'tooltip tooltip-title tooltip-right tooltip-delay', showLabel, ...rest }: SidebarLinkProps) {
  if (rest.links) return <SidebarGroupLinks {...rest} />
  if (!rest.href) return <SidebarButton className={className} showLabel={showLabel} {...rest} />
  const Icon = (rest.icon as any) || <></>

  const { isPhone, setShowSidebar, showSidebar } = useDashboard()
  const label = showSidebar || showLabel ? rest.label : ''

  rest.path = rest.path ? rest.path : rest.href
  rest.path = `${rest.path?.length > 1 ? rest.path : ''}`
  rest.href = `${rest.href?.length > 1 ? rest.href : ''}`

  const handleChangeRoute = () => {
    if (!isPhone) setShowSidebar(false)
  }

  return (
    <div className='sidebar-item-container'>
      <Link
        href={rest.href}
        onClick={handleChangeRoute}
        className={`sidebar-item ${showSidebar ? 'pl-3' : `${className} justify-center`} ${rest.active ? 'active' : ''}`}
        data-tip={rest.title || rest.label}
      >
        <div className='indicator'>
          {!showSidebar && <NotifIndicator children={rest.notifCount} />}
          {rest.src ? <img src={rest.src} alt='' className={showSidebar ? 'w-8 h-8' : 'w-7 h-7'} /> : <Icon className='w-7 h-7' />}
        </div>
        <span className={showLabel ? '' : 'block sm:hidden lg:block'}>{label}</span>
      </Link>
      {showSidebar ? null : <div className={`sidebar-item-shortLabel ${rest.active ? '!text-secondary' : 'top-[-7px]'}`}>{rest.shortLabel}</div>}
      {showSidebar && <NotifIndicator className='absolute top-[-5px] right-0' children={rest.notifCount} />}
    </div>
  )
}

function NotifIndicator({ children, className = '' }: any) {
  if (!children) return null
  return (
    <div className={`h-5 border text-gray-800 text-xs font-medium indicator-item badge badge-xs bg-secondary min-w-[20px] leading-[0.5] ${className}`}>
      {children}
    </div>
  )
}

export default SidebarLink
