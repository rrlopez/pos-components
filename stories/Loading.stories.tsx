import { Meta } from "@storybook/react"
import React from "react"
import Loading from "../src/components/loading"

const meta: Meta = {
  title: "Loading State",
  component: Loading,
}

export default meta

const Template = args => <Loading {...args} />

export const Default = Template.bind({})
Default.args = {}
