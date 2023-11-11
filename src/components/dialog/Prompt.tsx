import { Dialog as TWDialog } from '@headlessui/react'
import { CgSpinnerAlt } from 'react-icons/cg'
import { HiCheckCircle, HiHandRaised, HiXCircle } from 'react-icons/hi2'
import Dialog from '.'
import Form from '../forms'
import Button from '../forms/Button'
import { SubmitInput } from '../forms/SubmitInput'
import useDisableDialog from './useDisableDialog'

export default function Prompt({
  children,
  label,
  size = 'max-w-sm',
  className = 'p-6 shadow-xl md:p-12',
  containerClass = 'items-start pt-28',
  unmount = false,
  onClose,
  ...rest
}: any) {
  return (
    <Dialog unmount={unmount} className={containerClass} onCancel={onClose} size={size} {...rest}>
      <div className={className}>{children}</div>
    </Dialog>
  )
}

export function AlertPrompt(props: any) {
  const handleClose = () => {
    props.onClick?.()
    props.onClose()
  }

  return (
    <Prompt {...props} className='flex flex-col items-center gap-6 p-6 shadow-xl bg-base-100 rounded-xl md:p-12'>
      {props.icon ? <props.icon className='w-36 h-36' /> : null}
      <div className='text-center'>
        <TWDialog.Title as='h3' className='text-4xl uppercase'>
          {props.label || 'Alert!'}
        </TWDialog.Title>
        <p className='text-lg font-light '>{props.description}</p>
      </div>
      <button type='button' className='w-full mt-4 rounded-full btn btn-md ' onClick={handleClose}>
        {props.btnTxt || 'Close'}
      </button>
    </Prompt>
  )
}

export function SuccessPrompt(props: any) {
  const handleClose = () => {
    props.onClick?.()
    props.onClose()
  }
  return (
    <Prompt {...props} className='flex flex-col items-center gap-6 p-6 shadow-xl bg-base-100 rounded-xl md:p-12'>
      {props.icon ? <props.icon className='text-green-500 w-36 h-36' /> : <HiCheckCircle className='text-green-500 w-36 h-36' />}
      <div className='text-center'>
        <TWDialog.Title as='h3' className='text-4xl uppercase'>
          {props.label || 'Success'}
        </TWDialog.Title>
        <p className='text-lg font-light '>{props.description}</p>
      </div>
      <button type='button' className='w-full mt-4 text-white bg-green-500 border rounded-full hover:bg-green-600 btn btn-md btn-ghost' onClick={handleClose}>
        {props.btnTxt || 'Close'}
      </button>
    </Prompt>
  )
}

export function ErrorPrompt(props: any) {
  const handleClose = () => {
    props.onClick?.()
    props.onClose()
  }
  return (
    <Prompt {...props} className='flex flex-col items-center gap-6 p-6 shadow-xl bg-base-100 rounded-xl md:p-12'>
      {props.icon ? <props.icon className='text-error w-36 h-36' /> : <HiXCircle className='text-error w-36 h-36' />}
      <div className='text-center'>
        <TWDialog.Title as='h3' className='text-4xl uppercase'>
          {props.label || 'Error'}
        </TWDialog.Title>
        <p className='text-lg font-light '>{props.description}</p>
      </div>
      <button type='button' className='w-full mt-4 text-white border rounded-full btn btn-md btn-error ' onClick={handleClose}>
        {props.btnTxt || 'Close'}
      </button>
    </Prompt>
  )
}

export function WarningPrompt({ onYes = () => {}, error, ...props }: any) {
  return (
    <Prompt {...props} className='flex flex-col items-center gap-6 p-6 shadow-xl bg-base-100 rounded-xl md:p-12'>
      <span className={`p-4 border-8 rounded-full ${error ? 'border-error text-error' : 'border-warning text-warning'}`}>
        {props.icon ? (
          <props.icon className={`w-28 h-28 ${error ? 'text-error' : 'text-warning'}`} />
        ) : (
          <HiHandRaised className={`w-28 h-28 ${error ? 'text-error' : 'text-warning'}`} />
        )}
      </span>
      <div className='text-center'>
        <TWDialog.Title as='h3' className='mb-2 text-3xl font-semibold'>
          {props.label || 'Are You Sure?'}
        </TWDialog.Title>
        <p className='text-lg font-light '>{props.description}</p>
      </div>
      <div className='w-full'>
        <p className='text-lg font-light '>{props.footerTxt}</p>
        <div className='flex w-full gap-2 mt-2'>
          <Button type='button' className='text-white btn btn-md btn-error grow' onClick={() => onYes(props)}>
            {props.yesTxt || 'Yes'}
          </Button>
          <button type='button' className='text-white btn btn-md btn-accent grow' onClick={props.onClose}>
            {props.noTxt || 'No'}
          </button>
        </div>
      </div>
    </Prompt>
  )
}

export function ConfirmPrompt({
  onYes = () => {},
  onNo = (props: any) => {
    props.onClose()
  },
  isCheck,
  onCheck: a,
  activeKey,
  ...props
}: any) {
  const { onRemove, Select } = useDisableDialog({ isCheck, activeKey })

  const handleNo = () => {
    onNo(props)
    onRemove()
  }

  const handleSubmit = async (values:any)=>{
    await onYes({...props, ...values})
    return true
  }

  return (
    <Prompt {...props} className={`flex flex-col items-center gap-6 p-6  shadow-xl bg-base-100 rounded-xl md:p-12 ${a ? ' md:pb-6 pb-3' : ''}`}>
      <span className='p-4 border-8 rounded-full border-info text-info'>
        {props.icon ? <props.icon className='w-28 h-28 ' /> : <HiHandRaised className='w-28 h-28' />}
      </span>
      <Form onSubmit={handleSubmit}>
        <div className='text-center'>
          <TWDialog.Title as='h3' className='mb-2 text-3xl font-semibold'>
            {props.label || 'Are You Sure?'}
          </TWDialog.Title>
          <p className='text-lg font-light '>{props.description}</p>
        </div>
        <div className='flex w-full gap-2'>
          <button type='button' className='mt-4 btn btn-md btn-error text-gray-50 grow' onClick={handleNo}>
            {props.noTxt || 'No'}
          </button>
          <SubmitInput className='mt-4 text-white btn btn-md btn-accent grow'>
            {props.yesTxt || 'Yes'}
          </SubmitInput>
        </div>
      </Form>
      <Select />
    </Prompt>
  )
}

export function InfoPrompt({ onClick = () => {}, isCheck, onCheck: a, activeKey, ...props }: any) {
  const { Select } = useDisableDialog({ isCheck, activeKey })

  const handleClose = () => {
    props.onClick?.()
    props.onClose()
  }
  return (
    <Prompt {...props} className={`flex flex-col items-center gap-6 p-6  shadow-xl bg-base-100 rounded-xl md:p-12 ${a ? ' md:pb-6 pb-3' : ''}`}>
      <span className='p-4 border-8 rounded-full border-info text-info'>
        {props.icon ? <props.icon className='w-28 h-28 ' /> : <HiHandRaised className='w-28 h-28' />}
      </span>
      <div className='text-center'>
        <TWDialog.Title as='h3' className='mb-2 text-3xl font-semibold'>
          {props.label}
        </TWDialog.Title>
        <p className='text-lg font-light '>{props.description}</p>
      </div>
      <div className='flex w-full gap-2'>
        <Button type='button' className='mt-4 text-white btn btn-md btn-accent grow' onClick={handleClose}>
          {props.btnTxt || 'OK'}
        </Button>
      </div>
      <Select />
    </Prompt>
  )
}

export function LoadingPrompt({ ...props }: any) {
  return (
    <Prompt
      open
      {...props}
      className='flex flex-col items-center gap-6 p-6 shadow-xl bg-base-100 rounded-xl md:p-12'
      containerClass='items-center'
      wiggle={false}
    >
      {props.img ? (
        <props.img />
      ) : props.icon ? (
        <span className='p-4 border-8 rounded-full border-info text-info'>
          <props.icon className='w-20 h-20 ' />
        </span>
      ) : (
        <CgSpinnerAlt className='w-20 h-20 animate-spin text-info' />
      )}
      <div className='text-center'>
        <TWDialog.Title as='h3' className='mb-2 text-3xl font-semibold'>
          {props.label}
        </TWDialog.Title>
        <p className='text-lg font-light '>{props.description}</p>
      </div>
    </Prompt>
  )
}
