import _ from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
// Define general type for useWindowSize hook, which includes width and height
interface Size {
  width: number | undefined
  height: number | undefined
}

// Hook
function useWindowSize(container: any = '', dependencies: any = [], throttleDelay = 750): Size {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const item: any = useRef()
  const [windowSize, setWindowSize] = useState<Size>({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    if (container.current) item.current = container.current
    else if (container) item.current = document.querySelector(container)
    else item.current = window
  }, [container])

  const throttle = useCallback(
    _.throttle((state: any) => {
      setWindowSize(state)
    }, throttleDelay),
    [],
  )

  useEffect(() => {
    if (!item.current) return
    throttle({
      oldWidth: windowSize.width || 0,
      oldHeight: windowSize.height || 0,
      width: item.current.clientWidth,
      height: item.current.clientHeight,
    })
  }, dependencies)

  useEffect(() => {
    if (!item.current) return () => null
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state

      throttle({
        oldWidth: windowSize.width || 0,
        oldHeight: windowSize.height || 0,
        width: item.current.clientWidth || item.current.innerWidth,
        height: item.current.clientHeight || item.current.innerHeight,
      })
    }
    // Add event listener
    window.addEventListener('resize', handleResize)
    // Call handler right away so state gets updated with initial window size
    handleResize()
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [item.current]) // Empty array ensures that effect is only run on mount
  return windowSize
}

export default useWindowSize
