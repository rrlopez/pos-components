/* eslint-disable react/jsx-no-constructed-context-values */
import numeral from 'numeral'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import useMediaQuery from '../../../../utils/hooks/useMediaQuery'
import Form from '../../../forms'
import TextInput from '../../../forms/TextInput'
import { useDataView } from '../../DataView.provider'
import DataViewContainer from '../view'

export const PaginatePosition = {
  BOTH: 'both',
  TOP_ONLY: 'topOnly',
  BOTTOM_ONLY: 'bottomOnly',
}

function Paginate({ position, ...props }: any) {
  const { Footer = () => null } = useDataView()

  return (
    <>
      {position !== PaginatePosition.BOTTOM_ONLY && (
        <div className='flex flex-col items-center gap-2 text-sm lg:flex-row'>
          <PaginateContent />
        </div>
      )}
      <DataViewContainer {...props} />
      <div className='flex flex-col items-center gap-2 text-sm lg:flex-row'>{position !== PaginatePosition.TOP_ONLY && <PaginateContent />}</div>
      <Footer />
    </>
  )
}

function PaginateContent() {
  const isDesktop = useMediaQuery('lg')
  const { store, refetch } = useDataView()
  const table = store((state: any) => state.table)
  const totalItems = store((state: any) => state.totalItems)
  const skip = table.getState().pagination.pageIndex
  const limit = table.getState().pagination.pageSize
  const totalPage = table.getPageCount()

  const handleGoTo = ({ page }: any) => {
    if (+page > 0 && +page - 1 !== skip && +page - 1 < totalPage) {
      table.setPageIndex(Math.max(Math.min(+page - 1, totalPage), 0))
      table.setRowSelection(() => ({}))
      refetch()
    }
    return true
  }

  const handleLimitChange = ({ target }: any) => {
    table.setPageSize(Number(target.value))
    table.setRowSelection(() => ({}))
    refetch()
  }

  const handlePrev = ()=>{
    table.previousPage()
    table.setRowSelection(() => ({}))
    refetch()
  }

  const handleNext = ()=>{
    table.nextPage()
    table.setRowSelection(() => ({}))
    refetch()
  }

  return (
    <>
      <div className='flex justify-center w-full py-2 lg:justify-between grow empty:hidden'>
        {totalItems ? (
          <div className={`flex items-center gap-4 ${totalPage > 1 ? 'grow lg:grow-0' : ''}`}>
            <div>{`Total: ${numeral(Math.max(totalItems, 0)).format('0,0')} ${
              totalPage > 1 ? ` | ${numeral(skip * limit + 1).format('0,0')} - ${numeral(Math.min((skip + 1) * limit, totalItems)).format('0,0')}` : ''
            }`}</div>
            <div>
              Per Page: <select value={limit} onChange={handleLimitChange} className='ml-1 rounded-lg dark:bg-base-300'>
                {[10, 20, 30, 40, 50, 100, 250].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>)
        :null}
        {isDesktop || (totalPage > 1 && <GoTo totalPage={totalPage} handleGoTo={handleGoTo} />)}
      </div>
      {totalPage > 1 && (
        <>
          <div className='flex gap-1'>
            <button type='button' className={`btn btn-ghost btn-circle btn-xs ${table.getCanPreviousPage()?'':'invisible'}`} onClick={handlePrev}>
              <HiChevronLeft className='w-5 h-5' />
            </button>
            <div className='btn-group'>
              {[...Array(Math.min(11, totalPage)).keys()]
                .map(i => i + Math.min(Math.max(skip - 5, 0), Math.max(totalPage - 11, 0)))
                .map(i => (
                  <button
                    type='button'
                    key={i}
                    className={`btn btn-xs w-10 ${i === skip ? 'btn-active' : ''}`}
                    onClick={() => {
                      handleGoTo({page: i+1})
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
            </div>
            <button type='button' className={`btn btn-ghost btn-circle btn-xs ${table.getCanNextPage()?'':'invisible'}`} onClick={handleNext}>
              <HiChevronRight className='w-5 h-5' />
            </button>
          </div>
          {isDesktop && <GoTo totalPage={totalPage} handleGoTo={handleGoTo} />}
        </>
      )}
    </>
  )
}

function GoTo({ totalPage, handleGoTo }: any) {
  return (
    <div className='flex gap-1'>
      <div className='whitespace-nowrap'>Total {numeral(totalPage).format('0,0')} Pages</div>
      <Form onSubmit={handleGoTo} className='w-auto input-group'>
        <TextInput type='number' name='page' className='w-12 text-lg rounded-r-none input input-xs input-bordered no-arrow ' />
        <button type='submit' className='btn btn-xs btn-square'>
          GO
        </button>
      </Form>
    </div>
  )
}

export default Paginate
