import { getTypes } from '../../../../utils'
import { useDataView } from '../../DataView.provider'
import DataTable from './dataTable'

const types = {
  table: DataTable,
}
const ITypes = getTypes(types)
type ITypes = keyof typeof ITypes

function DataViewContainer(props: any) {
  const { views, store } = useDataView()
  const viewType = store((state: any) => state.viewType)

  const SelectedView: any = types[viewType as ITypes]
  const { Header = () => null, Footer = () => null, ...rest } = views.types[viewType]

  return (
    <>
      <Header />
      <SelectedView {...rest} {...props} />
      <Footer />
    </>
  )
}

export default DataViewContainer
