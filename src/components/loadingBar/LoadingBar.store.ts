import { create } from 'zustand'
import { getStoreStateSetter } from '../../utils/store/utils'

const useLoadingBar = create(set => ({
  setState: getStoreStateSetter(set),
}))

export default useLoadingBar
