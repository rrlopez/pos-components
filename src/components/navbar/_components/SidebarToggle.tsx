import { useDashboard } from '../../dashboard/Dashboard.provider'

function SidebarToggle() {
  const { setShowSidebar, showSidebar } = useDashboard()

  const handleClick = () => {
    setShowSidebar(!showSidebar)
  }

  return (
    <div className='flex text-white btn btn-square btn-ghost hover:text-secondary hover:bg-white/10 sm:hidden' onClick={handleClick}>
      <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' className='inline-block w-5 h-5 stroke-current'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />
      </svg>
    </div>
  )
}

export default SidebarToggle
