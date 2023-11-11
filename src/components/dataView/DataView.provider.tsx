/* eslint-disable react/jsx-no-constructed-context-values */
import _, { get } from 'lodash'
import moment from 'moment'
import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import useEffectOnce from '../../utils/hooks/useEffectOnce'
import Loading from '../loading'
import createDataViewStore from './DataView.store'
import { searchWithOptions } from './_components/toolbar/SearchInput'
import ColumnDefinitions from './_components/view/dataTable/_components/ColumnDefinitions'

const DataViewContext = createContext({} as any)

export const useDataView = () => useContext(DataViewContext)

export const useDataViewStore = (selector: any, options?: any) => {
  const state = useContext(DataViewContext)
  return state.store?.(selector, options)
}

export default function DataViewProvider({ children, id, fetchOptions = {}, settings = {}, filters = {}, version, ...rest }: any) {
  id = id || rest.label
  const store:any = useRef(createDataViewStore(id, {version}))
  const [isLoaded, setIsLoaded] = useState(false)
  const storedID = store.current((state: any) => state.id)
  const onInit = store.current((state: any) => state.onInit)
  const isFetching = store.current((state: any) => state.isFetching)
  const setState = store.current((state: any) => state.setState)
  
  useEffectOnce(() => {
    setIsLoaded(true)
    let cols = [...get(rest, 'views.types.table.columnOptions')]
    cols.unshift(ColumnDefinitions.number)
    if (rest.selectableRow) cols.unshift(ColumnDefinitions.check)
    const viewType = rest.viewsKeys[0]
    
    if (!storedID) {
      onInit({
        ...settings,
        id,
        cols,
        columnVisibility: cols.reduce((obj: any, el: any) => ({ ...obj, [el.id]: !!el.visible })),
        columnOrder: cols.map((col: any) => col.id),
      })
    }

    setState((state: any) => {
      state.cols = state.cols.map((col: any) => _.merge(col, cols.find(({ id }: any) => id === col.id) || {}))
      state.viewType = viewType
      state.searchWith = searchWithOptions[0].value,
      state.groupBy = rest.groupable?.by || '',
      state.filters = Object.entries(filters).reduce((obj:any, [key, filter]:any)=>{
        if(!filter.value) return obj
        return {...obj, [key]:{regex: '#', name: 'equals',...filter}}
      }, {})
      Object.entries(settings).map((key:any, value:any)=>{
        state[key] = value
      })
    }, false)
  }, [storedID])

  const debounce = useCallback(
    _.debounce((state: any) => {
      setState(state)
    }, 300),
    [],
  )

  const handleSetState = (states: any, isDebounced = true) => {
    if (isDebounced) debounce(states)
    else setState(states)
  }

  const query = useQuery({
    queryKey: id,
    queryFn: async (args: any) => {
      const state = store.current.getState()
      const { skip, filters, searchWith, searchBy, searchValue, sortBy, sortDirection, limit, columnOrder, cols }: any = state

      args.options = {
        limit,
        skip: skip * limit,
        sort: sortBy.map((sort: any) => ({ key: sort, ...sortDirection[sort] })),
      }

      args.options.orderBy = {}
      args.options.sort.forEach((sort: any) => {
        _.set(args.options.orderBy, sort.key, sort.value)
      })

      const conditions: any = {}
      if (!rest.searchable?.localSearch && searchValue) {
        (searchBy.paths || [searchBy]).forEach((path: any) => {
          const { accessorKey, type, options=[], dependencies = [], searchFn = (searchValue:any)=>searchValue } = cols.find((col:any)=>col.id==path.id)
          const value = searchFn(searchValue)
          const name = typeof value==='object'? 'in': null 
          if (type === 'number') conditions[accessorKey] = { key: accessorKey, value, ...searchWith.number, type: typeof value==='object'? 'array': type, name: name || searchWith.number.name }
          else if (type === 'date') conditions[accessorKey] = { key: accessorKey, value, ...searchWith.number, type: typeof value==='object'? 'array': type, name: name || searchWith.number.name }
          else if (type === 'decimal') conditions[accessorKey] = { key: accessorKey, value, ...searchWith.number, type: typeof value==='object'? 'array': type, name: name || searchWith.number.name }
          else if (type === 'boolean') conditions[accessorKey] = { key: accessorKey, value, ...searchWith.boolean, type: typeof value==='object'? 'array': type, name: name || searchWith.boolean.name }
          else if (type === 'enum') {
            if(options.includes(searchValue)) conditions[accessorKey] = { key: accessorKey, value, ...searchWith.enum, type: typeof value==='object'? 'array': type, name: name || searchWith.enum.name }
          }
          else conditions[accessorKey] = { key: accessorKey, value, ...searchWith.string, type: typeof value==='object'? 'array': type, name: name || searchWith.string.name }

          dependencies.forEach((dependency: any) => {
            if (type === 'number') conditions[dependency] = { key: dependency, value: searchValue, ...searchWith.number, type }
            else if (type === 'date') conditions[dependency] = { key: dependency, value: searchValue, ...searchWith.number, type }
            else if (type === 'decimal') conditions[dependency] = { key: dependency, value: searchValue, ...searchWith.number, type }
            else if (type === 'boolean') conditions[dependency] = { key: dependency, value: searchValue, ...searchWith.boolean, type }
            else if (type === 'enum') {
              if(options.includes(searchValue)) conditions[dependency] = { key: dependency, value: searchValue, ...searchWith.enum, type }
            }
            else conditions[dependency] = { key: dependency, value: searchValue, ...searchWith.string, type }
          })
        })
      }

      
      const convertToWhereClause = (conditions:any)=>{
        const whereClause = {}
        Object.values(conditions).forEach((item: any) => {
          if (item.length > 0) _.set(whereClause, `${item[0].key.split('.').join('.is.')}`, {[item[0].key]:item.reduce((obj:any, item: any) => ({...obj, [item.name]: item.value}), {})})
  
          if (!item.key) return
          if(item.type === 'array') _.set(whereClause, `${item.key.replaceAll('.', '->')}[${item.key.split('.').join('.is.')}]`, { [item.name]: item.value })
          else{
            let value: any = item.value + ''
            if (item.type === 'number') {
              value = parseInt(value, 10)
              if (!Number.isNaN(value))
                _.set(whereClause, `${item.key.replaceAll('.', '->')}[${item.key.split('.').join('.is.')}]`, { [item.name]: value })
            } else if (item.type === 'decimal') {
              value = parseFloat(value)
              if (!Number.isNaN(value))
                _.set(whereClause, `${item.key.replaceAll('.', '->')}[${item.key.split('.').join('.is.')}]`, { [item.name]: value + '' })
            } else if (item.type === 'date') {
              if(!value) _.set(whereClause, `${item.key.replaceAll('.', '->')}[${item.key.split('.').join('.is.')}]`, { [item.name]: '' })
              else if ((Number.isNaN(value) || typeof value === 'string') && moment(value).isValid()) {
                const lt = moment(value, true)
                  .add(1, 'day')
                  .format()
                if (lt !== 'Invalid date') _.set(whereClause, `${item.key.replaceAll('.', '->')}[${item.key.split('.').join('.is.')}]`, { gte: value, lt })
              }
            } else if (item.type === 'boolean') {
              value = value.toLowerCase()
              if (value === 'true' || value === 'false')
                _.set(whereClause, `${item.key.replaceAll('.', '->')}[${item.key.split('.').join('.is.')}]`, {
                  [item.name]: value === 'true' ? true : false,
                })
            } else _.set(whereClause, `${item.key.replaceAll('.', '->')}[${item.key.split('.').join('.is.')}]`, { [item.name]: value })
          }
        }, {})
        return whereClause
      }

      args.options.filters = convertToWhereClause(filters)
      args.options.conditions = convertToWhereClause(conditions)
      
      args.options.fields = columnOrder
        .filter((id: any) => id[0] !== '_')
        .reduce((obj: any, id: any) => {
          const { accessorKey, dependencies = [] }: any = cols.find((col: any) => col.id === id) || {}
          const a = accessorKey ? [accessorKey, ...dependencies] : dependencies
          return { ...obj, ...a.reduce((obj: any, item: any) => ({ ...obj, [item]: true }), {}) }
        }, {})

      let { items = [], totalItems = 0, payload, ...options } = (await rest.onFetchData({ ...state, ...args })) || {
        totalItems: 0,
        items: [],
      }

      setState((state: any) => {
        state.isFetching = false
        state.payload = payload
        state.totalItems = totalItems
        if(rest.selectableRow?.AllSelected) state.rowSelection = items.reduce((obj:any, _el:any, i:any)=>({...obj, [i]: true}), {})

        Object.entries(options).forEach(([key, value]) => {
          state[key] = value
        })
      }, false)

      return { items, totalItems }
    },
    onError: () => {
      setState({ items:[], totalItems: 0 }, false)
    },
    refetchOnWindowFocus: false,
    ...fetchOptions
  })

  return (
    <DataViewContext.Provider key={storedID} value={{ ...rest, store: store.current, id, setState: handleSetState, ...query, isFetching: isFetching || query.isFetching }}>
      {isLoaded ? children : <Loading />}
    </DataViewContext.Provider>
  )
}
