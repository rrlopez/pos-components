import { useEffect, useState } from 'react'

const useInterval = (cb: any, dependency: any) => {
  const [values, setValue] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(cb)
    }, dependency)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return values
}

export default useInterval
