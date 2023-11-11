import { useEffect, useState } from 'react'
import { getTypes } from '../index'

export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
}

const IBreakpoints = getTypes(breakpoints)
type IBreakpoints = keyof typeof IBreakpoints

const useMediaQuery = (breakpoint: IBreakpoints) => {
  const [matches, setMatches] = useState(undefined)

  useEffect(() => {
    const media: any = window.matchMedia(breakpoints[breakpoint] || breakpoint)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener)
  }, [matches, breakpoint])

  return matches
}

export default useMediaQuery
