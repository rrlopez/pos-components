import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import authAPI from '../api/auth'
import { getStoreStateSetter } from '../utils/store/utils'

const useAuth = create(
  persist(
    (set: any, get: any) => ({
      inactive: false,
      authenticating: undefined,
      logoutTimer: undefined,
      async authenticate(userID: any, onFetchUser:any) {
        const { authenticating, setState } = get()
        if (authenticating !== undefined) return authenticating

        let user: any = authAPI.getCurrentUser() || {}
        if (!user.id || (!!process.env.APP_MAINTENANCE && !process.env.APP_MAINTENANCE.split(',').some((id)=>+id===user.id))) {
          set((state: any) => ({ ...state, user:{}, authenticating: false }))
          return false
        }

        set((state: any) => ({ ...state, user, authenticating: true }))

        if (user.id === userID) set((state: any) => ({ ...state, authenticating: false, isLoading: true }))
        user = await onFetchUser(user)

        // set fetched user info in store
        setState((state:any)=>{
          state.isLoading = false
          state.authenticating = false
          state.user = {...user, ...(state.user || {})}
        })

        if(!user) get().logout()
        
        return authenticating
      },
      setState: getStoreStateSetter(set),
      isAuthorize: () => !!get().user,
      async logout(redirect = true) {
        if(redirect) set((state: any) => ({ ...state, user: {}, authenticating: undefined }))
        localStorage.removeItem(process.env.APP_STORAGE as string)
        localStorage.removeItem('viewAccount')
        authAPI.logout(redirect)
      },
    }),
    {
      name: 'me',
      storage: createJSONStorage(() => localStorage as any),
      partialize: (state: any) => {
        const { id, name } = state.user || {}
        return { user: { id, name } }
      },
    },
  ),
)

export default useAuth
