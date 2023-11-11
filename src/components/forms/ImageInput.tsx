import { get } from 'lodash'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { fileToDataURL } from '../../utils'
import useEditableForm from './custom/EditableForm.store'

export default function ({ ...props }: any) {
  const { control, formState }: any = useFormContext()
  const isEditForm = useEditableForm((state: any) => state?.isEditForm) ?? true
  const { showErrorMsg, errorCss = 'text-red-500 text-sm', error, ...rest } = props

  if (!isEditForm || props.static) return <Text {...props} />
  const errorMsg = get(formState.errors, props.name)?.message as any
  rest.className = errorMsg ? `${rest.className} border-2 border-error disabled:border-red-200` : rest.className

  return (
    <div className='flex flex-col'>
      <Controller control={control} name={props.name} defaultValue={props.defaultValue} render={({ field }) => <ImageInput field={field} {...rest} />} />
      {showErrorMsg && <div className={errorCss}>{errorMsg}</div>}
    </div>
  )
}

function Text({ name, src, value = src, defaultValue, className = '' }: any) {
  const defaultValues = useEditableForm((state: any) => state.defaultValues)
  const { getValues } = useFormContext()
  value ||= defaultValue
  value ||= name ? getValues(name) || get(defaultValues, name) : value

  return (
    <div className={className}>
      <Image
        src={value ? `${process.env.APP_NODE_SERVER}${value}` : '/profile-placeholder.png'}
        alt=''
        width={1000}
        height={1000}
        className='object-cover rounded-lg'
      />
    </div>
  )
}

function ImageInput({ buttonProps, onChange = () => null, value = '/profile-placeholder.png', field = {}, className, ...rest }: any) {
  let input: any = useRef()
  const [src, setSrc] = useState(value)

  useEffect(() => {
    setSrc(value)
  }, [value])

  const handleChange = () => {
    const file = input.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = async () => {
      setSrc(reader.result)
      const dataURL = await fileToDataURL(file).catch(e => Error(e))
      onChange({ target: { name: field.name, value: dataURL } })
      field.onChange?.({ target: { name: field.name, value: dataURL } })
    }
  }

  const handleClick = () => {
    input.click()
  }

  const handleRef = (el: any) => {
    input = el
    field.ref?.(el)
  }

  return (
    <div className={`flex flex-col justify-center gap-1 item-center ${className}`}>
      <Image src={src} alt='' width={1000} height={1000} className='object-cover rounded-lg' />
      {rest.readOnly || (
        <>
          <button type='button' onClick={handleClick} {...buttonProps} className='text-white btn btn-accent btn-sm'>
            Upload Picture
          </button>
          <input ref={handleRef} type='file' style={{ display: 'none' }} onChange={rest.readOnly || handleChange} onBlur={field.onBlur} {...rest} />
        </>
      )}
    </div>
  )
}
