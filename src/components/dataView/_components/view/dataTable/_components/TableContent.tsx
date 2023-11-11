import { flexRender } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import Empty from '../../../../../empty'
import Error from '../../../../../error'
import { useDataView } from '../../../../DataView.provider'
import TableColumn from './TableColumn'
import { useDataViewTableWidth, useStickyTableColumn } from './utils'

function TableContent({ table, error, className='mx-auto', containerClass='border rounded-lg border-base-300 dark:border-base-100', isFullWidth=true, ...props }: any) {
  const { store, freezable } = useDataView()
  const skip = store((state: any) => state.skip)
  const limit = store((state: any) => state.limit)
  const columnOrder = store((state: any) => state.columnOrder)
  const { rows } = table.getPaginationRowModel()
  const cols = table.getVisibleFlatColumns()

  const { tableContainerRef, getTableWidth }:any = useDataViewTableWidth({isFullWidth, ...props})

  const {activeStickyIndexRef, stickyIndexes, isSticky, rangeExtractor} = useStickyTableColumn({columnOrder, cols, freezable, table})

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 45,
    overscan: 20,
  })

  const colVirtualizer = useVirtualizer({
    horizontal: true,
    count: cols.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 100,
    rangeExtractor,
    overscan: 7,
    measureElement: (el)=>{
      const index:any = el.getAttribute('data-index')
      return cols[index].getSize()
    }
  })

  const rowVirtualItems = rowVirtualizer.getVirtualItems()
  const rowTotalSize = rowVirtualizer.getTotalSize()
  const paddingBottom = rowVirtualItems.length > 0 ? rowTotalSize - (rowVirtualItems?.[rowVirtualItems.length - 1]?.end || 0) : 0
  const paddingTop = rowVirtualItems.length > 0 ? rowVirtualItems?.[0]?.start || 0 : 0
  
  
  const colVirtualItems = colVirtualizer.getVirtualItems()
  const colTotalSize = colVirtualizer.getTotalSize()
  let paddingRight = colVirtualItems.length > 0 ? colTotalSize - (colVirtualItems?.[colVirtualItems.length - 1]?.end || 0) : 0
  const paddingLeft = (()=>{
    if(colVirtualItems.length < 1) return 0
    const col:any = colVirtualItems.find((col)=>!activeStickyIndexRef.current.includes(col.index))
    if(!col) return 0
    let offset = 0;

    ([...Array(colVirtualItems.indexOf(col)).keys()]).forEach((colIndex:any, )=>{
      const index = activeStickyIndexRef.current.find((index:any)=>index === colIndex)
      if(!colVirtualItems[index]) return
      offset = offset+colVirtualItems[index].end
    })

    return col.start-offset
  })()
  
  const centerTotalSize = getTableWidth(colTotalSize) || table.getCenterTotalSize()

  return (
    <div ref={tableContainerRef} className={`flex flex-col overflow-auto grow ${containerClass}`} style={isFullWidth?{}:{ width: centerTotalSize+5}}>
      <table className={`relative table w-full text-center table-fixed table-compact table-zebra bg-base-100 ${className}`} style={{ width: centerTotalSize-5, height: rowVirtualizer.getTotalSize()}}>
        <thead className='sticky top-0 z-20 '>
          {table.getHeaderGroups().map((headerGroup: any) => {
            const {headers} = headerGroup
            return (
              <tr key={headerGroup.id} >
                {paddingLeft > 0 && <th className='!relative' style={{ width: paddingLeft }} /> }
                {colVirtualItems.map((virtualCol: any, i) => {
                  const header = headers[virtualCol.index]
                  let className = 'p-0 px-1 bg-zinc-300 dark:text-gray-400 dark:bg-zinc-900'
                  let style: any = { width: header.getSize() }
                  const isFreezable = (freezable && header.column.columnDef.freezable) || header.column.columnDef.freezable?.permanent
                  
                  if(isFreezable){
                    let left = 0, offset=0
                    const index = stickyIndexes.indexOf(virtualCol.index)
                    for(let x = 0; x<index;x++){ left+=headers[stickyIndexes[x]].getSize()}
                    for(let x = 0; x<i-1;x++){ 
                      offset+=headers[x].getSize()
                    }

                    style = {...style, left, ...(isSticky(virtualCol.index) ? { zIndex: 15, position: 'sticky' } : {})}
                    if(colVirtualizer.scrollOffset > offset) className=`${className} bg-base-300 border-r-1 border-base-200`
                  }

                  return (
                    <th key={header.id} data-index={virtualCol.index} colSpan={header.colSpan} className={`relative group font-medium text-xs ${className} ${virtualCol.index===0?'cursor-pointer': ''}`} style={style} onClick={virtualCol.index===0?table.getToggleAllRowsSelectedHandler():null}>
                      <TableColumn header={header} table={table} />
                    </th>
                  )
                })}
                {paddingRight > 0 && <th style={{ width: paddingRight }} />}
              </tr>
            )
          })}
        </thead>
        <tbody>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: paddingTop }} />
            </tr>
          )}
          {rowVirtualItems.map(virtualRow => {
            const row = rows[virtualRow.index]
            const cells = row.getVisibleCells()

            return (
              <tr key={row.id} ref={rowVirtualizer.measureElement} data-index={virtualRow.index} className='relative hover' onDoubleClick={row.getToggleSelectedHandler()}>
                {paddingLeft > 0 && <td style={{ width: paddingLeft }} />}
                {colVirtualItems.map((virtualCol, i) => {
                  const cell = cells[virtualCol.index]
                  let style: any = {}
                  let className = cell.column.columnDef.className || ''
                  
                  if((freezable && cell.column.columnDef.freezable) || cell.column.columnDef.freezable?.permanent){
                    let left = 0, offset=0
                    const index = stickyIndexes.indexOf(virtualCol.index)
                    for(let x = 0; x<index;x++){ left+=cells[stickyIndexes[x]].column.getSize() }
                    for(let x = 0; x<i-1;x++){ 
                      offset+=cells[x].column.getSize()
                    }
                    style = {...style, left, ...(isSticky(virtualCol.index) ? { zIndex: 1, position: 'sticky' } : {})}

                    if(colVirtualizer.scrollOffset > offset) className=`${className} border-r-1 border-base-200 ${virtualRow.index%2===0?'bg-base-200':'!bg-base-300'}`

                  }

                  return (
                    <td key={cell.id} ref={colVirtualizer.measureElement} data-index={virtualCol.index} className={`${className} ${virtualCol.index===0?'cursor-pointer': ''}`} style={style} onClick={virtualCol.index===0?row.getToggleSelectedHandler():null}>
                      {flexRender(cell.column.columnDef.cell, { ...cell.getContext(), i: virtualRow.index + limit*skip, ...cols[virtualCol.index].columnDef.columnFn})}
                    </td>
                  )
                })}
                {paddingRight > 0 && <td style={{ width: paddingLeft }} />}
              </tr>
            )
          })}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: paddingBottom }} />
            </tr>
          )}
        </tbody>
      </table>
      {error?<Error className='sticky left-0 w-full py-6 grow bg-base-100'/>:
      rows.length < 1 ? <Empty className='sticky left-0 w-full py-6 grow bg-base-100' /> : 
      null}
    </div>
  )
}

export default TableContent