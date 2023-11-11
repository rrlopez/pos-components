function Error({ className = '', message ='contact us if your not suppose to be seeing this' }: any) {
  return (
    <div className={`flex flex-col items-center justify-center h-full gap-2 grow ${className}`}>
      <img alt='' src='/images/error-data.png' width={150} height={120} className='object-cover' />
      <div className='text-3xl font-bold text-gray-500'>Something Went Wrong!</div>
      <p className='text-gray-400'>{message}</p>
    </div>
  )
}

export default Error
