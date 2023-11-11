import { useState } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import useIsOverflowX from '../../utils/hooks/useIsOverflowX'

function OverflowXContainer({ children, scrollStep = 200, className='gap-2' }: any) {
  const { ref, isOverflow } = useIsOverflowX()
  const [scrollLeft, setScrollLeft] = useState(0)
  const [touchStart, setTouchStart] = useState(0)

  const handleScrollRight = () => {
    const desiredScrollLeft = Math.min(ref.current.scrollLeft + scrollStep, ref.current.scrollWidth - ref.current.clientWidth)
    ref.current.scrollTo({ left: desiredScrollLeft, behavior: 'smooth' })
    setScrollLeft(desiredScrollLeft)
  }

  const handleScrollLeft = () => {
    const desiredScrollLeft = Math.max(ref.current.scrollLeft - scrollStep, 0)
    ref.current.scrollTo({ left: desiredScrollLeft, behavior: 'smooth' })
    setScrollLeft(desiredScrollLeft)
  }

  const handleTouchStart = (e: any) => {
    setTouchStart(ref.current.scrollLeft + e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: any) => {
    ref.current.scrollTo({ left: touchStart - e.targetTouches[0].clientX })
    setScrollLeft(touchStart - e.targetTouches[0].clientX)
  }

  return (
    <>
      {isOverflow && scrollLeft > 0 && (
        <button
          type='button'
          className='border border-gray-200 shadow-md btn btn-circle btn-ghost hover:btn-secondary hover:btn-outline hover:!text-white dark:hover:!text-gray-950 btn-xs'
          onClick={handleScrollLeft}
        >
          <HiChevronLeft className='w-4 h-4' />
        </button>
      )}
      <div ref={ref} className={`flex overflow-hidden ${className}`} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
        {children}
      </div>
      {isOverflow && ref.current?.scrollWidth > scrollLeft + (ref.current?.clientWidth || 0) && (
        <button
          type='button'
          className='border border-gray-200 shadow-md btn btn-circle btn-ghost hover:btn-secondary hover:btn-outline hover:!text-white dark:hover:!text-gray-950 btn-xs'
          onClick={handleScrollRight}
        >
          <HiChevronRight className='w-4 h-4' />
        </button>
      )}
    </>
  )
}

export default OverflowXContainer
