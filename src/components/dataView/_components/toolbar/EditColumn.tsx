import { useMemo, useState } from 'react'
import { AiOutlineEdit, AiTwotoneSave } from 'react-icons/ai'
import { HiOutlineRefresh } from 'react-icons/hi'
import { HiOutlineEnvelopeOpen, HiOutlineXMark } from 'react-icons/hi2'
import { RiPushpinFill, RiUnpinFill } from 'react-icons/ri'
import { showModal } from '../../../../utils/Overlay'
import useMediaQuery from '../../../../utils/hooks/useMediaQuery'
import { TextInput } from '../../..//forms/TextInput'
import Modal from '../../../dialog/Modal'
import { useDataView } from '../../DataView.provider'

function EditColumn() {
  const { editableColumn, store, setState, freezable } = useDataView()
  if (!editableColumn) return null
  const table = store((state: any) => state.table)

  const isDesktop = useMediaQuery('lg')

  const handleClick = () => {
    showModal(EditColumnModal, { table, setState, freezable })
  }

  return (
    <>
      <button
        type='button'
        className={`flex gap-1 btn btn-outline hover:!text-white dark:hover:!text-gray-950 btn-xs capitalize ${isDesktop ? '' : 'btn-square'}`}
        {...editableColumn}
        onClick={handleClick}
      >
        <AiOutlineEdit className='w-4 h-4' />
        {isDesktop && 'Edit Columns'}
      </button>
    </>
  )
}

function EditColumnModal({ open, onClose, table, setState, freezable }: any) {
  const cols = table.getAllColumns()
  const [filter, setFilter] = useState('')
  const [newCols, setNewCols]: any = useState(table.getVisibleFlatColumns().filter(({ columnDef }: any) => columnDef.accessorKey) || [])
  const [pinIds, setPinIds]: any = useState(
    cols
      .map(({ columnDef, id }: any) => ({ id, freezable: columnDef.freezable }))
      .filter(({ freezable }: any) => freezable && !freezable.permanent)
      .map(({ id }: any) => id),
  )

  let columnOptions = useMemo(() => {
    if (freezable)
      return cols
        .filter(({ columnDef }: any) => columnDef.accessorKey)
        .map(({ columnDef, ...col }: any) => ({ ...col, columnDef, disableCheck: !columnDef.accessorKey }))
    return cols.filter(({ columnDef }: any) => columnDef.accessorKey)
  }, [cols.length])

  columnOptions = useMemo(
    () => (filter ? columnOptions.filter(({ columnDef }: any) => (columnDef.headerText || columnDef.header).match(new RegExp(filter, 'i'))) : columnOptions),
    [filter, cols.length],
  )

  const handleChange = ({ id, selected, ...rest }: any) => {
    const [...desiredCols] = newCols
    const col = desiredCols.find((col: any) => col.id === id)
    const index = desiredCols.indexOf(col)
    if (index > -1) desiredCols.splice(index, 1)
    else desiredCols.push({ id, ...rest })

    setNewCols(desiredCols)
  }

  const handlePin = ({ target }: any) => {
    const pins = [...pinIds]
    if (target.checked) pins.push(target.value)
    else {
      const index = pins.indexOf(target.value)
      if (index > -1) pins.splice(index, 1)
    }

    setPinIds(pins)
  }

  const handleClearPin = () => {
    setPinIds([])
  }

  const handleSave = () => {
    if (freezable) {
      setState((state: any) => {
        state.cols = state.cols.map((col: any) => ({
          ...col,
          freezable: col.freezable?.permanent ? col.freezable : pinIds.some((id: any) => col.id === id),
        }))
      }, false)
    }

    table.setColumnVisibility(() =>
      cols.reduce(
        (obj: any, el: any) => ({
          ...obj,
          [el.id]: newCols.some(({ id }: any) => !el.columnDef.accessorKey || el.id === id),
        }),
        {},
      ),
    )

    onClose()
  }

  const handleReset = () => {
    setNewCols(cols.filter(({ columnDef }: any) => columnDef.visible))
  }

  const handleClear = () => {
    setNewCols(cols.filter(({ columnDef }: any) => !columnDef.accessorKey))
  }

  const handleSelectAll = () => {
    setNewCols(cols.filter(({ columnDef }: any) => columnDef.accessorKey))
  }

  const handleChangeFilter = ({ target }: any) => {
    setFilter(target.value || '')
  }

  return (
    <Modal label='Edit Column' open={open} onCancel={onClose} size='max-w-lg' className='max-h-[60vh] min-h-[60vh]'>
      <div className='px-3 py-2 sm:px-6'>
        <TextInput
          className='w-full input input-sm input-bordered'
          placeholder='search...'
          value={filter}
          onChange={handleChangeFilter}
          suffix={filter ? <HiOutlineXMark onClick={handleChangeFilter} className='w-3 h-3 cursor-pointer hover:text-gray-400' /> : null}
        />
      </div>
      <div className='overflow-overlay grow'>
        <div className='flex flex-col h-full p-3 sm:pl-4 sm:pr-2'>
          <Options
            options={columnOptions}
            cols={newCols}
            onChange={handleChange}
            pinIds={pinIds}
            onPin={handlePin}
            freezable={freezable}
            onSelectAll={handleSelectAll}
            onClear={handleClear}
            onClearPin={handleClearPin}
          />
        </div>
      </div>
      <div className='flex items-center gap-2 p-4 border-t border-base-300'>
        <div className='flex items-center grow'>
          <button className='hover:!text-white capitalize rounded-full btn btn-accent btn-xs btn-outline gap-1' onClick={handleReset}>
            <HiOutlineRefresh className='w-4 h-4' /> Reset
          </button>
        </div>
        <button type='button' className='flex gap-1 text-white capitalize rounded-full btn btn-accent btn-xs' onClick={handleSave}>
          <AiTwotoneSave /> Save and Close
        </button>
      </div>
    </Modal>
  )
}

function Options({ options, cols, onChange, pinIds, onPin, freezable, onSelectAll, onClear, onClearPin }: any) {
  if (options.length < 1)
    return (
      <div className='flex flex-col items-center justify-center gap-1 text-gray-300 grow'>
        <HiOutlineEnvelopeOpen className='w-12 h-12' />
        <span>No Result Found</span>
      </div>
    )

  const handleSelectAll = ({ target }: any) => {
    if (target.checked) onSelectAll()
    else onClear()
  }

  return (
    <>
      <div className='sticky flex items-center gap-2 px-2 py-1 font-bold bg-gray-100 rounded-t-lg dark:bg-gray-600' style={{ top: -1, zIndex: 10 }}>
        <input
          type='checkbox'
          className='checkbox checkbox-sm'
          checked={cols.length >= options.filter(({ disableCheck }: any) => !disableCheck).length}
          onChange={handleSelectAll}
        />
        <div className='text-center grow'>Column Names</div>
        {freezable ? (
          <label className='swap btn btn-ghost btn-circle btn-xs '>
            <input type='checkbox' checked={pinIds.length > 0} onChange={onClearPin} />
            <RiPushpinFill className='w-5 h-5 swap-on' />
            <RiUnpinFill className='swap-off w-5 h-5 text-gray-300 dark:text-gray-700 hover:!text-gray-400' />
          </label>
        ) : null}
      </div>
      {options.map((col: any) => (
        <label htmlFor={col.id} key={col.id} className='flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer hover:bg-base-300'>
          <input
            id={col.id}
            type='checkbox'
            className='checkbox checkbox-sm'
            disabled={col.disableCheck}
            checked={col.disableCheck || cols.some(({ id }: any) => col.id === id)}
            onChange={col.disableCheck ? undefined : () => onChange(col)}
          />
          <span className='grow'>{col.columnDef.headerText || col.columnDef.header}</span>
          {freezable ? (
            <label className='swap btn btn-ghost btn-circle btn-xs '>
              <input type='checkbox' value={col.id} checked={pinIds.some((id: any) => col.id === id)} onChange={onPin} />
              <RiPushpinFill className='w-5 h-5 swap-on' />
              <RiUnpinFill className='swap-off w-5 h-5 text-gray-300 dark:text-gray-700 hover:!text-gray-400' />
            </label>
          ) : null}
        </label>
      ))}
    </>
  )
}

export default EditColumn
