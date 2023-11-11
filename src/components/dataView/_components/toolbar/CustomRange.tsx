import { FaInfoCircle } from 'react-icons/fa'
import Form from '../../../forms'
import TextInput from '../../../forms/TextInput'
import Popover from '../../../popover'
import { useDataView } from '../../DataView.provider'

function extractPages(pageRange: any) {
  if (!pageRange) return []
  const regex = /\d+(?:-\d+)?/g
  const pages = pageRange.match(regex).flatMap((page: any) => {
    if (page.includes('-')) {
      const [start, end] = page.split('-').map((num: any) => parseInt(num, 10) - 1)
      return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }
    return parseInt(page, 10) - 1
  })
  return pages
}

function CustomRange() {
  const { rangeable, store } = useDataView()
  const table = store((state: any) => state.table)
  const limit = store((state: any) => state.limit)
  if (!rangeable) return null

  const handleSubmit = ({ range }: any) => {
    const pages = extractPages(range).filter((item: any) => item < table.getRowModel().rows.length)
    table.setRowSelection(() => pages.reduce((obj: any, el: any) => ({ ...obj, [el]: true }), {}))
    return true
  }

  return (
    <div className='flex items-center gap-2'>
      <Popover className='flex items-center' placement='bottom-start'>
        <FaInfoCircle className='w-5 h-5 p-0 bg-white rounded-full cursor-pointer text-accent' />
        {(attr: any) => (
          <div className='p-2 mb-2 border shadow-md dark:border-base-300 bg-base-100 dark:bg-base-300 rounded-box' {...attr}>
            <ul className='pl-6 list-disc'>
              <li>Maximum selected records is {limit}</li>
              <li>Records selected has to be within the current table</li>
            </ul>
          </div>
        )}
      </Popover>
      <div className='form-control'>
        <Form onSubmit={handleSubmit} className='input-group'>
          <TextInput name='range' placeholder='Custom Range (e.g. 1-5, 10)' containerClass='w-56' className='w-full rounded-r-none input input-bordered input-sm' />
          <button type='submit' className='btn btn-square btn-sm btn-success'>
            GO
          </button>
        </Form>
      </div>
    </div>
  )
}

export default CustomRange
