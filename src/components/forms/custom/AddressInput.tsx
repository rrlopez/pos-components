import { useFormContext } from "react-hook-form"
import GoogleAutoCompleteInput from "../GoogleAutoCompleteInput"

function AddressInput({ name = 'addressBook', fieldNames = {}, ...rest}: any) {
    const { setValue } = useFormContext()
  
    const handlePlaceSelected = (place: any) => {
      if(!place.address_components) return 
      const address = [
        place.address_components.find(({ types }: any) => types.some((type: any) => type === 'street_number'))?.short_name, 
        place.address_components.find(({ types }: any) => types.some((type: any) => type === 'route'))?.short_name
      ].filter((item)=>item).join(' ')

      setValue(`${name}.address`, address, {shouldValidate:true})
      setValue(`${name}.city`, place.address_components.find(({ types }: any) => types.some((type: any) => type === 'locality'))?.short_name, {shouldValidate:true})
      setValue(
        `${name}.${fieldNames.state || 'province'}`,
        place.address_components.find(({ types }: any) => types.some((type: any) => type === 'administrative_area_level_1'))?.short_name, {shouldValidate:true}
      )
      setValue(
        `${name}.${fieldNames.postal || 'postal_code'}`,
        place.address_components.find(({ types }: any) => types.some((type: any) => type === 'postal_code'))?.short_name, {shouldValidate:true}
      )
      setValue(
        `${name}.postal_origin`,
        place.address_components.find(({ types }: any) => types.some((type: any) => type === 'postal_code'))?.short_name, {shouldValidate:true}
      )
      setValue(`${name}.country`, place.address_components.find(({ types }: any) => types.some((type: any) => type === 'country'))?.short_name, {shouldValidate:true})
    }
  
    return (<GoogleAutoCompleteInput
        name={`${name}.address`}
        className='w-full input input-sm input-bordered'
        onPlaceSelected={handlePlaceSelected}
        options={{
            componentRestrictions: { country: 'us' },
            types: ['address']
        }}
        {...rest}
    />)
  }
  
  export default AddressInput