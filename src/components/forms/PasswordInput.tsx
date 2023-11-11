/* eslint-disable import/no-named-default */
import { forwardRef, useState } from 'react'
import { HiEye, HiEyeSlash } from 'react-icons/hi2'
import { default as BaseTextInput, TextInput } from './TextInput'

export default function (props: any) {
  const [isVisible, setVisible] = useState(false)

  const handleClick = () => {
    setVisible(!isVisible)
  }

  const handleFocus = ({ target }: any) => {
    target.removeAttribute('readonly')
  }

  return (
    <BaseTextInput
      {...props}
      type={isVisible ? 'text' : 'password'}
      readOnly
      onFocus={handleFocus}
      suffix={isVisible ? <HiEye className='w-5 cursor-pointer' onClick={handleClick} /> : <HiEyeSlash className='w-5 cursor-pointer' onClick={handleClick} />}
    />
  )
}
export const PasswordInput = forwardRef(({ ...rest }: any, ref: any) => <TextInput {...rest} ref={ref} />)
