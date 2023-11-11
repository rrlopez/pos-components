import { useRouter } from 'next/router'
import queryString from 'query-string'
import { useCallback } from 'react'
import { getTypes } from '../index'

function useUrlQuery() {
  const { hash = window.location.hash, ...rest }: any = useRouter()
  const urlQuery = queryString.parse(rest.asPath.split('?')[1])

  const getUrlQuery = useCallback((value = {}) => {
    const newValue = { ...urlQuery, ...value }
    const IValue = getTypes(newValue)
    type IValue = keyof typeof IValue

    Object.keys(newValue).forEach((key: any) => {
      if (!(newValue[key as IValue] || newValue[key as IValue] === 0)) delete newValue[key as IValue]
    })
    const finalValue = Object.keys(newValue).reduce((t: any, i: any) => `${t}${i}=${newValue[i as IValue]}&`, `?`)
    return finalValue.substring(0, finalValue.length - 1) + hash
  }, [])

  return { urlQuery, getUrlQuery, hash, ...rest }
}

export default useUrlQuery
