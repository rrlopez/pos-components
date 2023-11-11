import pluralize from "pluralize"
import { queryClient } from "../../../../App"
import { showModal } from "../../../../utils/Overlay"
import { WarningPrompt } from "../../../dialog/Prompt"
import { useDataView } from "../../DataView.provider"

function DeleteModal({ open, onClose, row, onClick, id, label = '' }: any) {

    const handleYes = async () => {
      if(await onClick([row.original], row.original)){
        queryClient.setQueryData(id, (data:any={})=>{
          const items = data.items.filter((data: any) => data.id !== row.original.id)
          return {
            items,
            totalItems: items.length
          }
        })
        onClose()
        return true
      }
      return false
    }
    
    return (
      <WarningPrompt
        open={open}
        onClose={onClose}
        label='Are You Sure?'
        description={`Do you really want to delete this ${pluralize.singular(label.props?.children || label)} record. This process cannot be undone.`}
        onYes={handleYes}
      />
    )
  }
  
  function DeleteButton({ row, children, onClick, ...rest }: any) {
    const dataView = useDataView()
    if (!dataView.deletable) return null
  
    const handleClick = (e: any) => {
      e.stopPropagation()
      showModal(DeleteModal, { row, ...dataView, onClick })
    }
  
    return (
      <button {...rest} type='button' onClick={handleClick} >
        {children}
      </button>
    )
  }

  export default DeleteButton