import _ from 'lodash'
import { useCallback, useMemo } from 'react'
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2'
import { timeout } from '../../../../utils'
import { Select2Input } from '../../../forms/Select2Input'
import { SelectInput } from '../../../forms/SelectInput'
import { TextInput } from '../../../forms/TextInput'
import { useDataView } from '../../DataView.provider'

export const searchWithOptions = [
  {
    label: 'Contains',
    value: { key: 'contains', string: { regex: '#', name: 'contains' }, number: { regex: '#', name: 'equals' }, boolean: { regex: '#', name: 'equals' }, enum: { regex: '#', name: 'equals' } },
  },
  {
    label: 'Starts with',
    value: { key: 'startsWith', string: { regex: '^#', name: 'startsWith' }, number: { regex: '^#', name: 'gte' }, boolean: { regex: '#', name: 'equals' }, enum: { regex: '#', name: 'equals' } },
  },
  {
    label: 'Ends with',
    value: { key: 'endsWith', string: { regex: '#$', name: 'endsWith' }, number: { regex: '#$', name: 'lte' }, boolean: { regex: '#', name: 'equals' }, enum: { regex: '#', name: 'equals' } },
  },
  {
    label: 'Exact',
    value: { key: 'equals', string: { regex: '', name: 'equals' }, number: { regex: '', name: 'equals' }, boolean: { regex: '#', name: 'equals' }, enum: { regex: '#', name: 'equals' } },
  },
]

function SearchInput({ className = 'grow' }: any) {
  const { searchable, setState, store, refetch } = useDataView()
  const table = store((state: any) => state.table)
  if (!searchable) return null
  const searchWith = store((state: any) => state.searchWith)
  const searchBy = store((state: any) => state.searchBy)
  const searchValue = store((state: any) => state.searchValue)
  let cols = table.getVisibleFlatColumns()

  const searchKeys = useMemo(() => {
    if (!cols) return []
    cols = cols.filter(({ columnDef }: any) => columnDef.filterable ?? true) || []
    const searchKeys = [
      {
        header: 'All',
        accessorKey: 'All',
        paths: cols.map(({ id, columnDef: { accessorKey, type, options, dependencies, searchFn } }: any) => ({ id, accessorKey, type, options, dependencies, searchFn })),
      },
      ...cols.map(({ id, columnDef }: any) => ({ id, ...columnDef })),
    ].map(({ accessorKey, header, ...rest }: any) => ({ label: header, value: { label: header, path: accessorKey, ...rest } }))
    if (searchBy.paths?.length < 1 || !searchKeys.some(({ label }: any) => label === searchBy.label))
      timeout(()=>setState({ searchBy: (searchKeys.find(({ label }: any) => label === searchable?.defaultValue) || searchKeys[0]).value }, false), 150)
    return searchKeys
  }, [cols?.length])

  const debouncedSearchValueChange = useCallback(_.debounce(()=>{
    if (!searchable.localSearch) refetch()
    table.setRowSelection(() => ({}))
  }, 500), [table]) 

  const handleSearchValueChange = ({ target }: any) => {
    setState({ searchValue: `${target.value}` }, false)
    debouncedSearchValueChange()
  }

  const handleSearchByChange = ({ target }: any) => {
    setState({ searchBy: target.value }, false)
    if (!searchable.localSearch) refetch()
    table.setRowSelection(() => ({}))
  }

  const handleSearchWithChange = ({ target }: any) => {
    setState({ searchWith: target.value }, false)
    if (!searchable.localSearch) refetch()
    table.setRowSelection(() => ({}))
  }

  const handleSearch = () => {
    handleSearchValueChange({ target: { value: searchValue } })
  }

  const handleClear = () => {
    handleSearchValueChange({ target: { value: '' } })
  }

  return (
    <div className={`form-control ${className}`}>
      <div className='flex gap-2'>
        <Select2Input
          className='w-16 sm:w-44 select select-sm select-bordered'
          by='label'
          value={searchBy?.label}
          onChange={handleSearchByChange}
          options={searchKeys}
          allowNull={false}
        />
        <div className='input-group'>
          <SelectInput
            by='key'
            className='w-24 sm:w-32 select select-sm select-bordered'
            value={searchWith}
            onChange={handleSearchWithChange}
            options={searchWithOptions}
            allowNull={false}
          />
          <TextInput
            type='text'
            placeholder='Search…'
            value={searchValue}
            onChange={handleSearchValueChange}
            style={{ borderRadius: 0 }}
            className='w-full input input-bordered input-sm'
            suffix={
              <HiXMark
                className={`w-4 h-4 text-gray-400 dark:text-white cursor-pointer hover:text-gray-800 dark:hover:text-gray-400 ${searchValue ? '' : 'hidden'}`}
                onClick={handleClear}
              />
            }
            mui={false}
          />
          <button type='button' className='btn btn-square btn-sm btn-success' onClick={handleSearch}>
            <HiMagnifyingGlass className='w-6 h-6' />
          </button>
        </div>
      </div>
    </div>
  )
}
export default SearchInput
