import { ColumnOrderState, flexRender } from '@tanstack/react-table'
import _ from 'lodash'
import { useLayoutEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { AiFillPushpin, AiOutlinePushpin } from 'react-icons/ai'
import { RiDraggable } from 'react-icons/ri'
import { RxCaretDown, RxCaretUp } from 'react-icons/rx'
import { useDataView } from '../../../../DataView.provider'

const reorderColumn = (draggedColumnId: string, targetColumnId: string, columnOrder: string[]): ColumnOrderState => {
  columnOrder.splice(columnOrder.indexOf(targetColumnId), 0, columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string)
  return [...columnOrder]
}

const TableColumn = ({ header, ...props }: any) => {
  return (<>
    <PinIndicator header={header}/>
    <DragHandle {...{ header, ...props }}>
      <SortIndicator header={header}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</SortIndicator>
      <ResizeButton header={header} />
    </DragHandle>
  </>)
}

const onResize = _.debounce(callback => {
  callback()
}, 300)

function ResizeButton({ header }: any) {
  const { resizable, setState } = useDataView()
  const size = header.column.getSize()
  const { columnDef } = header.column
  if (!resizable || !(columnDef.resizable ?? true)) return null

  useLayoutEffect(() => {
    onResize(() => {
      setState((state: any) => {
        const col = state.cols.find(({ id }: any) => id === header.column.id)
        const index = state.cols.indexOf(col)
        _.set(state.cols[index], 'size', size)
        _.set(state.cols[index], 'style.minWidth', size)
      })
    })
  }, [size])

  return (
    <button
      {...{
        onPointerDown: header.getResizeHandler(),
        onTouchStart: header.getResizeHandler(),
        className: `absolute right-[-8px] z-10 w-3 cursor-ew-resize h-3/4 flex justify-center`,
      }}
    >
      <div className='block h-full border-l border-gray-400 dark:border-gray-600'></div>
    </button>
  )
}

function SortIndicator({ header, children }: any) {
  const { sortable, refetch, store, setState } = useDataView()
  const { columnDef } = header.column
  if (!sortable || !(columnDef.sortable ?? true)) return children

  const handleSort = (e:any)=>{
    const {table, sortDirection, }:any = store.getState()
    const sort = header.column.getToggleSortingHandler()
    sort(e)
    table.setRowSelection(() => ({}))
    if(!sortable.localSort){
      let desiredSortDirection = { ...sortDirection }

      if (desiredSortDirection[header.column.columnDef.accessorKey]) {
        if (desiredSortDirection[header.column.columnDef.accessorKey].value === 'asc') desiredSortDirection[header.column.columnDef.accessorKey] = { value: 'desc', priority: header.column.columnDef.sortPriority }
        else delete desiredSortDirection[header.column.columnDef.accessorKey]
      } else desiredSortDirection[header.column.columnDef.accessorKey] = { value: 'asc', priority: header.column.columnDef.sortPriority }
      
      let desiredSortBy:any = _.sortBy(Object.entries(desiredSortDirection), (item:any) => item[1].priority ).reverse().map((entry:any)=>entry[0])
  
      desiredSortBy = [desiredSortBy[0] || 'id']
      desiredSortDirection = { [desiredSortBy]: desiredSortDirection[desiredSortBy] || {value: "desc", priority: 0}}
  
      setState({ sortBy: desiredSortBy, sortDirection: desiredSortDirection }, false)
      refetch()
    }
  }

  return (
    <div onClick={handleSort} className={`flex items-center ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}>
      {children}
      <div className='w-3'>
        {{
          asc: <RxCaretUp className='w-4 h-4'/>,
          desc: <RxCaretDown className='w-4 h-4'/>,
        }[header.column.getIsSorted() as string] ?? null}
      </div>
    </div>
  )
}

function DragHandle({ header, table, children, ...props }: any) {
  const { draggable } = useDataView()
  const { column } = header
  if (!draggable || !(column.columnDef.draggable ?? true))
    return (
      <div className='relative flex items-center h-full gap-1' {...props}>
        <div  className={`${column.columnDef.headerClassName || ''} ${column.columnDef.className || 'justify-center'} flex items-center gap-1 py-2 grow`}>
          {children[0]}
        </div>
        {children[1]}
      </div>
    )

  const [, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedColumn: any) => {
      const { getState, setColumnOrder } = table
      const { columnOrder } = getState()

      const newColumnOrder = reorderColumn(draggedColumn.id, column.id, [...columnOrder])
      setColumnOrder(newColumnOrder)
    },
  })

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: 'column',
  })

  return (
    <div ref={dropRef} style={{ opacity: isDragging ? 0.5 : 1}} className='relative flex items-center h-full' {...props}>
      <div ref={previewRef} className='grow'>
        <div ref={dragRef} className={`${column.columnDef.headerClassName || ''} flex items-center justify-center py-2 grow `}>
          <RiDraggable className='absolute w-4 h-4 mb-0.5 cursor-pointer left-1'/>
          <div className='w-3'/>
          {children[0]}
        </div>
      </div>
      {children[1]}
    </div>
  )
}

function PinIndicator({header}:any){
  const { freezable, setState } = useDataView()
  const { column } = header
  if (!freezable || column.columnDef.freezable?.permanent) return null
  const isChecked = column.columnDef.freezable

  const handleChange = ()=>{
      setState((state:any)=>{
        const colIndex = state.cols.findIndex(({id}:any)=>id === column.columnDef.id)
        state.cols[colIndex].freezable = !isChecked
      }, false)
  }

  return <label className={`absolute z-10 top-[2px] right-[2px] swap btn btn-ghost btn-circle btn-xs ${isChecked?'':'opacity-0 group-hover:opacity-100 transition-opacity'}`}>
    <input type="checkbox" value={column.columnDef.id} checked={isChecked} onChange={handleChange}/>
    <AiFillPushpin className='w-4 h-4 swap-on'/>
    <AiOutlinePushpin className='w-4 h-4 swap-off '/>
  </label>
}
export default TableColumn
