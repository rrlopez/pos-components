/* eslint-disable no-use-before-define */
import { forwardRef, useImperativeHandle } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, useFormContext } from 'react-hook-form';

export default function ({onChange, ...props}: any) {
  const { control }: any = useFormContext()

  return (
    <Controller 
        control={control} 
        name={props.name}  
        render={({ field }) => <ReCaptchaInput {...props} {...field} />} 
    />
  )
}

export const ReCaptchaInput = forwardRef((props: any, ref) => {

  useImperativeHandle(ref, () => {
    return { focus: () =>{} }
  })

  return (
    <ReCAPTCHA ref={ref} sitekey={process.env.APP_GOOGLE_RECAPTCHA_KEY} {...props} />
  )
})
