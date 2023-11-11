import { Popover as HeadlessUIPopover, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import { usePopper } from "react-popper"
import Portal from "../portal"

function Popover({children, className, containerClass='max-w-sm', placement='bottom-start', tabIndex, ...rest}:any) {
    const [referenceElement, setReferenceElement] = useState() as any
    const [popperElement, setPopperElement] = useState() as any
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
      placement,
    })
  
    return (
      <HeadlessUIPopover className='relative' as="span">
        <HeadlessUIPopover.Button tabIndex={tabIndex} ref={setReferenceElement} className={className}>
          {children[0]}
        </HeadlessUIPopover.Button>
        <Portal>
          <Transition
            as={Fragment}
            enter=' transition-opacity ease-out duration-200'
            enterFrom='opacity-0 translate-y-1'
            enterTo='opacity-100 translate-y-0'
            leave=' transition-opacity ease-in duration-150'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 translate-y-1'
          >
            <HeadlessUIPopover.Panel
              ref={setPopperElement}
              style={{ ...styles.popper }}
              {...attributes.popper}
              className={`absolute left-0 z-50 w-screen px-4 mt-3 sm:px-0 ${containerClass}`}
              {...rest}
            >
              {(attr) => children[1](attr)}
            </HeadlessUIPopover.Panel>
          </Transition>
        </Portal>
      </HeadlessUIPopover>
    )
}

export default Popover