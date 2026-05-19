<template>
  <div class="bool-group">
    <button
      v-for="opt in options"
      :key="String(opt.value)"
      :class="['bool-btn', { active: modelValue === opt.value }]"
      @click="onChange(opt.value)"
      type="button"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
const options = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
]

const props = defineProps<{ modelValue?: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const onChange = (bool: boolean) => {
  emit('update:modelValue', bool)
}
</script>

<style scoped>
.bool-group {
  display: flex;
  border: 1px solid hsl(var(--border));
  border-radius: 6px;
  overflow: hidden;
  display: inline-flex;
}

.bool-btn {
  padding: 6px 16px;
  font-size: 13px;
  background: hsl(var(--background));
  color: hsl(var(--muted-foreground));
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.bool-btn:not(:last-child) {
  border-right: 1px solid hsl(var(--border));
}

.bool-btn.active {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.bool-btn:hover:not(.active) {
  background: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}
</style>
