import pluralize from 'pluralize'
import { useDataView } from '../../DataView.provider'

function SelectedRowCount() {
  const { selectableRow, store, isFetching } = useDataView()
  if (!selectableRow) return null
  const table = store((state: any) => state.table)
  if (!table || isFetching) return null
  
  const { rows } = table.getSelectedRowModel()

  if (!rows.length) return null
  if (selectableRow.Info) return <selectableRow.Info data={rows}/>
  return <>{`${rows.length} ${pluralize('Record', rows.length)} Selected`}</>
}

export default SelectedRowCount
