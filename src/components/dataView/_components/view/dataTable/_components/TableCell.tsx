import { useDataView } from '../../../../DataView.provider'

function TableCell({ getValue, cell }: any) {
  const { searchable = {}, store } = useDataView()
  let value =  getValue()
  if (!searchable.highlight) return value
  const searchValue = store((state: any) => state.searchValue)
  const searchBy = store((state: any) => state.searchBy)
  if (typeof value === 'object' || value === undefined) return value

  value = `${value}`
  if (!searchValue || !value || (!searchBy.paths && cell.column.id !== searchBy.id)) return value

  const index = value.toLowerCase().indexOf(searchValue.toLowerCase())
  if (index < 0) return value
  return (
    <>
      {value.substring(0, index)}
      <mark className='px-0.5 rounded-sm bg-brandPrimary-300 dark:bg-brandSecondary-300'>{value.substring(index, index + searchValue.length)}</mark>
      {value.substring(index + searchValue.length)}
    </>
  )
}

export default TableCell
