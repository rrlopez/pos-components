/* eslint-disable no-use-before-define */
import { useFormContext } from 'react-hook-form'
import { AiOutlineReload } from 'react-icons/ai'

export default function ({ name, ...props }: any) {
  const { register } = useFormContext()
  return <ResetInput {...register(name)} {...props} />
}

export function ResetInput({  children='Reset', defaultValues, onClick, canReset=()=>true, ...props }: any) {
  const { store }:any = useFormContext()

  const handleClick = () => {
    if(!canReset()) return
    defaultValues =  defaultValues || store.getState().defaultValues
    const {setState} = store.getState()
    setState({defaultValues})
    onClick?.()
  }

  return <button type='button' {...props} onClick={handleClick}>
    <AiOutlineReload className='w-4 h-4'/> {children}
  </button>
}
