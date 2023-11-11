/* eslint-disable jsx-a11y/tabindex-no-positive */
import { Dialog as TWDialog } from '@headlessui/react'
import { useState } from 'react'
import { HiArrowTopRightOnSquare, HiOutlineArrowsPointingIn, HiOutlineArrowsPointingOut, HiOutlineXMark } from 'react-icons/hi2'
import Dialog from '.'
import useMediaQuery from '../../utils/hooks/useMediaQuery'
import Link from '../link'

function Modal({ onClose, onCancel, children, label, link, unmount = false, maximize, className='', ...rest }: any) {
  const [expand, setExpand] = useState(false)
  const isPhone = useMediaQuery('sm') as any
  if (isPhone === undefined) return null

  const handleLinkClick = () => {
    if (link === location.pathname) {
      onClose?.()
      onCancel()
    }
  }

  return (
    <Dialog onClose={onClose} onCancel={onCancel} unmount={unmount} expand={expand} className={`items-end sm:items-center ${expand ? '' : 'sm:p-4'}`} {...rest}>
      <div className={`flex flex-col bg-base-100 ${className}`}>
        <div className='flex px-3 pt-2 md:px-6 md:pt-3'>
          <TWDialog.Title as='h3' className='flex items-center gap-2 text-lg font-medium leading-6 bg-base-100 grow'>
            {label}
          </TWDialog.Title>
          <div>
            {link && (
              <Link href={link} className='tooltip tooltip-bottom' data-tip='link'>
                <button type='button' className='btn btn-ghost btn-circle btn-sm' onClick={handleLinkClick}>
                  <HiArrowTopRightOnSquare className='w-6 h-6' />
                </button>
              </Link>
            )}
            {maximize?<div className='tooltip tooltip-bottom' data-tip={expand ? 'shrink' : 'expand'}>
              <button type='button' className='btn btn-ghost btn-circle btn-sm' onClick={() => setExpand(!expand)}>
                {expand ? <HiOutlineArrowsPointingIn className='w-6 h-6' /> : <HiOutlineArrowsPointingOut className='w-6 h-6' />}
              </button>
            </div>:null}
            <div className='tooltip tooltip-bottom' data-tip='close'>
              <button type='button' className='btn btn-ghost btn-circle btn-sm' onClick={onCancel || onClose}>
                <HiOutlineXMark className='w-6 h-6' />
              </button>
            </div>
          </div>
        </div>
        {children}
      </div>
    </Dialog>
  )
}

export default Modal
