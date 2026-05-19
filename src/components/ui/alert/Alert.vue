<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { alertVariants, type AlertVariants } from '.'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'], variant?: AlertVariants['variant'] }>()
</script>

<template>
  <div role="alert" :class="cn(alertVariants({ variant }), props.class)">
    <slot />
  </div>
</template>
