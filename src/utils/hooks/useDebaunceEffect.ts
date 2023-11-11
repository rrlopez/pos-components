import { useEffect } from 'react'

function useDebounceEffect(cb: any, { dependencies = [], delay = 500, setIsLoading = () => {} }: any) {
  useEffect(() => {
    setIsLoading(true)
    const handler = setTimeout(async () => {
      await cb()
      setIsLoading(false)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [...dependencies, delay])
}

export default useDebounceEffect
