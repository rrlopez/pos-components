import moment from 'moment'
import { useState } from 'react'
import useLocalStorage from '../../utils/hooks/useLocalStorage'
import { CheckInput } from '../forms/CheckInput'

export default ({ isCheck, activeKey, label = 'Disable this prompt for ' }: any) => {
  const [duration, setDuration]: any = useState('1-day')

  const getExpiration = ({ target }: any) => {
    const [value, unit] = (target.duration || duration).split('-')
    return { value: target.checked ? moment().add(value, unit).format('YYYY-MM-DD HH:mm:ss') : '' }
  }
  const [expiration, setExpiration] = useLocalStorage(activeKey, getExpiration({ target: { checked: isCheck, duration } }))

  const handleCheck = ({ target }: any) => {
    setExpiration(getExpiration({ target }))
  }

  const handleRemove = () => {
    localStorage.removeItem(activeKey)
  }

  const handleChangeDuration = ({ target }: any) => {
    setDuration(target.value)
    if (expiration.value) handleCheck({ target: { checked: true, duration: target.value } })
  }

  return {
    onRemove: handleRemove,
    Select: () => {
      if (!activeKey) return null
      return (
        <CheckInput
          className='checkbox checkbox-sm'
          checked={expiration.value}
          onChange={handleCheck}
          label={
            <>
              {label}
              <select className='py-1 ml-1 rounded-lg dark:bg-base-300' value={duration} onChange={handleChangeDuration}>
                <option value='15-minute'>15 mins</option>
                <option value='1-hour'>1 hour</option>
                <option value='1-day'>1 day</option>
                <option value='7-day'>7 days</option>
                <option value='30-day'>30 days</option>
              </select>
            </>
          }
        />
      )
    },
  }
}
