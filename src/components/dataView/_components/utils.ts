import { filter, get, orderBy } from 'lodash'

// Sorting
export const getLocalSortedData = (originalData: any, { sortDirection }: any) => {
  const keys = Object.keys(sortDirection).map(key => key)
  const values: any = Object.values(sortDirection).map(({ value }: any) => value.toLowerCase())
  return orderBy(originalData, keys, values)
}

// Filtering
export const getLocalSearchedData = (originalData: any, { searchValue, searchBy, searchWith }: any) => {
  if (!searchValue) return originalData
  const paths = searchBy.paths || [searchBy.path]
  if (searchWith) {
    return filter(originalData, obj => paths.some((path: any) => new RegExp(searchWith[path.type || 'string'].regex.replace('#', searchValue), 'i').test(get(obj, path.accessorKey || path))))
  }
  return filter(originalData, obj => paths.some((path: any) => get(obj, path.accessorKey || path) === searchValue))
}

export const getLocalColFilteredData = (originalData: any, { cols }: any) => {
  cols.forEach(({ accessorKey, filters = [], filterableColumn = {} }: any) => {
    if (!filterableColumn.localFilter || filters.length < 1) return
    originalData = filter(originalData, obj => {
      const value = get(obj, accessorKey)
      return filters.some((filter: any) => filter.value === value)
    })
  })

  return originalData
}

export const getLocalFilteredData = (originalData: any, options: any) => {
  originalData = getLocalSearchedData(originalData, options)
  originalData = getLocalColFilteredData(originalData, options)
  originalData = getLocalSortedData(originalData, options)
  return originalData
}
