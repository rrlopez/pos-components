import { Meta } from '@storybook/react'
import React from 'react'
import CardDecorator from '../.storybook/decorators/Card'
import { Select2Input } from '../src/components/forms/Select2Input'

const meta: Meta = {
  title: 'Select2 Input',
  component: Select2Input,
  decorators: [
    Story => (
      <CardDecorator>
        <Story />
      </CardDecorator>
    ),
  ],
}

export default meta

const Template = args => <Select2Input {...args} />

export const Default = Template.bind({})
Default.args = {
  className: 'select select-sm select-bordered',
  defaultValue: '34h',
  placeholder: 'Select range',
  options: [
    { label: '24 Hours', value: '24h' },
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '60 Days', value: '60d' },
    { label: '90 Days', value: '90d' },
    { label: '365 Days', value: '1yr' },
  ],
  mui: false,
}
