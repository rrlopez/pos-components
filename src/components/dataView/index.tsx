/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
import { useMemo } from 'react'
import DataViewProvider from './DataView.provider'
import DataViewDisplay from './_components/display'
import Toolbar from './_components/toolbar'

function DataView({ options = {}, display = { type: 'default' }, toolbar, containerClass = '', Header = () => {}, ...rest }: any) {
  const viewsKeys = useMemo(() => {
    const desiredViewsKeys = Object.keys(rest.views.types)
    return desiredViewsKeys
  }, [])

  return (
    <DataViewProvider {...{ ...options, ...rest, viewsKeys, toolbar }}>
      <div className={`flex flex-col w-full h-full gap-2  bg-transparent dataview ${containerClass}`}>
        <Header />
        {toolbar?.component || <Toolbar />}
        <DataViewDisplay display={display} />
      </div>
    </DataViewProvider>
  )
}

export default DataView
