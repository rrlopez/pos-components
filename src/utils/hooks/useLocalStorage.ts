import { useState } from 'react'

export const getLocalStorage = (keyName: any, defaultValue?: any) => {
  let value: any
  try {
    value = JSON.parse(window.localStorage.getItem(keyName) as any) ?? undefined
      if (defaultValue) {
        window.localStorage.setItem(keyName, JSON.stringify({ ...defaultValue, ...value }))
        return { ...defaultValue, ...value }
      }
      return value || defaultValue
  } catch (err) {
    return value || defaultValue
  }
}

export const setLocalStorage = (keyName: any, newValue: any) => {
  try {
    window.localStorage.setItem(keyName, JSON.stringify(newValue))
  } catch (err) {
    return undefined
  }
  return undefined
}

const useLocalStorage = (keyName: any, defaultValue: any) => {
  const [_update, setUpdate] = useState()
  const storedValue = getLocalStorage(keyName, defaultValue)

  const setValue = (newValue: any) => {
    setLocalStorage(keyName, newValue)
    setUpdate(newValue)
  }

  return [storedValue, setValue]
}

export default useLocalStorage
