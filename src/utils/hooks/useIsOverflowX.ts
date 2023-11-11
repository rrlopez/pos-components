import { useLayoutEffect, useRef, useState } from 'react'
import useWindowSize from './useWIndowSize'

const useIsOverflowX = () => {
  const [isOverflow, setIsOverflow] = useState(false)
  const windowSize = useWindowSize()
  const ref = useRef() as any

  useLayoutEffect(() => {
    if (ref.current) setIsOverflow(ref.current.scrollWidth > ref.current.clientWidth)
  }, [windowSize.width])

  return { ref, isOverflow }
}

export default useIsOverflowX
