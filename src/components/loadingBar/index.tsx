/* eslint-disable import/no-named-default */
import { useEffect, useRef } from 'react'
import { default as BaseLoadingBar } from 'react-top-loading-bar'
import { timeout } from '../../utils'
import useLoadingBar from './LoadingBar.store'

function LoadingBar() {
  const setState = useLoadingBar((state: any) => state.setState)
  const nextPathname = useLoadingBar((state: any) => state.nextPathname)
  const prevPathname = useLoadingBar((state: any) => state.prevPathname)
  const ref: any = useRef(null)

  useEffect(() => {
    if (nextPathname !== prevPathname) {
      ref.current.continuousStart(0)
      setState({ prevPathname: nextPathname })
    }
    if (document.readyState === 'complete') {
      timeout( ref.current?.complete , 500)
    }
  }, [nextPathname, document.readyState])

  return <BaseLoadingBar ref={ref} waitingTime={400} color='' className='bg-secondary' />
}

export default LoadingBar
