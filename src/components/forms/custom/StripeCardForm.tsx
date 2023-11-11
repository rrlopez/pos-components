import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useTheme } from 'next-themes'
import Form from '..'
import { SubmitInput } from '../SubmitInput'

const stripePromise = loadStripe(process.env.APP_STRIPE_KEY as string)

export default function(props:any) {
  return (
    <Elements stripe={stripePromise}>
      <StripeCardForm {...props}/>
    </Elements>
  )
}

export function StripeCardForm({onSubmit, btnTxt='Update Card', ...props}: any) {
  const stripe: any = useStripe()
  const elements = useElements()

  const handleSubmit = async () => {
    if (!stripe || !elements) return

    const payload = await stripe.createToken(elements.getElement(CardElement))
    if(!payload.token) return
    if(await onSubmit(payload)) elements.getElement(CardElement)?.clear();
  }

  return (
    <Form onSubmit={handleSubmit} {...props}>
      <StripeCardInput className='input input-sm input-bordered w-[400px]' />
      <SubmitInput className='capitalize rounded-full btn btn-secondary btn-xs text-gray-950'>
        {btnTxt}
      </SubmitInput>
    </Form>
  )
}

export function StripeCardInput({className}: any) {
  const { theme } = useTheme()

  return (
    <CardElement
        options={{
          classes: {
            base: `[&>div]:grow flex items-center ${className}`,
          },
          style: {
            base: {color: theme==='dark' ? 'white' : 'inherit'}
          }
        }}
      />
  )
}
