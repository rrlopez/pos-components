/* eslint-disable consistent-return */
import _ from 'lodash'
import { useCallback, useLayoutEffect, useRef } from 'react'

function useResizeObserver<T extends HTMLElement>(callback: (target: T, entry: ResizeObserverEntry) => void, delay = 750) {
  const ref = useRef<T>(null)

  const throttle = useCallback(
    _.throttle((element: any, entry: any) => {
      callback(element, entry)
    }, delay),
    [],
  )

  useLayoutEffect(() => {
    const element = ref?.current

    if (!element) {
      return
    }

    const observer = new ResizeObserver(entries => {
      throttle(element, entries[0])
    })

    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [callback, ref])

  return ref
}

export default useResizeObserver
