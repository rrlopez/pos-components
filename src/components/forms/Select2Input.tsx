/* eslint-disable no-use-before-define */
/* eslint-disable react/no-array-index-key */
import { Combobox, Portal, Transition } from '@headlessui/react'
import { useVirtualizer } from '@tanstack/react-virtual'
import _, { get } from 'lodash'
import { Fragment, forwardRef, useCallback, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { CgChevronDown, CgSpinnerAlt } from 'react-icons/cg'
import { HiCheck, HiEnvelopeOpen } from 'react-icons/hi2'
import { IoMdClose } from 'react-icons/io'
import useEffectAfterMount from '../../utils/hooks/useEffectAfterMount'
import useResizeObserver from '../../utils/hooks/useResizeObserver'
import { useSelectInput, useSelectInputLabel } from './SelectInput'
import useEditableForm from './custom/EditableForm.store'

export default function ({containerClass, onChange, ...props}: any) {
  const { control, formState, isLoading, setValue, getValues, ...context }: any = useFormContext()
  const isEditForm = useEditableForm((state: any) => state?.isEditForm) ?? true
  if (!isEditForm || props.static) return <Text {...props} />
  const { showErrorMsg=context.showErrorMsg, errorCss = 'text-red-500 text-sm', error, name, ...rest } = props
  const errorMsg = (get(formState.errors, `${props.name}.${props.by}`) || get(formState.errors, props.name))?.message as any
  rest.className = errorMsg ? `${rest.className} border-2 border-error dark:border-red-700/60 disabled:border-red-200 dark:disabled:border-red-700/30 bg-red-50 dark:bg-red-700/10` : rest.className

  const handleChange = ({target}:any)=>{
    if(!props.by) return
    if (!target.value) {
      Object.keys(props.options[0].value).forEach((key) => setValue(`${name}.${key}`, '', {shouldValidate:true}))
      setValue(name, '', {shouldValidate:true})
    } else Object.keys(props.options[0].value).forEach((key) => setValue(`${name}.${key}`, target.value[key] ?? '', {shouldValidate:true}))
  }

  return (
    <div className={containerClass}>
      <Controller
        control={control}
        name={props.name}
        defaultValue={props.defaultValue ?? ''}
        render={({ field }) => (
          <Select2Input
            field={{...field, value: (getValues(`${props.name}.${props.by}`) || getValues(name))}}
            {...rest}
            errorMsg={errorMsg}
            isLoading={isLoading || rest.isLoading}
            onClose={(oldValue: any) => {
              if(!oldValue) return
              field.onChange(field.value ?? oldValue)
            }}
            onChange={(e:any)=>{
              onChange?.(e)
              handleChange(e)
              field.onChange(e)
              if(!e.target.value) rest.onClear?.()
            }}
          />
        )}
      />
      {showErrorMsg && <div className={errorCss}>{errorMsg}</div>}
    </div>
  )
}

function Text({ value, defaultValue, name, className, ...rest }: any) {
  const defaultValues = useEditableForm((state: any) => state.defaultValues)
  const { getValues } = useFormContext()

  value = defaultValue ?? value ?? getValues(name) ?? get(defaultValues, name)
  const { label }: any = useSelectInputLabel({ value, ...rest })

  return <div className={`${className} flex items-center grey lighten-7 read-only border-0 border-b rounded-none p-0 font-semibold gap-1`}>{label}</div>
}

export function Select2Input({wrap, ...props}: any) {
  const { className, field = {}, add: Add = () => null, onOpen = () => {}, onClose = () => {}, prefix = null, suffix=null, mui, allowNull=true, LabelRenderer, ...rest } = props
  
  const inputRef: any = useRef()
  const [query, setQuery] = useState(null)
  const [oldValue, setOldValue] = useState(null) as any
  
  const { referenceElement, setReferenceElement, setPopperElement, styles, attributes, value, label, onChange, options }: any = useSelectInput({
    field,
    ...props,
    oldValue
  })

  const [width, setWidth] = useState(0)
  const [isFocus, setIsFocus] = useState(false)
  const onResize = useCallback((target: HTMLDivElement) => setWidth(target.clientWidth), [])
  const container = useResizeObserver(onResize, 0)

  const filteredOptions =
    query === null ? options : options.filter(({ label, searchKey = label }: any) => searchKey?.toLowerCase().includes(((query ?? '') as any).toLowerCase()))

  const handleOpen = () => {
    if (rest.multiple) return
    inputRef.current?.focus()
    inputRef.current.value = ''
    setOldValue(value)
    onOpen()
  }

  const handleClose = () => {
    onClose(oldValue)
    setQuery(null)
    referenceElement.focus()
    setIsFocus(true)
  }

  const onInputChange = ({ target }: any) => {
    setQuery(target.value)
    rest.onInputChange?.(target.value)
    inputRef.current.style.width = `${target.value.length}ch`
  }

  const handleOptionClick = (selectedValue: any) => {
    const selectedVal = get(selectedValue, rest.by) ?? selectedValue
    if (!selectedVal && selectedVal!=='') return
    if ((get(oldValue, rest.by) ?? oldValue) === selectedVal) setOldValue(null)
    else if(oldValue===selectedValue) setOldValue(null)
    else setOldValue(selectedValue)
    rest.onOptionClick?.({ target: { value: selectedValue } })
    inputRef.current.focus()
  }

  const handleClick = (e: any) => {
    e.stopPropagation()
  }

  const handleClear = (e: any)=>{
    e.stopPropagation()
    props.onBlur?.()
    inputRef.current?.focus()
    setOldValue(null)
    onChange(null)
  }

  const handleFocus = ()=>{
    if(isFocus) return
    setIsFocus(true)
    referenceElement.focus()
  }

  const handleBlur = ()=>{
    if(!isFocus) return
    setIsFocus(false)
  }
  
  return (
    <Combobox {...field} {...rest} value={field.value ?? rest.value ?? ''} onChange={onChange} nullable>
      {({ open }: any) => {

        useEffectAfterMount(() => {
          if (open) handleOpen()
          else handleClose()
        }, [open])

        return (
          <>
            <Combobox.Button 
              tabIndex={0}
              as='div'
              ref={setReferenceElement} 
              className={`font-normal ${className} ${wrap?'[&_div_div]:whitespace-pre-wrap':''} h-auto flex items-center gap-1 leading-none pr-1 py-1 [&_div_div]:disabled:dark:!text-gray-600 [&_div_div]:disabled:!text-gray-400 [&_svg]:disabled:!text-gray-400 [&_svg]:disabled:dark:!text-gray-600`} 
              onClick={handleClick}
              onBlur={handleBlur}
            >
              <div className='flex items-center h-full gap-1 grow'>
                {prefix}
                <div ref={container} className='relative h-full text-left grow'>
                  {(!open || rest.multiple) && (
                    <div  className='[&_span]:bg-base-100 flex flex-wrap gap-1' style={{ width:width-10 }}>
                      {mui && (rest.multiple?value.length:value) ? (
                        <span className='placeholder absolute whitespace-nowrap top-0 left-0 translate-y-[-100%] text-[11px] !font-normal dark:text-gray-500'>{rest.placeholder}</span>
                      ) : null}
                      {(!open || (rest.multiple?value.length:value)?(LabelRenderer?<LabelRenderer {...rest}/>:label):null)}
                    </div>
                  )}
                  <div className={`${!mui || oldValue?'absolute':''} w-full h-full flex items-center ${open?'opacity-100':'opacity-0'}`}>
                      {(mui ? (
                        <MUIStyle
                          {...rest}
                          tabIndex={isFocus?-1:0}
                          ref={inputRef}
                          className='bg-transparent ring-transparent outline-0 text-copy grow'
                          onChange={onInputChange}
                          autoComplete='off'
                          oldValue={oldValue}
                          onFocus={handleFocus}
                        />
                      ) : (
                        <DefaultStyle
                          tabIndex={isFocus?-1:0}
                          ref={inputRef}
                          className='bg-transparent ring-transparent outline-0 text-copy'
                          onChange={onInputChange}
                          autoComplete='off'
                          placeholder={rest.placeholder}
                          onFocus={handleFocus}
                        />
                      ))}
                    </div>
                  {open && <div style={{ width:width-10 }} className={`font-normal truncate text-gray-400 dark:text-gray-600 ${query?'invisible':''}`}>{oldValue?label:mui?'':rest.placeholder}</div>}
                </div>
                {suffix}
                {
                  allowNull && (rest.multiple?field.value.length: rest.by?_.get(field.value, rest.by):field.value)?
                    <button tabIndex={-1} type='button' className='btn btn-xs btn-ghost btn-circle disabled:bg-transparent ' disabled={rest.disabled} onClick={handleClear}>                  
                      <IoMdClose className='w-3 h-3'/>
                    </button>
                  :(rest.isLoading && !open)?<CgSpinnerAlt className='w-4 h-4 mr-1 animate-spin' />:<CgChevronDown className='w-4 h-4 mr-1'/>
                }
              </div>
            </Combobox.Button>
            {open && (
              <Portal>
                <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
                  <Combobox.Options
                    onClick={handleClick}
                    ref={setPopperElement}
                    style={{ ...styles.popper, minWidth: referenceElement?.scrollWidth }}
                    {...attributes.popper}
                    className='z-50 py-1 text-base rounded-md shadow-lg bg-base-100 dark:bg-base-300 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
                  >
                    <Options options={options} filteredOptions={filteredOptions} oldValue={oldValue} handleOptionClick={handleOptionClick} {...rest}/>
                    <Add
                      onSubmit={(selectedValue: any) => {
                        onChange(rest.multiple ? [...value, selectedValue] : selectedValue)
                      }}
                    />
                  </Combobox.Options>
                </Transition>
              </Portal>
            )}
          </>
        )
      }}
    </Combobox>
  )
}

const MUIStyle = forwardRef(({ className, placeholder, errorMsg, oldValue, multiple, ...rest }: any, ref: any) => {

  return (
    <div className='flex items-start h-full grow'>
      <DefaultStyle ref={ref} {...rest} className={`${className} w-full h-hull outline-none peer bg-transparent`} placeholder=' ' />
      <div
        className={`peer-focus:[&_div]:bg-base-100 flex items-center overflow-hidden h-full leading-none rounded-lg placeholder pointer-events-none absolute select-none translate-y-[-75%] text-[11px] peer-focus:text-[11px] ${
          oldValue ? '' : 'transition-all peer-placeholder-shown:translate-y-0 peer-focus:translate-y-[-70%] peer-placeholder-shown:text-copy'
        } ${errorMsg ? 'peer-focus:[&_div]:!text-red-500' : 'peer-focus:[&_div]:text-inherit'} `}
      >
        {multiple && oldValue && !oldValue.length?null:<div className='whitespace-nowrap '>{placeholder}</div>}
      </div>
    </div>
  )
})

const DefaultStyle = forwardRef((props: any, ref: any) => <Combobox.Input ref={ref} {...props} placeholder=' ' style={{width:2}}/>)

function Options({ options=[], filteredOptions, by, oldValue, handleOptionClick, isLoading, multiple, OptionRenderer=DefaultOptionRenderer, estimateSize }: any) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: filteredOptions?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize || 30,
    overscan: 5,
  })
  
  if(isLoading)
    return (
      <div className='flex flex-col items-center justify-center gap-1 text-gray-300 h-28'>
        <CgSpinnerAlt className='w-10 h-10 animate-spin' />
      </div>
    )

  if (options.length < 1 || filteredOptions.length < 1)
    return (
      <div className='flex flex-col items-center justify-center gap-1 text-gray-300 h-28'>
        <HiEnvelopeOpen className='w-12 h-12' />
        <span>No data</span>
      </div>
    )

  const handleKeyUp = (e:any)=>{
    e.preventDefault()
    if (e.keyCode === 13) handleOptionClick(e.target.value)
  }


  return (
    <div ref={parentRef} className='overflow-auto max-h-60'>
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative', }} >
        {rowVirtualizer.getVirtualItems().map((virtualRow: any, i:any) => {
          const option = filteredOptions?.[virtualRow.index]

          return (<Combobox.Option
            key={virtualRow.index}
            value={option.value}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
            disabled={option.disabled}
            className={({ active }) => `relative ${option.disabled?'':'cursor-pointer'}  select-none ${active ? 'bg-base-200' : 'base-base-200'}`}
            onClick={() => handleOptionClick(option.value)}
            onKeyUp={handleKeyUp}
            children={({ selected }: any) => {
              selected = option.value===''?false:selected
  
              if (!multiple && !selected) {
                const oldVal = get(oldValue, by) ?? oldValue
                const val = get(option.value, by) ?? option.value
                selected = selected ?? oldVal === val
              }
              
              return <OptionRenderer {...option} selected={selected} index={i}/>
            }}
          />)
        })}
      </div>
    </div>
  )
}

function DefaultOptionRenderer({ label, selected, disabled, className='relative py-1 pl-10 pr-4' }: any) {
  return (
    <div className={className}>
      <span className={`flex items-center h-6 whitespace-nowrap ${selected ? 'font-medium' : 'font-normal'} ${disabled?'dark:text-gray-600 text-gray-300':''} `}> {label} </span>
      {selected && (
        <span className='absolute inset-y-0 left-0 flex items-center pl-3 base-base-200'>
          <HiCheck className='w-5 h-5' aria-hidden='true' />
        </span>
      )}
    </div>
  )
}
