import { HiArrowDownTray, HiArrowUpTray } from 'react-icons/hi2'
import { TbFileExport } from 'react-icons/tb'
import { showModal } from '../../../../utils/Overlay'
import useMediaQuery from '../../../../utils/hooks/useMediaQuery'
import { ConfirmPrompt } from '../../../dialog/Prompt'
import Button from '../../../forms/Button'
import { useDataView } from '../../DataView.provider'

function ImportExportButton() {
  const { id, importable, exportable, ...dataView } = useDataView()
  if (!importable && !exportable) return null
  const isDesktop = useMediaQuery('lg')
  const {setState} =  dataView.store.getState()
  const { allowEditFileName } = exportable

  const handleImport = async () => {
    await importable.onClick?.()
  }

  const handleFileNameChange = ({target}:any)=>{
    setState({exportFileName: target.value})
  }

  const handleExport = async () => {
    setState({exportFileName: allowEditFileName.default || ''})
    await showModal(ConfirmPrompt, {
      size: 'max-w-md',
      label: 'Export Data',
      description: <>
      {exportable.description || `The active columns will be exported into a CSV file`}
      {allowEditFileName?<div className='mt-4 text-base text-left'>
        <span>File Name</span>
        <input className='w-full input input-sm input-bordered' defaultValue={allowEditFileName.default || ''} onChange={handleFileNameChange}/>
      </div>:null}
      </>,
      onYes: async ({ onClose }: any) => {
        await exportable.onClick(dataView)
        onClose()
      },
      yesTxt: 'Export',
      noTxt: 'Cancel',
      icon: TbFileExport,
      activeKey: `${id}ImportPromptDisabled`,
    })
  }

  return (
    <div className='btn-group'>
      {importable ? (
        <button
          type='button'
          className={`flex gap-1 btn btn-outline hover:!text-white btn-xs dark:hover:!text-gray-950 capitalize  ${isDesktop ? '' : 'btn-square'}`}
          {...importable}
          onClick={handleImport}
        >
          <HiArrowDownTray className='w-4 h-4' />
          {isDesktop && 'Import'}
        </button>
      ) : null}
      {exportable ? (
        <Button
          className={`flex gap-1 btn btn-outline hover:!text-white dark:hover:!text-gray-950 btn-xs capitalize  ${isDesktop ? '' : 'btn-square'}`}
          {...exportable}
          onClick={handleExport}
          prefix={<HiArrowUpTray className='w-4 h-4' />}
        >
          {isDesktop && 'Export'}
        </Button>
      ) : null}
    </div>
  )
}
export default ImportExportButton
