import { useDataView } from '../../DataView.provider'

function FilterSelectInput({ label, name, options, type }: any) {
  const { setState, refetch, store } = useDataView()
  const filters = store((state: any) => state.filters)

  const handleChange = ({ target }: any) => {
    setState((state: any) => {
      if (target.value) state.filters[name] = { key: name, value: parseInt(target.value, 10) || target.value, regex: '#', name: 'equals', type }
      else delete state.filters[name]
    }, false)
    refetch()
  }

  return (
    <div className='form-control'>
      <label className='input-group input-group-xs '>
        <span className='text-xs font-normal bg-secondary text-gray-950'>{label}</span>
        <select className='select select-bordered select-xs ' value={filters[name]?.value} onChange={handleChange}>
          <option value=''>All</option>
          {options.map(({ label, value }: any) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default FilterSelectInput
