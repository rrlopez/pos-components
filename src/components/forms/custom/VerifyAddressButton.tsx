import Joi from "joi"
import { debounce } from "lodash"
import { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "react-hot-toast"
import { BsFillMapFill } from "react-icons/bs"
import coreAPI from "../../../api/coreAPI"
import { timeout } from "../../../utils"
import Button from "../Button"

const showInternationalError = debounce(()=>{
  toast.error('Sorry, Address Verification Is Only For U.S. Addresses')
}, 250)

function VerifyAddressButton({name = 'addressBook', fieldNames = {}, onVerifyError = ()=>{} }: any) {
    const { getValues, onUpdateRate, trigger, setValue, reset }:any = useFormContext()
    let value = getValues()[name] || {}
    value = {
      acct_id: value.acct_id,
      address: value.address,
      address2: value.address2,
      city: value.city,
      company: value.company,
      country: value.country || 'US',
      email: value.email,
      first_name: value.first_name,
      last_name: value.last_name,
      phone: value.phone,
      [fieldNames.postal || 'postal_code']: value[fieldNames.postal || 'postal_code'],
      [fieldNames.state || 'province']: value[fieldNames.state || 'province'],
    }

    const validatedValue = useMemo(() => {
      const dataValidator = Joi.object({
        company: Joi.string().allow(null, '').label('company'),
        address: Joi.string().required().label('address'),
        address2: Joi.string().allow(null, '').label('address2'),
        city: Joi.string().allow(null, '').label('city'),
        [fieldNames.postal || 'postal_code']: Joi.string().required().label('postal'),
        [fieldNames.state || 'province']: Joi.string().allow(null, '').label('state'),
        country: Joi.string().allow(null, '').label('country'),
      }).unknown(true)

      const result = dataValidator.validate(getValues()[name], { abortEarly: false })
      if (result.error) setValue(`${name}.bypass`, false)
      return result

    }, Object.values(value)) || {}

    const handleVerify = async () => {
      if(validatedValue.error) return
      if(value.country !== 'US'){
        showInternationalError()
        return
      }

      const result = await coreAPI.verifyAddress({
        address: {
          addressLines: [value.address, value.address2],
          cityTown: value.city,
          stateProvince: value[fieldNames.state || 'province'],
          postalCode: value[fieldNames.postal || 'postal_code'],
          countryCode: value.country,
          name: value.company,
        },
      })
  
      if (result.error) {
        if(value.country === 'US') setValue(`${name}.bypass`, true)
        onVerifyError()
      }
      else {
        const {verifyAddress, address, city, province, postal_code, ...error} = getValues().error || {}
        setValue('error', error)
        setValue(`${name}.address`, result.data.addressLines[0])
        setValue(`${name}.${fieldNames.state || 'province'}`, result.data.stateProvince)
        setValue(`${name}.${fieldNames.postal || 'postal_code'}`, result.data.postalCode)
        setValue(`${name}.city`, result.data.cityTown)
        setValue(`${name}.country`, result.data.countryCode)
        setValue(`${name}.bypass`, false)
        timeout(()=>onUpdateRate?.({ getValues, setValue, reset, trigger }), 150)
        
        toast.success('Verified Address')
      }
    }

    return (
      <Button
        tabIndex={-1}
        className='gap-1 capitalize rounded-full btn btn-xs btn-accent btn-outline hover:!text-white'
        onClick={handleVerify}
        prefix={<BsFillMapFill />}
        disabled={validatedValue.error}
      >
        Verify Address
      </Button>
      )
  }
  
  export default VerifyAddressButton