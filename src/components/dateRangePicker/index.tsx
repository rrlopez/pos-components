import { Popover } from '@headlessui/react'
import moment from 'moment'
import { useState } from 'react'
import { DateRangePicker as Base } from 'react-date-range'

const STATIC_RANGES = [
  {
    label: 'All',
    range:()=>({
      startDate: null,
      endDate: null,
    }),
    isSelected(range:any) {
      return range.startDate === null
    },
  },
  {
    label: 'Today',
    range:()=>({
      startDate: new Date(),
      endDate: new Date(),
    }),
    isSelected(range:any){
      const {startDate, endDate} = this.range()
      return range.startDate.toString() === startDate.toString() &&  range.endDate.toString() === endDate.toString()
    }
  },
  {
    label: 'Current Week',
    range:()=>({
      startDate: (moment().startOf('isoWeek').subtract(1, 'days') as any)._d,
      endDate: (moment().endOf('isoWeek').subtract(1, 'days') as any)._d,
    }),
    isSelected(range:any){
      const {startDate, endDate} = this.range()
      return range.startDate.toString() === startDate.toString() &&  range.endDate.toString() === endDate.toString()
    }
  },
  {
    label: 'Current Month',
    range:()=>({
      startDate: (moment().startOf('month') as any)._d,
      endDate: (moment().endOf('month') as any)._d,
    }),
    isSelected(range:any){
      const {startDate, endDate} = this.range()
      return range.startDate.toString() === startDate.toString() &&  range.endDate.toString() === endDate.toString()
    }
  },
  {
    label: 'Year to Date',
    range:()=>({
      startDate: (moment().startOf('year') as any)._d,
      endDate: new Date(),
    }),
    isSelected(range:any){
      const {startDate, endDate} = this.range()
      return range.startDate.toString() === startDate.toString() &&  range.endDate.toString() === endDate.toString()
    }
  },
]

function DateRangePicker({values, defaultRange='Today', onChange = ()=>{}}:any) {
  const [ranges, setRanges] = useState(values = values || [(STATIC_RANGES.find(({label}:any)=>label===defaultRange) || STATIC_RANGES[1]).range()])
  

  const staticRanges = [...STATIC_RANGES, {
    label: 'Button',
    hasCustomRendering: true,
    range: () => ranges[0],
    isSelected: ()=>false
  }]

  const handleOnChange = (item: any)=>{
    setRanges( Object.values(item))
  }

  const handleApply = ()=>{
    onChange({target: {value: ranges}})
  }
  
  return (
    <Base
      onChange={handleOnChange}
      moveRangeOnFirstSelection={false}
      staticRanges={staticRanges}
      inputRanges={[]}
      months={2}
      ranges={ranges}
      editableDateInputs
      direction='horizontal'
      preventSnapRefocus
      className='overflow-hidden rounded-lg shadow-lg'
      renderStaticRangeLabel={()=><CustomStaticRangeLabelContent onClick={handleApply}/>}
      
    />
  )
}


function CustomStaticRangeLabelContent(props: any){
  return (
    <Popover.Button href="/insights" className='w-full capitalize rounded-full btn btn-primary btn-sm' {...props}>
      Apply
    </Popover.Button>
  );
}

export default DateRangePicker
