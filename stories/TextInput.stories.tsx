import { Meta } from '@storybook/react'
import React from 'react'
import CardDecorator from '../.storybook/decorators/Card'
import { TextInput } from '../src/components/forms/TextInput'

const meta: Meta = {
  title: 'Text Input',
  component: TextInput,
  decorators: [
    Story => (
      <CardDecorator>
        <div className='form-control'>
          <label htmlFor='searchInput' className='input-group'>
            <Story />
            <span>Search</span>
          </label>
        </div>
      </CardDecorator>
    ),
  ],
}

export default meta

const Template = args => <TextInput {...args} />

export const Default = Template.bind({})
Default.args = {
  id: 'searchInput',
  type: 'text',
  placeholder: 'Pitney Bowes Meter Number or Login In email address',
  className: 'w-full input input-bordered input-md',
  mui: false,
}
