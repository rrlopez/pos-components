/* eslint-disable no-use-before-define */
import { get } from 'lodash'
import { forwardRef, useCallback, useState } from 'react'
import ReactGoogleAutocomplete from 'react-google-autocomplete'
import { Controller, useFormContext } from 'react-hook-form'
import { CgSpinnerAlt } from 'react-icons/cg'
import { timeout } from '../../utils'
import useResizeObserver from '../../utils/hooks/useResizeObserver'
import useEditableForm from './custom/EditableForm.store'

export default function ({onChange, ...props}: any) {
  const { control, formState, asyncErrors, trigger,isLoading, ...context }: any = useFormContext()
  let { name, showErrorMsg=context.showErrorMsg, isEditForm = true, containerClass='' } = props
  isEditForm = useEditableForm((state: any) => state?.isEditForm) ?? isEditForm

  if (!isEditForm || props.static) return <Text {...props} name={name} />
  const errorMsg = get({ ...formState.errors, ...asyncErrors }, name)?.message
  const { errorCss = 'text-red-500 text-sm' } = props
  props.className = errorMsg ? `${props.className} border-2 border-error dark:border-red-700/50 dark:disabled:border-red-700/30 bg-red-50 dark:bg-red-700/5` : `${props.className} disabled:!text-gray-400 disabled:dark:!text-gray-600`

  return (
    <div className={containerClass}>
      <Controller control={control} name={name} defaultValue={props.defaultValue} render={({ field }) => {
        const handleChange = (e:any)=>{
          onChange?.(e)
          field.onChange(e)
        }
        return <GoogleAutoCompleteInput {...field} {...props} onChange={handleChange} errorMsg={errorMsg} isLoading={isLoading}
        onBlur={()=>{ timeout(trigger, 150) }}/>
      }} />
      {showErrorMsg && <div className={errorCss}>{errorMsg}</div>}
    </div>
  )
}

function Text({ name, value, defaultValue, className }: any) {
  const defaultValues = useEditableForm((state: any) => state.defaultValues)
  const { getValues } = useFormContext()
  value ||= defaultValue
  value ||= name ? getValues(name) || get(defaultValues, name) : value

  return <div className={`${className} flex items-center border-0 border-b rounded-none p-0 font-semibold`}>{value}</div>
}

export const GoogleAutoCompleteInput = forwardRef(({ prefix, suffix, mui, className, isLoading, ...rest }: any, ref) => {
  suffix = isLoading?<CgSpinnerAlt className='w-4 h-4 mr-1 text-gray-300 dark:text-gray-600 animate-spin' />:suffix
  return (
    <div className='relative flex items-center w-full isolate'>
      {prefix && <div className='absolute z-10 flex items-center left-2'>{prefix}</div>}
      {suffix && <div className='absolute z-10 flex items-center right-2'>{suffix}</div>}
      {mui ? (
        <MUIStyle ref={ref} {...rest} className={`${className} ${prefix ? 'pl-9' : ''}  ${suffix ? 'pr-9' : ''}`} />
      ) : (
        <DefaultStyle ref={ref} {...rest} className={`${className} ${prefix ? 'pl-9' : ''}  ${suffix ? 'pr-9' : ''}`} />
      )}
    </div>
  )
})

const MUIStyle = forwardRef(({ className, placeholder, errorMsg, ...rest }: any, ref) => {
  const [width, setWidth] = useState(0)
  const onResize = useCallback((target: HTMLDivElement) => setWidth(target.clientWidth), [])
  const container = useResizeObserver(onResize)
  
  return (
    <div ref={container} className={`flex items-center ${className} border-none [&_div_div]:bg-base-100 `}>
      <DefaultStyle  ref={ref} {...rest} className={`${className} absolute left-0 w-full h-full outline-none peer bg-transparent`} placeholder=' ' />
      <div
        className={`peer-placeholder-shown:[&_div]:bg-transparent  peer-focus:[&_div]:bg-base-100 flex items-center overflow-hidden h-full leading-none rounded-lg placeholder pointer-events-none absolute select-none transition-all translate-y-[-52%] text-[11px]  peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-copy peer-focus:text-[11px] peer-focus:translate-y-[-52%] ${
          errorMsg ? 'peer-focus:text-red-500' : 'peer-focus:text-inherit'
        } `}
        style={{ width: width - 20 }}
      >
        <div className={`whitespace-nowrap ${rest.disabled? '!text-gray-400 dark:!text-gray-600 !bg-transparent': 'dark:text-gray-500'}`}>{placeholder}</div>
      </div>
    </div>
  )
})

const DefaultStyle = forwardRef(({value='', onPlaceSelected, errorMsg, ...props}: any, ref) => {

    const handlePlaceSelected = (places:any={})=>{
        props.onChange?.({target:{value: places.formatted_address}})
        onPlaceSelected(places)
    }
    
    return <ReactGoogleAutocomplete ref={ref}
        value={value}
        apiKey={process.env.APP_GOOGLE_MAP_KEY}
        onPlaceSelected={handlePlaceSelected}
        {...props}
    />
})
