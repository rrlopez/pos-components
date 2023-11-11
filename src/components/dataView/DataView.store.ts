import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getStoreStateSetter } from '../../utils/store/utils'

const store = (set: any) => ({
  table: {
    getRowModel: ()=>({
      rows: []
    }),
    getSelectedRowModel: ()=>({
      rows: []
    }),
    getVisibleFlatColumns: ()=>([]),
    getAllFlatColumns: ()=>([]),
    getState: ()=>({
      pagination: {}
    }),
    getPageCount: ()=>0
  },
  totalRow: 0,
  skip: 0,
  sortBy: ['id'],
  sortDirection: { id: { value: 'desc', priority: 0 } },
  searchValue: '',
  searchBy: {},
  columnOptions: [],
  filters: {},
  rowSelection: {},
  sorting: [],
  onInit: (payload: any) => set((dataViews: any) => ({ ...dataViews, ...payload })),
  setState: getStoreStateSetter(set),
})

const createDataViewStore = (name = '', options:any={}) => {
  if (name){
    return create(
      persist(store, {
        version: options.version,
        name: `${name}_dataview`,
        storage: createJSONStorage(() => localStorage as any),
        partialize: (state: any) => ({
          id: state.id,
          cols: state.cols.map(({ id, size, freezable }: any) => ({ id, size, freezable })),
          columnOrder: state.columnOrder,
          columnVisibility: state.columnVisibility,
          expiration: state.expiration,
          limit: state.limit
        }),
        migrate: (persistedState:any = {}, version)=>{
          if(options.version!==version) delete persistedState.id
          return persistedState
        },
      }),
    )
  }
    
  return create(store)
}

export default createDataViewStore
