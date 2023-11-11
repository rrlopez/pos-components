import { useDataView } from '../../DataView.provider'
import DataViewContainer from '../view'

function DefaultDisplay(props:any) {
  const { Footer = () => null } = useDataView()

  return (
    <>
      <DataViewContainer {...props} />
      <Footer />
    </>
  )
}

export default DefaultDisplay
