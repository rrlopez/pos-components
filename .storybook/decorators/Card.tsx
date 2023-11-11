import React from 'react'

function CardDecorator({ children }) {
  return (
    <div className='flex items-center justify-center h-full'>
      <div className='w-1/3'>{children}</div>
    </div>
  )
}

export default CardDecorator
