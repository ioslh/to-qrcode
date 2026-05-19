<script setup lang="ts">
import { TooltipRoot, type TooltipRootProps } from 'radix-vue'

const props = defineProps<TooltipRootProps>()
</script>

<template>
  <TooltipRoot v-bind="props">
    <slot />
  </TooltipRoot>
</template>
