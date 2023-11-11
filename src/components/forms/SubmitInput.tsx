/* eslint-disable no-use-before-define */
import { useId } from 'react'
import { useFormContext } from 'react-hook-form'
import { CgSpinnerAlt } from 'react-icons/cg'

export default function ({ name, value, ...props }: any) {
  const { register, setValue } = useFormContext()

  const handleClick = () => {
    setValue(name, value, {shouldValidate:true})
  }

  return (
    <>
      <input {...register(name)} className='hidden' />
      <SubmitInput {...props} onClick={handleClick} />
    </>
  )
}

export function SubmitInput({ className = '', children, onClick = () => {}, prefix, disabled, ...props }: any) {
  const { formState, buttonID }: any = useFormContext()
  const id = useId()
  
  const attr = {
    disabled: formState.isSubmitting || disabled || Object.keys(formState.errors).length>0,
    onClick: ({ target }: any) => {
      buttonID.current = id
      onClick()
      if (target.lastChild) target.lastChild.click?.()
    },
  }

  return (
    <button type='submit' className={`gap-1 ${className}`} {...props} {...attr} >
      {formState.isSubmitting && buttonID.current === id? <CgSpinnerAlt className='w-5 h-5 animate-spin' />: prefix}
      {children}
    </button>
  )
}
