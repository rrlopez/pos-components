import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { useDataViewStore } from '../../dataView/DataView.provider'
import { Select2Input } from '../Select2Input'

function SelectLabelInput({ by = 'id', setState, optionTemplate, ...rest }: any) {
  const options = useDataViewStore((state: any) => state?.data || [])

  const handleChange = ({ target }: any) => {
    setState({ data: target.value })
  }

  const index = options.indexOf(options.find((option: any) => option.id === rest.value.id))

  return (
    <div className='flex items-center justify-center'>
      <button
        type='button'
        className='btn btn-circle btn-ghost hover:btn-secondary hover:btn-outline hover:!text-white btn-xs'
        onClick={() => handleChange({ target: { value: options[index ? index - 1 : options.length - 1] } })}
      >
        <HiChevronLeft className='w-4 h-4' />
      </button>
      <Select2Input by={by} onChange={handleChange} options={options.map(optionTemplate)} {...rest} className='hover:underline' />
      <button
        type='button'
        className='btn btn-circle btn-ghost hover:btn-secondary hover:btn-outline hover:!text-white btn-xs'
        onClick={() => handleChange({ target: { value: options[(index + 1) % options.length] } })}
      >
        <HiChevronRight className='w-4 h-4' />
      </button>
    </div>
  )
}

export default SelectLabelInput
