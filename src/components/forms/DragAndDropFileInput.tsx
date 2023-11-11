import { get } from 'lodash'
import { forwardRef } from 'react'
import { FileUploader } from "react-drag-drop-files"
import { Controller, useFormContext } from 'react-hook-form'

export default function ({onChange, ...props}: any) {
  const { control, formState, asyncErrors, getValues, ...context }: any = useFormContext()
  let { name, showErrorMsg=context.showErrorMsg } = props

  const errorMsg = get({ ...formState.errors, ...asyncErrors }, name)?.message
  const { errorCss = 'text-red-500 text-sm' } = props
  props.className = errorMsg ||  getValues()[name] === null? `${props.className} border-error dark:border-red-700/50 dark:disabled:border-red-700/30 bg-red-50 dark:bg-red-700/5 dark:text-red-200 text-error` : `${props.className} border-base-300 dark:!border-gray-600 disabled:!text-gray-400 disabled:dark:!text-gray-600`

  return (<>
    <Controller control={control} name={name} defaultValue={props.defaultValue} render={({ field }) => {
      const handleChange = (e:any)=>{
        onChange?.(e)
        field.onChange(e)
      }
      return <DragAndDropFileInput {...field} {...props} onChange={handleChange}/>
    }} />
    {showErrorMsg && <div className={errorCss}>{errorMsg}</div>}
  </>)
}

export const DragAndDropFileInput = forwardRef(({onChange, className='', children, fileName, value, types=[], ...props}: any, ref) => {
  let label = ''

  if(value===null) label = `File type/size error, ${types.join(',').toUpperCase()} ${types>1?'are':'is'} only allowed`
  else label = ['Drag', types.join(', ').toUpperCase(), 'File or Click Here'].filter((item)=>item).join(' ')

  const handleTypeError = ()=>{
    onChange(null)
  }

  return (<FileUploader ref={ref} {...props} onTypeError={handleTypeError} handleChange={onChange} classes={`cursor-pointer border-2 border-dashed flex flex-col items-center justify-center !min-w-full !h-24 ${className}`}>
    {label}
    <div className='text-sm font-medium'>{value?.name}</div>
    {children}
  </FileUploader>
  )
})