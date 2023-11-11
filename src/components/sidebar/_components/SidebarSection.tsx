import { useDashboard } from '../../dashboard/Dashboard.provider'
import { PopoverItem } from './SidebarGroupLinks'

export function SidebarSection(props: any) {
  if (!props.children) return null

  const { showSidebar } = useDashboard()
  if (!showSidebar) return <PopoverItem {...props} />

  return (
    <div className='mt-2 mb-4'>
      <div className='sidebar-label'>{props.label}</div>
      {props.children}
    </div>
  )
}

export default SidebarSection
