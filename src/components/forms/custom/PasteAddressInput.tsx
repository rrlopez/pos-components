import parser from 'parse-address';
import human from 'parse-full-name';
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { BiPaste } from 'react-icons/bi';
import coreAPI from '../../../api/coreAPI';
import { timeout } from '../../../utils';
import TextAreaInput from "../TextAreaInput";

function PasteAddressInput({name = 'addressBook', fieldNames={}, show }: any) {
  const [isShow, setIsShow] = useState(show)
  const { setValue, trigger } = useFormContext()
  const handleShow = ()=>{
    setIsShow(!isShow)
  }

  const handleParseAddress = async (value:any)=>{
    let address = value.split(/\r?\n/).map((a:any) => a.trim()).filter((a:any) => a.length > 0);

    if (address.length === 1) {
      address = value.split(/,/).map((a:any) => a.trim()).filter((a:any) => a.length > 0);
      value = address.join('\r\n');
    }

    if (address.length > 2) {
      // check if country is on the last element then remove
      if (['us', 'usa', 'america', 'united states', 'united states of america'].includes(address[address.length - 1].trim().toLowerCase())) {
        address.pop();
      }

      // parse name (Expecting that the first row is name)
      let first = address.shift();
      let parsedName = human.parseFullName(first);

      // if address doesn't have number, move it to company
      let second = address[0];
      let company = '';

      const re = /\d/;
      if (!re.test(second)) {
        company = second;
        address.shift();
      }

      // address parser
      const parsedAddress = parser.parseLocation(address.join(' '));
      const postal_code = parsedAddress.plus4 ? `${parsedAddress.zip}-${parsedAddress.plus4}` : parsedAddress.zip

      if (postal_code) {
        const {data:city_state}:any = await coreAPI.getCityState(postal_code);

        setValue(`${name}.company`, company, {shouldValidate:true})
        setValue(`${name}.first_name`, parsedName.first, {shouldValidate:true})
        setValue(`${name}.last_name`, parsedName.last, {shouldValidate:true})
        setValue(`${name}.city`, city_state.city, {shouldValidate:true})
        setValue(`${name}.${fieldNames.state || 'province'}`, city_state.state_short, {shouldValidate:true})
        setValue(`${name}.${fieldNames.postal || 'postal_code'}`, postal_code, {shouldValidate:true})
        setValue(`${name}.address`, address[0], {shouldValidate:true})
        setValue(`${name}.address2`, address.length > 2 ? address[1] : '', {shouldValidate:true})
        setValue(`${name}.country`, 'US', {shouldValidate:true})
        timeout(trigger, 150)
      }
    }
  }

  const handleChange = async ({target}:any)=>{
    handleParseAddress(target.value)
  }

  return (isShow?
    <TextAreaInput
        name={`${name}.longAddress`}
        className='w-full textarea textarea-bordered textarea-sm'
        rows={5}
        placeholder={'Name\nCompany (Optional)\nAddress Line 1\nAddress Line 2 (Optional)\nCity State Postal Code'}
        onChange={handleChange}
    />
    :<div className="flex items-center gap-1 text-sm italic no-underline link link-primary dark:text-gray-400 dark:hover:text-brandPrimary-300" onClick={handleShow}><BiPaste className='w-5 h-5'/> Click here to paste address</div>
  )
}

export default PasteAddressInput