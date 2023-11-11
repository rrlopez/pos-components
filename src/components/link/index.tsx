/* eslint-disable import/no-named-default */
import { default as NextLink } from 'next/link'
import useLoadingBar from '../loadingBar/LoadingBar.store'

function Link({ children, href, onClick = () => {}, className, activeClass = '', ...rest }: any) {
  const setState = useLoadingBar((state: any) => state.setState)

  const handleOnClick = () => {
    onClick()
    setState({ nextPathname: href })
  }

  if (href === location.pathname) className = `${className} ${activeClass}`

  return (
    <NextLink href={href}>
      <a onClick={handleOnClick} {...rest} className={`${className}`}>
        {children}
      </a>
    </NextLink>
  )
}

export default Link
