import { useEffect, useRef } from 'react'

function useEffectOnce(callback: any, dependencies:any = []) {
  const isMounted = useRef(false)

  useEffect(() => {
    if (isMounted.current) return
    isMounted.current = true
    return callback()
  }, dependencies)

  return isMounted.current
}

export default useEffectOnce
