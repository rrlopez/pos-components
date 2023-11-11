/* eslint-disable no-use-before-define */
import { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { Controller, useFormContext } from 'react-hook-form';

export default function ({onChange, ...props}: any) {
  const { control }: any = useFormContext()

  return (
    <Controller 
        control={control} 
        name={props.name}  
        render={({ field }) => <DatePickerInput {...props} {...field} />} 
    />
  )
}

export const DatePickerInput = forwardRef(({value, placeholder, ...props}: any, ref) => {

  return (
    <DatePicker ref={ref} selected={value} placeholderText={placeholder} {...props} />
  )
})
