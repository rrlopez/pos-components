import { Meta } from "@storybook/react"
import React from "react"
import Empty from "../src/components/empty"

const meta: Meta = {
  title: "Empty State",
  component: Empty,
}

export default meta

const Template = args => <Empty {...args} />

export const Default = Template.bind({})
Default.args = {}
