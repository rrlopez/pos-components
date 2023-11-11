import { produce } from 'immer'
import { isFunction } from 'lodash'
import moment from 'moment'

export const sampleStoreUtil = () => null

export const getStoreStateSetter = (set: any) => (payloads: any) =>
  set((states: any) => {
    states = produce(states, (draft: any) => {
      draft.expiration = moment(new Date()).add(30, 'seconds').valueOf()
      if (isFunction(payloads)) payloads(draft)
      else
        Object.entries(payloads).forEach(([key, val]) => {
          draft[key] = val
        })
    })

    return states
  })
