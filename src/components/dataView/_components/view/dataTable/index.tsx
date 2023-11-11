import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useDataView } from '../../../DataView.provider'
import TableCell from './_components/TableCell'
import TableContent from './_components/TableContent'

function DataTable(props: any) {
  const { data = {}, isFetching, error, store, setState, searchable={} } = useDataView()
  let cols = store((state: any) => state.cols)
  const limit = store((state: any) => state.limit)
  const skip = store((state: any) => state.skip)
  const columnVisibility = store((state: any) => state.columnVisibility)
  const columnOrder = store((state: any) => state.columnOrder)
  const rowSelection = store((state: any) => state.rowSelection)
  const sorting = store((state: any) => state.sorting)
  const searchValue = store((state: any) => state.searchValue)
  const searchBy = store((state: any) => state.searchBy)

  cols = cols.map(({columnFn = ()=>({}), ...col}: any)=>({ ...col, columnFn: columnFn() }))
  cols = useMemo(() => {
    if (isFetching) return cols.map((col: any) => ({ ...col, accessorFn: null, cell: () => <Skeleton /> }))
    return cols.map((col: any) => ({ cell: (props: any) => <TableCell {...props} />, ...col }))
  }, [cols, isFetching])

  const items = useMemo(() => {
    if (isFetching) return [...Array(10)].map(() => ({}))
    return data.items || []
  }, [data.items, isFetching])
  
  const state: any = {
    columnOrder,
    sorting,
    rowSelection,
    columnVisibility,
    pagination: {
      pageSize: limit,
      pageIndex: skip,
    },
  }

  if(searchable.localSearch){
    if (searchBy.id) state.columnFilters = [{ id: searchBy.id, value: searchValue }]
    else state.globalFilter = searchValue
  }
  
  let table = useReactTable({
    data: items,
    columns: cols,
    columnResizeMode: 'onChange',
    pageCount: Math.ceil(data.totalItems/limit),
    state,
    enableRowSelection: true,
    autoResetPageIndex: false,
    manualPagination: true,
    onColumnVisibilityChange: (setColumnVisibility: any) => {
      setState({ columnVisibility: setColumnVisibility(columnVisibility) }, false)
    },
    onRowSelectionChange: (setRowSelection: any) => {
      setState({ rowSelection: setRowSelection(rowSelection) }, false)
    },
    onSortingChange: (setSorting: any) => {
      setState({ sorting: setSorting(sorting) }, false)
    },
    onColumnOrderChange: (columnOrder: any) => {
      setState({ columnOrder }, false)
    },
    onPaginationChange: (setPagination: any) => {
      const pagination = setPagination({ pageSize: limit, pageIndex: skip })
      setState({ limit: pagination.pageSize, skip: pagination.pageIndex }, false)
    },
    onGlobalFilterChange: (setSearchValue: any) => {
      setState({ searchValue: setSearchValue(searchValue) }, false)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: true,
  })

  table.getCenterTotalSize()
  
  setState({ table: {...table}, totalItems: data.totalItems })

  return <TableContent table={table} error={error} {...props}/>
}


export default DataTable
