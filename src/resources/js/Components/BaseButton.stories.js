import base, { filename } from "paths.macro"
import {
  defaultTemplate,
  storyTitle,
  marginDecorators,
} from "@js/utility/storybook"
import BaseButton from "./BaseButton"

export default {
  component: BaseButton,
  title: storyTitle(base + filename),
  decorators: [() => ({ template: marginDecorators() })],
}

const Template = (args) => ({
  components: { BaseButton },
  setup() {
    return { args }
  },
  template: defaultTemplate(args, "base-button"),
})

export const Default = Template.bind({})
Default.args = [
  {
    type: "green",
    label: "green",
  },
  {
    type: "yellow",
    label: "yellow",
  },
  {
    type: "red",
    label: "red",
  },
  {
    type: "gray",
    label: "gray",
  },
  {
    type: "purple",
    label: "purple",
  },
]

export const Rounded = Template.bind({})
Rounded.args = [
  {
    type: "green",
    label: "green",
    rounded: true,
  },
  {
    type: "yellow",
    label: "yellow",
    rounded: true,
  },
  {
    type: "red",
    label: "red",
    rounded: true,
  },
  {
    type: "gray",
    label: "gray",
    rounded: true,
  },
  {
    type: "purple",
    label: "purple",
    rounded: true,
  },
]

export const WithIcon = Template.bind({})
WithIcon.args = [
  {
    type: "green",
    label: "green",
    icon: "check",
  },
  {
    type: "yellow",
    label: "yellow",
    icon: "check",
  },
  {
    type: "red",
    label: "red",
    icon: "check",
  },
  {
    type: "gray",
    label: "gray",
    icon: "check",
  },
  {
    type: "purple",
    label: "purple",
    icon: "check",
  },
]

export const RoundedWithIcon = Template.bind({})
RoundedWithIcon.args = [
  {
    type: "green",
    label: "green",
    rounded: true,
    icon: "check",
  },
  {
    type: "yellow",
    label: "yellow",
    rounded: true,
    icon: "check",
  },
  {
    type: "red",
    label: "red",
    rounded: true,
    icon: "check",
  },
  {
    type: "gray",
    label: "gray",
    rounded: true,
    icon: "check",
  },
  {
    type: "purple",
    label: "purple",
    rounded: true,
    icon: "check",
  },
]

export const Disabled = Template.bind({})
Disabled.args = [
  {
    type: "green",
    label: "green",
    disabled: true,
  },
  {
    type: "yellow",
    label: "yellow",
    disabled: true,
  },
  {
    type: "red",
    label: "red",
    disabled: true,
  },
  {
    type: "gray",
    label: "gray",
    disabled: true,
  },
  {
    type: "purple",
    label: "purple",
    disabled: true,
  },
]
