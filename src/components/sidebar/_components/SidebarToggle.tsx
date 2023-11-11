import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useDashboard } from '../../dashboard/Dashboard.provider'

function SidebarToggle() {
  const { setShowSidebar, showSidebar } = useDashboard()

  const handleClick = () => {
    setShowSidebar(!showSidebar)
  }

  return (
    <div className={`relative w-full px-1 hidden lg:flex  ${showSidebar ? 'justify-end' : 'justify-center'}`}>
      <button
        type='button'
        className='absolute flex capitalize btn btn-circle hover:text-secondary tooltip tooltip-title tooltip-right right-[-20px] btn-sm btn-accent text-white border-base-200 border-[3px] hover:border-base-200'
        onClick={handleClick}
        data-tip={showSidebar ? 'collapse' : 'expand'}
      >
        {showSidebar ? <FaArrowLeft className='w-5 h-5' /> : <FaArrowRight className='w-5 h-5' />}
      </button>
    </div>
  )
}

export default SidebarToggle
