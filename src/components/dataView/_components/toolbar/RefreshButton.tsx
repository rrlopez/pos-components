import { HiArrowPath } from 'react-icons/hi2'
import useMediaQuery from '../../../../utils/hooks/useMediaQuery'
import { useDataView } from '../../DataView.provider'

function RefreshButton({ show, className = 'flex gap-1 capitalize rounded-full btn-secondary btn btn-xs text-gray-950' }: any) {
  let { refreshable, refetch, isFetching, store } = useDataView()
  refreshable = refreshable || show
  if (!refreshable) return null
  const isDesktop = useMediaQuery('md')

  const handleRefresh = async () => {
    const {setState} = store.getState()
    setState({isFetching: true})
    await refreshable.onClick?.()
    refetch()
  }

  return (
    <button type='button' className={`${className} ${isDesktop ? '' : 'btn-square'}`} {...refreshable} onClick={handleRefresh} disabled={isFetching}>
      <HiArrowPath className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
      {isDesktop && 'Refresh'}
    </button>
  )
}
export default RefreshButton
