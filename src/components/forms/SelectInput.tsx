/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import { Listbox, Transition } from '@headlessui/react'
import { get } from 'lodash'
import { Fragment, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { CgChevronDown, CgSpinnerAlt } from 'react-icons/cg'
import { HiCheck, HiOutlineEnvelopeOpen } from 'react-icons/hi2'
import { RiCloseFill } from 'react-icons/ri'
import { usePopper } from 'react-popper'
import Portal from '../portal'
import TextInput from './TextInput'
import useEditableForm from './custom/EditableForm.store'

export const useSelectInputLabel = ({ value, options = [], by, multiple, placeholder }: any) => {
  const option = useMemo(() => {
    let desiredLabel: any = <div className='flex items-center !font-normal truncate placeholder grow dark:text-gray-400'>{placeholder}</div>
    let desiredValue = value

    if (multiple) {
      value = value?.map((val: any) => val?.[by] ?? val) ?? []
      const labelList = options
        .filter((option: any) => value.includes(option.value?.[by] ?? option.value))
        .map((option: any, index: any) => (
          <div key={`${option.label}${index}`} className='label-value bg-base-300 base-100' title={option.label}>
            {option.label}
          </div>
        ))
      desiredLabel = labelList.length > 0 ? labelList : desiredLabel
    } else {
      value = value?.[by] ?? value
      const option = options.find((option: any) => value === (option.value?.[by] ?? option.value))
      const text = option?.label ?? desiredLabel
      desiredValue = option ? option.value : null
      desiredLabel = text ? <div className='leading-5 text-left truncate'>{text}</div> : desiredLabel
    }

    return { label: desiredLabel, value: desiredValue }
  }, [value, options.length, options[0]?.label, placeholder])

  return option
}

export const useSelectInput = ({ field, value, oldValue, options, placeholder, onChange = () => {}, allowNull=true, ...rest }: any) => {
  const [referenceElement, setReferenceElement] = useState() as any
  const [popperElement, setPopperElement] = useState() as any
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
  })

  field.value = value ?? field.value ?? rest.defaultValue
  field.value = field.value ? field.value : rest.multiple ? [] : field.value

  const option = useSelectInputLabel({ value: field.value ?? oldValue, options, placeholder, ...rest })
  return {
    referenceElement,
    setReferenceElement,
    setPopperElement,
    styles,
    attributes,
    ...option,
    onChange: (selectedValue: any) => {
      field.onChange?.(selectedValue)
      onChange({ target: { value: selectedValue } })
    },
    options: options ? ((!rest.multiple && placeholder && allowNull) ? [{ label: placeholder, value: '' }, ...options] : options) : [],
  }
}

export default function ({containerClass, onChange, ...props}: any) {
  const { control, formState, setValue, ...context }: any = useFormContext()
  const isEditForm = useEditableForm((state: any) => state?.isEditForm) ?? true
  const { showErrorMsg=context.showErrorMsg, errorCss = 'text-red-500 text-sm', error, ...rest } = props

  if (!isEditForm || props.static)
    return (
      <>
        <Text {...props} />
        {props.static && <TextInput name={props.name} defaultValue={props.defaultValue} className='hidden' />}
      </>
    )
  const errorMsg = get(formState.errors, props.name)?.message as any
  rest.className = errorMsg ? `${rest.className} border-2 border-error dark:border-red-700/60 disabled:border-red-200 dark:disabled:border-red-700/30 bg-red-50 dark:bg-red-700/10` : rest.className

  const handleChange = ({target}:any)=>{
    if(!props.by) return
    if (!target.value) {
      Object.keys(props.options[0].value).forEach((key) => setValue(`${name}.${key}`, undefined, {shouldValidate:true}))
      setValue(props.name, undefined, {shouldValidate:true})
    } else Object.entries(target.value).forEach(([key, value]) => setValue(`${name}.${key}`, value, {shouldValidate:true}))
  }

  return (
    <div className={containerClass}>
      <Controller control={control} name={props.name} defaultValue={props.defaultValue ?? ''} render={({ field }) => <SelectInput
        field={field} 
        onChange={(e:any)=>{
          onChange?.(e)
          handleChange(e)
          field.onChange(e)
        }}
        {...rest} 
      />} />
      {showErrorMsg && <div className={errorCss}>{errorMsg}</div>}
    </div>
  )
}

function Text({ defaultValue, value = defaultValue, name, className, ...rest }: any) {
  const defaultValues = useEditableForm((state: any) => state.defaultValues)
  const { getValues } = useFormContext()

  value = value ?? getValues(name) ?? get(defaultValues, name)
  const { label }: any = useSelectInputLabel({ value, ...rest })

  return <div className={`${className} flex items-center grey lighten-7 read-only border-0 border-b rounded-none p-0 font-semibold gap-1`}>{label}</div>
}

export function SelectInput({ add: Add = () => null, field = {}, className, prefix, suffix, isLoading, allowNull=true, ...rest }: any) {
  const { referenceElement, setReferenceElement, setPopperElement, styles, attributes, value, label, onChange, options }: any = useSelectInput({
    field,
    ...rest,
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
  }
  
  const handleClear = (e: any)=>{
    e.stopPropagation()
    onChange(null)
  }

  field.value = field.value ?? rest.value ?? ''

  return (
    <Listbox {...field} {...rest} value={field.value} onChange={onChange}>
      <>
        <Listbox.Button
          ref={setReferenceElement}
          className={`font-normal ${className} relative flex items-center gap-1 pr-1 [&_div_div]:disabled:dark:!text-gray-600 [&_div_div]:disabled:!text-gray-400 [&_svg]:disabled:!text-gray-400 [&_svg]:disabled:dark:!text-gray-600`}
          title={label?.props?.children}
          onClick={handleClick}
        >
          {prefix}
          <div className='flex gap-1 truncate grow'>{label}</div>
          {suffix}
          {
            allowNull && field.value && field.value.length?
              <button className='btn btn-xs btn-ghost btn-circle disabled:bg-transparent disabled:text-gray-400 dark:disabled:text-gray-700' disabled={rest.disabled}>
                <RiCloseFill className='w-4 h-4' onClick={handleClear}/>
              </button>
            :<CgChevronDown className='w-4 h-4 mr-1'/>
          }
        </Listbox.Button>
        <Portal>
          <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
            <Listbox.Options
              onClick={handleClick}
              ref={setPopperElement}
              style={{ ...styles.popper, minWidth: referenceElement?.scrollWidth }}
              {...attributes.popper}
              className='z-50 py-1 text-base rounded-md shadow-lg bg-base-100 dark:bg-base-300 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm max-w-[100vw]'
            >
              <div className='overflow-auto max-h-60 '>
                <Options options={options} isLoading={isLoading} {...rest}/>
              </div>
              <Add
                onSubmit={(selectedValue: any) => {
                  onChange(rest.multiple ? [...value, selectedValue] : selectedValue)
                }}
              />
            </Listbox.Options>
          </Transition>
        </Portal>
      </>
    </Listbox>
  )
}

function Options({ options, isLoading=false, by, value }: any) {
  if(isLoading || !options)
    return (
      <div className='flex flex-col items-center justify-center gap-1 text-gray-300 h-28'>
        <CgSpinnerAlt className='w-10 h-10 animate-spin' />
      </div>
    )
  

  if (options.length < 1)
    return (
      <div className='flex flex-col items-center justify-center gap-1 text-gray-300 h-28'>
        <HiOutlineEnvelopeOpen className='w-12 h-12' />
        <span>No data</span>
      </div>
    )

  return options.map((option: any, index: any) => (
    <Listbox.Option
      key={`${option.value?.[by] || option.value}${index}`}
      value={option.value}
      className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-base-200' : 'base-base-200'}`}
      children={({ selected }) => {
        selected = option.value ===''?false:value===(option.value?.[by] ?? option.value)
        return (
          <>
            <div className={`block truncate leading-5 ${selected ? 'font-medium' : 'font-normal'}`}> {option.label} </div>
            {selected && (
              <span className='absolute inset-y-0 left-0 flex items-center pl-3 base-base-200'>
                <HiCheck className='w-5 h-5' aria-hidden='true' />
              </span>
            )}
          </>
        )
      }}
    />
  ))
}
