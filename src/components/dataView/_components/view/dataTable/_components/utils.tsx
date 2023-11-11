import { defaultRangeExtractor } from "@tanstack/react-virtual";
import { useCallback, useMemo, useRef, useState } from "react";
import useResizeObserver from "../../../../../../utils/hooks/useResizeObserver";

export const useDataViewTableWidth = ({isFullWidth = true}:any)=>{
    if(!isFullWidth) return { tableContainerRef: useRef(), getTableWidth: ()=>null }

    const [width, setWidth] = useState(0)
    const onResize = useCallback((target: HTMLDivElement) => setWidth(target.clientWidth), [])
    const tableContainerRef:any = useResizeObserver(onResize)

    const handleGetTableWidth = (colTotalSize: any)=>{
      return Math.max(colTotalSize-4, width-4) || 1
    }

    return {tableContainerRef, getTableWidth: handleGetTableWidth}
}

export const useStickyTableColumn = ({columnOrder, cols, freezable, table}:any)=>{
  const activeStickyIndexRef:any = useRef([])
  
  const stickyIndexes = useMemo(() => {
    return columnOrder.filter((col:any)=>cols.some(({id}:any)=>col===id)).map((id:any, i:any)=>{
      const {columnDef={}} = cols.find((col:any)=>col.id===id) || {}
      return {i, freezable: (freezable && columnDef.freezable) || columnDef.freezable?.permanent}
    })
    .filter(({freezable}:any)=>freezable)
    .map(({i}:any)=>i)
  }, [cols, table])
  
  const isSticky = (index:any) => stickyIndexes.includes(index)

  const rangeExtractor = useCallback(
    (range:any) => {
      activeStickyIndexRef.current = [...stickyIndexes]
        .reverse()
        .filter((index:any) => range.startIndex >= index)

      const next = new Set([
        ...activeStickyIndexRef.current,
        ...defaultRangeExtractor(range),
      ])

      return [...next].sort((a, b) => a - b)
    },
    [stickyIndexes],
  )

  return {activeStickyIndexRef, stickyIndexes, isSticky, rangeExtractor}
}