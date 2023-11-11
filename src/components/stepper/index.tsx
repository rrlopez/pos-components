/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { SubmitInput } from '../forms/SubmitInput'

function Stepper({ steps, selectedStep = 0, onStepChange = () => {}, className = '', showIndicator = true, children }: any) {
  const { Component, button } = steps[selectedStep]
  
  const handleStepChange = () => {
    onStepChange(Math.max(selectedStep - 1, 0))
  }

  return (
    <>
      {showIndicator && steps.length > 1 && (
        <div className='flex justify-center w-full my-2'>
          <ul className='steps steps-horizontal justify-center w-full md:w-[80%]'>
            {steps.map((step: any, i: any) => (
              <li key={step.label} className={`cursor-pointer step ${i <= selectedStep ? 'step-primary' : ''}`} onClick={() => onStepChange(i)}>
                {step.label}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className='flex flex-col gap-4 grow'>
        <Component className={`flex flex-col space-y-3 overflow-overlay ${className}`} />
      </div>
      <div className='flex w-full gap-4'>
        <div className='grow'>{children}</div>
        {steps.length > 1 && selectedStep > 0 && (
          <button type='button' className='flex gap-1 capitalize rounded-full btn btn-xs' onClick={handleStepChange} disabled={selectedStep === 0}>
            <FaArrowLeft />
            Prev
          </button>
        )}
        <SubmitInput className='text-white capitalize rounded-full btn btn-xs btn-accent'>
          <FaArrowRight />
          {selectedStep >= steps.length - 1 ? button || 'Submit' : button || 'Next'}
        </SubmitInput>
      </div>
    </>
  )
}

export default Stepper
