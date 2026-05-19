<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ScrollAreaScrollbar, ScrollAreaThumb, type ScrollAreaScrollbarProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ScrollAreaScrollbarProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <ScrollAreaScrollbar
    v-bind="props"
    :class="cn(
      'flex touch-none select-none transition-colors',
      props.orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-px',
      props.orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-px',
      props.class,
    )"
  >
    <ScrollAreaThumb class="relative flex-1 rounded-full bg-border" />
  </ScrollAreaScrollbar>
</template>
