/* eslint-disable no-use-before-define */
import { Disclosure, Popover, Portal, Transition } from '@headlessui/react'
import { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import { HiChevronUp } from 'react-icons/hi2'
import { usePopper } from 'react-popper'
import { useDashboard } from '../../dashboard/Dashboard.provider'
import SidebarLink from './SidebarLink'

export function SidebarGroupLinks({ children, ...rest }: any) {
  const { showSidebar, isTablet, isPhone } = useDashboard()
  const [open, setOpen] = useState(false)
  const self = useRef() as any
  const content = useRef() as any

  useLayoutEffect(() => {
    if (content.current) {
      if (content.current.childElementCount < 1) self.current.classList.add('hidden')
      else if (content.current?.querySelector('.active')) {
        self.current.querySelector('#title').classList.add('active')
        setOpen(true)
      }
    }
  }, [location.pathname, location.search, showSidebar, isPhone, isTablet])

  if (isTablet === undefined) return null

  return showSidebar ? <DisclosureItem ref={self} {...rest} content={content} open={open} /> : <PopoverItem ref={self} {...rest} content={content} />
}

const DisclosureItem = forwardRef(({ icon, label, links, active, notifCount }: any, ref: any) => (
  <Disclosure ref={ref} as='div'>
    {({ open }) => (
      <>
        <Disclosure.Button className={`sidebar-button ${active ? 'active' : ''}`}>
          <div className='flex items-center gap-4'>
            <div className='indicator'>
              {notifCount ? (
                <div className='h-5 border text-gray-800 font-bold border-base-100 indicator-item badge badge-xs bg-secondary min-w-[20px]'>{notifCount}</div>
              ) : null}
              {icon}
            </div>
            <span>{label}</span>
          </div>
          <HiChevronUp className={`${open ? 'rotate-180 transform' : ''} h-4 w-4`} />
        </Disclosure.Button>
        <Transition
          show={open}
          enter='transition duration-100 ease-out'
          enterFrom='transform scale-95 opacity-0'
          enterTo='transform scale-100 opacity-100'
          leave='transition duration-75 ease-out'
          leaveFrom='transform scale-100 opacity-100'
          leaveTo='transform scale-95 opacity-0'
        >
          <Disclosure.Panel className='mt-1 rounded-md bg-base-100' static>
            {links.map((props: any) => (
              <SidebarLink key={props.href} {...props} showLabel />
            ))}
          </Disclosure.Panel>
        </Transition>
      </>
    )}
  </Disclosure>
))

export const PopoverItem = forwardRef(({ icon, label, title = label, links, active, children, notifCount, ...props }: any, ref: any) => {
  const [referenceElement, setReferenceElement] = useState() as any
  const [popperElement, setPopperElement] = useState() as any
  const { styles, attributes }: any = usePopper(referenceElement, popperElement, {
    placement: 'right-start',
  })

  return (
    <Popover ref={ref}>
      <div className='flex flex-col items-center'>
        <Popover.Button ref={setReferenceElement} className={`sidebar-button ${active ? 'active' : ''} tooltip tooltip-title tooltip-right`} data-tip={title}>
          <div className='indicator'>
            {notifCount ? (
              <div className='h-5 border text-gray-800 font-bold border-base-100 indicator-item badge badge-xs bg-secondary min-w-[20px]'>{notifCount}</div>
            ) : null}
            <div className='flex items-center gap-4'>{icon}</div>
          </div>
        </Popover.Button>
        <div className={`text-2xs relative cursor-pointer pointer-events-none text-gray-500 ${active ? '' : 'top-[-10px]'}`}>{props.shortLabel}</div>
      </div>
      <Portal>
        <Transition
          enter='transition duration-100 ease-out'
          enterFrom='transform opacity-0'
          enterTo='transform  opacity-100'
          leave='transition duration-75 ease-out'
          leaveFrom='transform opacity-100'
          leaveTo='transform opacity-0'
          className='relative z-10'
        >
          <Popover.Panel ref={setPopperElement} style={styles.popper} {...attributes.popper} className='sidebar-popover'>
            <div className='sidebar-label'>{label}</div>
            {children || links.map((props: any) => <SidebarLink key={props.href} {...props} className='' showLabel />)}
          </Popover.Panel>
        </Transition>
      </Portal>
    </Popover>
  )
})

export default SidebarGroupLinks
