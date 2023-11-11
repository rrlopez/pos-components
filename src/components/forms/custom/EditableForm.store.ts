import { create } from 'zustand'

const useEditableForm = create((set: any) => ({
  setDefaultValues: (defaultValues: any) => set((state: any) => ({ ...state, defaultValues })),
  setIsEditForm: (id: any, isEditForm: any) => set((state: any) => ({ ...state, [id]: { isEditForm } })),
}))
export default useEditableForm
