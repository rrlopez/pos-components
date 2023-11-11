import { useState } from 'react'

export const getSessionStorage = (keyName: any, defaultValue?: any) => {
  let value: any
  try {
    value = JSON.parse(window.sessionStorage.getItem(keyName) as any) ?? undefined
    if (value) return value
    else{
      window.sessionStorage.setItem(keyName, JSON.stringify(defaultValue))
      return defaultValue
    }
  } catch (err) {
    return value || defaultValue
  }
}

export const setSessionStorage = (keyName: any, newValue: any) => {
  try {
    window.sessionStorage.setItem(keyName, JSON.stringify(newValue))
  } catch (err) {
    return undefined
  }
  return undefined
}

const useSessionStorage = (keyName: any, defaultValue: any) => {
  const [_update, setUpdate] = useState()
  const storedValue = getSessionStorage(keyName, defaultValue)

  const setValue = (newValue: any) => {
    setSessionStorage(keyName, newValue)
    setUpdate(newValue)
  }

  return [storedValue, setValue]
}

export default useSessionStorage
