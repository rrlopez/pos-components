/* eslint-disable no-use-before-define */
import { get } from 'lodash'
import { forwardRef, useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import useResizeObserver from '../../utils/hooks/useResizeObserver'
import useEditableForm from './custom/EditableForm.store'

export default  forwardRef(({containerClass='', ...props}: any, outerRef: any)=> {
  const { register, formState, asyncErrors, ...context }: any = useFormContext()
  let { name, showErrorMsg=context.showErrorMsg, isEditForm = true } = props
  isEditForm = useEditableForm((state: any) => state?.isEditForm) ?? isEditForm

  if (!isEditForm || props.static) return <Text {...props} name={name} />
  const errorMsg = get({ ...formState.errors, ...asyncErrors }, name)?.message
  const { errorCss = 'text-red-500 text-sm' } = props
  props.className = errorMsg ? `${props.className} border-2 border-error dark:border-red-700/60 disabled:border-red-200 dark:disabled:border-red-700/30 bg-red-50 dark:bg-red-700/10` : props.className
  
  const { ref, ...rest } = register(name);

  return (
    <div className={containerClass}>
      <TextAreaInput 
        ref={(e) => {
          ref(e)
          if(outerRef) outerRef.current = e
        }} 
        {...rest} 
        {...props} 
        errorMsg={errorMsg} 
      />
      {showErrorMsg && <div className={errorCss}>{errorMsg}</div>}
    </div>
  )
})

function Text({ value, defaultValue, name, className }: any) {
  const defaultValues = useEditableForm((state: any) => state.defaultValues)
  const { getValues } = useFormContext()
  value ||= defaultValue
  value ||= name ? getValues(name) || get(defaultValues, name) : value

  return <div className={`${className} flex items-center border-0 border-b rounded-none p-0 font-semibold`}>{value}</div>
}

export const TextAreaInput = forwardRef(({ prefix, suffix, className, mui, ...rest }: any, ref: any) => (
  <div className='relative flex items-start w-full h-full'>
    {mui ? (
      <MUIStyle ref={ref} {...rest} className={`${className} ${prefix ? 'pl-9' : ''}  ${suffix ? 'pr-9' : ''}`} />
    ) : (
      <DefaultStyle ref={ref} {...rest} className={`${className} ${prefix ? 'pl-9' : ''}  ${suffix ? 'pr-9' : ''}`} />
    )}
  </div>
))

const MUIStyle = forwardRef(({ className, placeholder, errorMsg, ...rest }: any, ref: any) => {
  const [width, setWidth] = useState(0)
  const onResize = useCallback((target: HTMLDivElement) => setWidth(target.clientWidth), [])
  const container = useResizeObserver(onResize)

  return (
    <div ref={container} className={`flex items-center ${className} border-none p-0`}>
      <DefaultStyle ref={ref} {...rest} className={`${className} w-full h-full transition-all outline-none peer bg-transparent`} placeholder=' ' />
      <div
        className={`${className} border-none bg-transparent top-0 left-0  rounded-lg placeholder pointer-events-none absolute select-none transition-all translate-y-[-45%] text-[11px]  peer-placeholder-shown:whitespace-pre-wrap peer-focus:whitespace-normal peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-copy peer-focus:text-[11px] peer-focus:translate-y-[-45%] ${
          errorMsg ? 'peer-focus:text-red-500' : 'peer-focus:text-inherit'
        } `}
        style={{ width: width - 20 }}
      >
        <div className='inline-block bg-base-100 leading-[1.3rem]'>{placeholder}</div>
      </div>
    </div>
  )
})

const DefaultStyle = forwardRef(({className, ...props}: any, ref: any) => <textarea ref={ref} className={`${className} leading-[1.3rem]`} {...props} />)
