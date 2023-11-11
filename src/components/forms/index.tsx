/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
import { joiResolver } from '@hookform/resolvers/joi'
import { useId, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { log, pause } from '../../utils'
import createFormStore from './form.store'

export default function Form({ defaultValues: dv, ...rest }: any) {
  const store = useRef(createFormStore())
  const defaultValues = store.current((state: any) => state.defaultValues)
  const setState = store.current((state: any) => state.setState)
  const hasChange = store.current((state: any) => state.hasChange)
  if (!defaultValues) setState({ defaultValues: dv || {} })

  return <Content key={hasChange} defaultValues={defaultValues} store={store.current} {...rest} />
}

function Content({ onSubmit, children, validator, defaultValues, id, className = '', showErrorMsg, isLoading, store, payload = {}, ...rest }: any) {
  id = id || useId()
  const buttonID = useRef()
  const [asyncErrors, setAsyncErrors] = useState([]) as any

  const methods = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: validator ? joiResolver(validator.schema, validator.options, validator.settings) : undefined,
  }) as any

  const handleSubmit = async ({ _reset, ...values }: any) => {
    const errors = {} as any
    const getErrors = (curValues: any) => {
      for (const curValue of curValues) {
        if (!curValue) continue
        if (curValue?.error) errors[curValue.error.name as any] = { message: curValue.error.message }
        else if (typeof curValue === 'object') getErrors(Object.values(curValue))
      }
    }
    getErrors(Object.values(values))
    setAsyncErrors(errors)

    if (Object.values(errors).length > 0) return

    try {
      const result = await onSubmit(values, methods)
      log('form return', result)
      await pause(250)
      if (result) {
        const { _reset, ...data } = result
        if (_reset) {
          const { setState } = store.getState()
          setState({ defaultValues: data })
          methods.reset(result)
        } else methods.reset(defaultValues)
      }
      else if(result === false){
        methods.setError("error", { type: "custom", message: "Failed to submit" });
      }
    } catch (e) {
      console.error(e)
    }
  }

  const custom = Object.entries(methods.getValues().error || {}).filter((entry)=>entry[1])
  log(
    'Form errors', 
    custom.length>0?{...methods.formState.errors, custom:custom.reduce((obj:any,[key, value])=>({...obj, [key]:value}), {})}: methods.formState.errors,
    {debaunce: true}
  )

  return (
    <FormProvider
      {...methods}
      id={id}
      buttonID={buttonID}
      asyncErrors={asyncErrors}
      showErrorMsg={showErrorMsg}
      isLoading={isLoading}
      store={store}
      {...payload}
    >
      <form noValidate onSubmit={methods.handleSubmit(handleSubmit)} className={`relative ${className}`} {...rest} tabIndex={-1}>
        {children}
      </form>
    </FormProvider>
  )
}
