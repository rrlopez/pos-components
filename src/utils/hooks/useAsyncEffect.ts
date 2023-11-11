import { useEffect } from 'react'

const useAsyncEffect = (callback: any, dependency: any) => {
  useEffect(() => {
    callback()
  }, dependency)
}
export default useAsyncEffect
