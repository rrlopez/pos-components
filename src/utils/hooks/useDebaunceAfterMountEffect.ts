import { useEffect, useRef } from 'react'

let timer: any = null
let handler: any = null

function useDebaunceAfterMountEffect(callback: any, { dependencies = [], delay = 500 }) {
  const isMounted = useRef(false)

  useEffect(() => {
    if (isMounted.current) {
      clearTimeout(handler)
      handler = setTimeout(async () => {
        await callback()
        clearTimeout(handler)
      }, delay)
    } else {
      timer = clearTimeout(timer)
      timer = setTimeout(() => {
        isMounted.current = true
      }, 500)
    }
  }, [...dependencies, delay])
}

export default useDebaunceAfterMountEffect
