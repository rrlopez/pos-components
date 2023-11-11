import { useEffect, useState } from 'react'

const useTopBarShadowEffect = () => {
  const [scrolled, setScrolled] = useState({ value: false, style: {} })

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset === 0) {
        setScrolled({ value: false, style: {} })
      } else if (window.pageYOffset > 0 && !scrolled.value) {
        setScrolled({
          value: true,
          style: { boxShadow: '0 1px 5px 0 #b9b9b9' },
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return scrolled
}

export default useTopBarShadowEffect
