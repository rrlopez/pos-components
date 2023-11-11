import { useId } from 'react'
import { useFormContext } from 'react-hook-form'
import Form from '..'
import { mapFieldToAbsolutePath } from '../../../utils'
import { showModal } from '../../../utils/Overlay'
import useEffectOnce from '../../../utils/hooks/useEffectOnce'
import { SubmitInput } from '../SubmitInput'
import useEditableForm from './EditableForm.store'

function ActionButtons({ isEditForm, setIsEditForm, onCancel, className = 'mt-4' }: any) {
  const { reset } = useFormContext()

  const handleCancel = () => {
    reset()
    onCancel()
    setIsEditForm(false)
  }

  return (
    <div className={`flex justify-end w-full gap-1 ${className}`}>
      {isEditForm ? (
        <>
          <SubmitInput value='Save' className='text-white btn btn-sm btn-accent' />
          <span className='btn btn-outline hover:!text-white btn-sm' onClick={handleCancel}>
            Cancel
          </span>
        </>
      ) : (
        <span
          className='text-white btn btn-accent btn-sm'
          onClick={() => {
            setIsEditForm(true)
          }}
        >
          Edit
        </span>
      )}
    </div>
  )
}

function SubmitModal({ open, onClose, values, onSubmit, onSetIsEditForm }: any) {
  const handleYes = async () => {
    await onSubmit({ values, getFlatValues: (newVal: any) => mapFieldToAbsolutePath(newVal || values) })
    onSetIsEditForm(false)
    onClose()
  }

  return (
    <div className={`modal modal-bottom sm:modal-middle ${open ? 'modal-open' : ''}`}>
      <div className='modal-box'>
        <h3 className='text-lg font-bold'>Save</h3>
        <p className='py-4'>Are you sure you want to save changes?</p>
        <div className='modal-action'>
          <div className='text-white btn btn-error' onClick={handleYes}>
            Yes
          </div>
          <div
            className='text-white btn btn-accent'
            onClick={() => {
              onClose()
              onSetIsEditForm(false)
            }}
          >
            No
          </div>
          <div className='btn btn-outline hover:!text-white' onClick={onClose}>
            Cancel
          </div>
        </div>
      </div>
    </div>
  )
}

function EditableForm({ children, onSubmit, onCancel = () => {}, isStatic, id, btnClass = '', editing = false, ...rest }: any) {
  id = id || useId()
  const isEditForm = useEditableForm((state: any) => state?.isEditForm)
  const setIsEditForm = useEditableForm((state: any) => state.setIsEditForm)
  const setDefaultValues = useEditableForm((state: any) => state.setDefaultValues)

  const handleSetIsEditForm = (val: any) => {
    setIsEditForm(id, val)
  }

  useEffectOnce(() => {
    handleSetIsEditForm(editing)
    setDefaultValues(rest.defaultValues)
  })

  if (isEditForm === undefined) return null

  const handleSubmit = async (values: any) => {
    showModal(SubmitModal, {
      values,
      onSubmit,
      onSetIsEditForm: handleSetIsEditForm,
    })
  }

  return (
    <Form key={isEditForm} onSubmit={handleSubmit} id={id} {...rest}>
      {children}
      {isStatic || <ActionButtons isEditForm={isEditForm} setIsEditForm={handleSetIsEditForm} onCancel={onCancel} className={btnClass} />}
    </Form>
  )
}

export default EditableForm
