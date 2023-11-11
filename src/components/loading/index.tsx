function Loading({ className = 'h-full' }: any) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div>
        <div className='relative flex items-center justify-center'>
          <div className='absolute inline-flex w-full rounded-full opacity-75 animate-ping bg-brandSecondary-500 aspect-square' />
          <div className='absolute w-[80%] rounded-full opacity-75 bg-brandSecondary-500 aspect-square shadow-[0px_0px_20px_10px] shadow-secondary' />
          <img src='/images/logo-symbol.ico' width={50} height={50} className='relative z-10 object-cover' alt='' />
        </div>
      </div>
    </div>
  )
}

export default Loading
