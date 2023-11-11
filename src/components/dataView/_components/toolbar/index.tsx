import { useDataView } from '../../DataView.provider'
import CustomRange from './CustomRange'
import EditColumn from './EditColumn'
import ImportExportButton from './ImportExportButton'
import RefreshButton from './RefreshButton'
import SearchInput from './SearchInput'
import SelectedRowCount from './SelectedRowCount'

function Toolbar() {
  const { label, searchable, toolbar = {}, Settings = () => null } = useDataView()
  const { className = 'px-2 py-2 sm:px-4', children = null, toolbarProps } = toolbar

  return (
    <>
      <div {...toolbarProps} className={`dataview-toolbar ${className} bg-base-100 rounded-lg`}>
        {children}
        <div className='flex items-center w-full gap-2 sm:py-2'>
          {label && <h1 className='text-xl font-semibold'>{label}</h1>}

          <div className='flex flex-wrap items-center gap-2 grow'>
            <div className='flex flex-wrap items-center gap-2 grow'>
              <RefreshButton />
              <Settings />
            </div>
            <div className='empty:hidden grow '>
              <SearchInput />
            </div>
          </div>
        </div>
        <div className='flex items-center w-full gap-2 '>
          <div className='pt-2 grow sm:pt-0'>
            <SelectedRowCount />
          </div>
          {searchable && (
            <div className='flex items-center gap-2 pt-2 sm:pt-0'>
              <ImportExportButton />
              <EditColumn />
              <CustomRange />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
export default Toolbar
