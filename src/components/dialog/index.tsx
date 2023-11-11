import { Dialog as TWDialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { timeout } from '../../utils';
import useMediaQuery from '../../utils/hooks/useMediaQuery';

function Dialog({ open, onClose, onCancel, children, expand, className = `items-end sm:items-center ${expand ? '' : 'sm:p-4'}`, containerClass='', unmount, size = 'max-w-5xl', wiggle=true }: any) {
  const isPhone = useMediaQuery('sm') as any
  if (isPhone === undefined) return null

  const handleClick = (e: any) => {
    e.stopPropagation()
    if (onClose || !wiggle) return

    e.target.classList.remove('animate-[wiggle_0.3s_ease-in-out]')
    timeout(() => {
      e.target.classList.add('animate-[wiggle_0.3s_ease-in-out]')

      e.target.addEventListener(
        'animationend',
        () => {
          e.target.classList.remove('animate-[wiggle_0.3s_ease-in-out]')
        },
        false
      )
    }, 100)
  }

  return (
    <Transition appear show={open} as={Fragment} unmount={unmount}>
      <TWDialog as='div' className='relative z-50' onClose={onClose || (() => {})} unmount={unmount} autoFocus>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
          unmount={unmount}
          children={<div  className='fixed inset-0 bg-black bg-opacity-25'/>}
        />
        <div className='fixed inset-0 overflow-hidden'>
          <div className={`flex min-h-full justify-center ${className} text-center overflow-clip`} onClick={handleClick} >
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-200'
              enterFrom={isPhone ? 'opacity-0 scale-95' : 'translate-y-[100%]'}
              enterTo={isPhone ? 'opacity-100 scale-100' : 'translate-y-0'}
              leave='ease-in duration-200'
              leaveFrom={isPhone ? 'opacity-100 scale-100' : 'translate-y-0'}
              leaveTo={isPhone ? 'opacity-0 scale-95' : 'translate-y-[100%]'}
              unmount={unmount}
            >
              <TWDialog.Panel
                className={`w-full ${containerClass} ${
                  expand ? 'h-screen' : `${size} rounded-t-3xl sm:rounded-2xl`
                } transform overflow-hidden text-left align-middle shadow-xl transition-all flex flex-col`}
              >
                {children}
              </TWDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </TWDialog>
    </Transition>
  )
}

export default Dialog
