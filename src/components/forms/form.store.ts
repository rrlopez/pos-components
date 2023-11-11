import { create } from 'zustand'
import { getStoreStateSetter } from '../../utils/store/utils'

const createFormStore = () => {
  return create(set => ({
    defaultValues: undefined,
    hasChange: 1,
    setState: getStoreStateSetter((cb: any) => {
      set((state: any) => ({ hasChange: state.hasChange + 1 }))
      set(cb)
    }),
  }))
}

export default createFormStore
