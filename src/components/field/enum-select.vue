<template>
  <span v-if="!options.length" class="incomplete-tip">Enum config is incomplete</span>

  <!-- Dropdown mode (>3 options) -->
  <Select v-else-if="dropdownMode" :model-value="String(modelValue ?? '')" @update:model-value="onChange">
    <SelectTrigger class="w-[200px]">
      <SelectValue placeholder="Select an option" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="opt in options" :key="String(opt.value)" :value="String(opt.value)">
        {{ opt.label }}
      </SelectItem>
    </SelectContent>
  </Select>

  <!-- Button group mode (<=3 options) -->
  <div v-else class="enum-group">
    <button
      v-for="opt in options"
      :key="String(opt.value)"
      :class="['enum-btn', { active: modelValue === opt.value }]"
      type="button"
      @click="onChange(String(opt.value))"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Param, Primitive } from '@/typings'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const props = defineProps<{
  modelValue?: Primitive
  param: Param
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: Primitive): void }>()

const options = computed(() => props.param.options || [])
const dropdownMode = computed(() => options.value.length > 3)

const onChange = (nextValue: string) => {
  // find matching typed value from options
  const match = options.value.find(o => String(o.value) === nextValue)
  emit('update:modelValue', match ? match.value : nextValue)
}
</script>

<style scoped>
.incomplete-tip {
  font-size: 12px;
  color: hsl(var(--muted-foreground));
}

.enum-group {
  display: inline-flex;
  border: 1px solid hsl(var(--border));
  border-radius: 6px;
  overflow: hidden;
}

.enum-btn {
  padding: 6px 14px;
  font-size: 13px;
  background: hsl(var(--background));
  color: hsl(var(--muted-foreground));
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.enum-btn:not(:last-child) {
  border-right: 1px solid hsl(var(--border));
}

.enum-btn.active {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.enum-btn:hover:not(.active) {
  background: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}
</style>
