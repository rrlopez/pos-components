/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { useTheme } from 'next-themes'
import { useRef } from 'react'
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs'

function ThemeSelect({ className = '' }: any) {
  const { theme, setTheme } = useTheme()
  const body:any = useRef(document.getElementsByTagName('body')[0])
  body.current.className = theme

  const handleChangeTheme = () => {
    setTheme(theme==='dark' ? 'light' : 'dark')
  }

  return (
    <label className={`swap swap-rotate btn btn-circle btn-sm btn-ghost ${className}`}>
      <input type='checkbox' checked={theme === 'light'} onChange={handleChangeTheme} />
      {theme === 'light' ? <BsFillSunFill className='w-5 h-5' /> : <BsFillMoonFill className='w-5 h-5' />}
    </label>
  )
}

export default ThemeSelect
