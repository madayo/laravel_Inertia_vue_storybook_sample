<script setup>
import { computed } from "vue"
import PVButton from "primevue/button"

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: false,
    default: "",
  },
  icon: {
    type: String,
    required: false,
    default: "",
  },
  rounded: {
    type: Boolean,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  size: {
    type: String,
    required: false,
    default: "base",
  },
})
const colorClass = computed(() => ({
  "p-button-secondary": props.type === 'gray',
  "p-button-success": props.type === 'green',
  "p-button-help": props.type === 'purple',
  "p-button-warning": props.type === 'yellow',
  "p-button-danger": props.type === 'red',
}))
const sizeClass = computed(() => ({
  "sm-button": props.size === "sm",
  "base-button": props.size === "base",
}))
const roundedClass = computed(() => ({
  "p-button-rounded": props.rounded,
}))
</script>

<template>
  <p-v-button
    :label="label"
    :icon="icon.length > 0 ? 'pi pi-' + icon : ''"
    :class="['button', colorClass, sizeClass, roundedClass]"
    :disabled="disabled"
  ></p-v-button>
</template>

<style lang="scss" scoped>
.button {
  font-size: 0.8rem;

  &:disabled {
    opacity: 0.4;
  }

  &:enabled:hover,
  &:enabled:active,
  &:enabled:focus {
    box-shadow: none;
    opacity: 0.7;
  }
}
</style>
