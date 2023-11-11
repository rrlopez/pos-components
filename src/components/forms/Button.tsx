import { useState } from 'react'
import { CgSpinnerAlt } from 'react-icons/cg'

function Button({ onClick = () => {}, children, className = '',  disabled, prefix, loading=false, ...rest }: any) {
  const [isLoading, setIsLoading] = useState(loading)

  const handleClick = async () => {
    try{
      setIsLoading(true)
      await onClick()
      setIsLoading(false)
    }
    catch(e:any){
      console.error(e.message)
      setIsLoading(false)
    }
  }

  return (
    <button type='button' onClick={handleClick} disabled={disabled || isLoading} className={`flex flex-nowrap gap-1 ${className}`} {...rest}>
      {isLoading ? <CgSpinnerAlt className='w-5 h-5 animate-spin ' /> : prefix}
      {children}
    </button>
  )
}

export default Button
