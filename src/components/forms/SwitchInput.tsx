/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import { Switch } from '@headlessui/react'
import { get } from 'lodash'
import { Fragment, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import useWindowSize from '../../utils/hooks/useWIndowSize'
import TextInput from './TextInput'
import useEditableForm from './custom/EditableForm.store'

export default function (props: any) {
  const { control, formState, ...context }: any = useFormContext()
  const isEditForm = useEditableForm((state: any) => state?.isEditForm) ?? true
  const { showErrorMsg = context.showErrorMsg, errorCss = 'text-red-500 text-sm', error, ...rest } = props

  if (!isEditForm || props.static)
    return (
      <>
        <Text {...props} />
        {props.static && <TextInput name={props.name} defaultValue={props.defaultValue} className='hidden' />}
      </>
    )
  const errorMsg = get(formState.errors, props.name)?.message as any
  rest.className = errorMsg ? `${rest.className} border-2 border-error disabled:border-red-200` : rest.className

  return (
    <>
      <Controller control={control} name={props.name} defaultValue={props.defaultValue} render={({ field }: any) => <SwitchInput {...field} {...rest} />} />
      {showErrorMsg && <div className={errorCss}>{errorMsg}</div>}
    </>
  )
}

function Text({ defaultValue, value = defaultValue, name, className }: any) {
  const defaultValues = useEditableForm((state: any) => state.defaultValues)
  const { getValues } = useFormContext()

  value = value ?? getValues(name) ?? get(defaultValues, name)
  const label = ''

  return <div className={`${className} flex items-center grey lighten-7 read-only border-0 border-b rounded-none p-0 font-semibold gap-1`}>{label}</div>
}

export function SwitchInput({ defaultValue, value, label, onChange = () => {}, className = 'w-18', style = {}, ...rest }: any) {
  const el: any = useRef()

  const handleChange = (checked: any) => {
    onChange({ target: { value: checked } })
  }

  return (
    <Switch defaultChecked={defaultValue} checked={value} onChange={handleChange} as={Fragment}>
      {({ checked }) => {
        const { width, height } = useWindowSize(el, [value, checked], 0)

        return (
          <button
          type='button'
          ref={el}
          className={`${checked ? 'bg-success' : 'bg-error'} ${className}
          disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-base-300 dark:disabled:text-gray-500
          text-white relative  inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          style={{...style, transform: checked ? `translateX(calc(100%-${width}px))` : 'translateX(0)' }}
          {...rest}
        >
          <div className={`flex w-full h-full ${checked ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-0.5 text-xs  ${checked && !rest.disabled?'text-black':''}`} style={checked ? { marginRight: height } : { marginLeft: height }}>
              {checked ? label[0] : label[1]}
            </div>
          </div>
          <span
            aria-hidden='true'
            style={{ transform: checked ? `translateX(calc(-100% + ${width}px))` : 'translateX(0)' }}
            className={`${
              rest.disabled ? 'bg-gray-400 dark:bg-gray-600' : 'bg-white/70'
            } pointer-events-none absolute h-full aspect-square transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </button>
        )
      }}
    </Switch>
  )
}
