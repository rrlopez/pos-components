function Empty({ className = '', message ='contact us if your not suppose to be seeing this' }: any) {
  return (
    <div className={`flex flex-col items-center justify-center h-full gap-2 grow ${className}`}>
      <img alt='' src='/images/empty-data.png' className='object-contain sm:w-1/6 sm:h-1/6 w-1/4 h-1/4 max-w-[150px] max-h-[150px]' />
      <div className='text-3xl font-bold text-gray-500'>No Result Found</div>
      <p className='text-gray-400'>{message}</p>
    </div>
  )
}

export default Empty
