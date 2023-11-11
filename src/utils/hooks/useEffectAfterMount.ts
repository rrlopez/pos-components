import _ from 'lodash'
import { useCallback, useEffect, useRef } from 'react'

function useEffectAfterMount(callback: any, dependencies: any = null) {
  const isMounted = useRef(false)

  const debounce = useCallback(
    _.debounce(() => {
      isMounted.current = true
    }, 150),
    [],
  )

  useEffect(() => {
    if (isMounted.current) callback()
    else debounce()
  }, dependencies)
}

export default useEffectAfterMount
