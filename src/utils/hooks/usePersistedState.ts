import useLocalStorage, { getLocalStorage, setLocalStorage } from './useLocalStorage'

export const getPeristedState = (defaultValue: any) => getLocalStorage(process.env.APP_PERSIST_KEY, defaultValue)

export const setPersistedState = (newValue: { curPortal: any }, oldValue?: any) => {
  oldValue = oldValue || getPeristedState({})
  return setLocalStorage(process.env.APP_PERSIST_KEY, { ...oldValue, ...newValue })
}

const usePersistedState = (defaultValue = {}) => {
  const [storedValue, setStoredValue] = useLocalStorage(process.env.APP_PERSIST_KEY, defaultValue)

  const handleChange = (newValues: any) => {
    setStoredValue({ ...storedValue, ...newValues })
  }

  return [storedValue || {}, handleChange]
}

export default usePersistedState
