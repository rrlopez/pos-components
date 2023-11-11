/* eslint-disable no-use-before-define */
import { get } from 'lodash'
import { forwardRef } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import useEditableForm from './custom/EditableForm.store'

export default function ({ name, isEditForm = true, onChange, ...props }: any) {
  const { register, formState, asyncErrors, ...context }: any = useFormContext()
  isEditForm = useEditableForm((state: any) => state?.isEditForm) ?? isEditForm
  const value = useWatch({name})

  if (!isEditForm || props.static) return null
  const errorMsg = get({ ...formState.errors, ...asyncErrors }, name)?.message
  props.className = errorMsg ? `${props.className} border-2 border-error disabled:border-red-200` : props.className
  props.showErrorMsg=context.showErrorMsg

  if(props.type === 'radio') props.checked = props.value===value

  const inputProps = register(name)

  const handleChange = (e:any)=>{
    onChange?.(e)
    inputProps.onChange(e)
  }
  return <CheckInput {...inputProps} onChange={handleChange} {...props} errorMsg={errorMsg} />
}

export const CheckInput = forwardRef(({ label, value,  errorCss = 'text-red-500 text-sm', errorMsg, showErrorMsg=true, labelClass, containerClass, ...rest }: any, ref: any) => {
 
  return (
    <label htmlFor={rest.id} className={`${containerClass} flex items-center justify-center gap-2 cursor-pointer`}>
      <input ref={ref} type='checkbox' {...rest} value={value} />
      <span className='grow empty:hidden'>
        <span className={`${labelClass} ${rest.disabled?'text-gray-300 dark:text-gray-600 line-through':''}`}>{label}</span>
        {showErrorMsg && errorMsg && <div className={`${errorCss} empty:hidden`}>{errorMsg}</div>}
      </span>
    </label>
  )
})
