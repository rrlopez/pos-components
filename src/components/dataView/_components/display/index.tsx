import { getTypes } from '../../../../utils'
import DefaultDisplay from './DefaultDisplay'
import Paginate from './Paginate'

const displayTypes = {
  default: DefaultDisplay,
  paginate: Paginate,
}
const IDisplayTypes = getTypes(displayTypes)
type IDisplayTypes = keyof typeof IDisplayTypes

function DataViewDisplay({ display }: any) {
  const SelectedDisplay: any = displayTypes[display.type as IDisplayTypes]

  return (
    <div className='relative flex flex-col w-full gap-2 overflow-hidden grow'>
      <SelectedDisplay {...display} />
    </div>
  )
}

export default DataViewDisplay
