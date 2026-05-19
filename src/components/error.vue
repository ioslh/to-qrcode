<template>
  <div class="error-state">
    <div class="error-icon-wrap">
      <FileX :size="36" />
    </div>
    <div class="error-content">
      <slot>
        <p>{{ desc }}</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileX } from 'lucide-vue-next'
defineProps<{ desc?: string }>()
</script>

<style scoped>
.error-state {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 32px;
}

.error-icon-wrap {
  color: hsl(var(--muted-foreground) / 0.5);
}

.error-content {
  color: hsl(var(--muted-foreground));
  font-size: 14px;
  text-align: center;
  line-height: 1.6;
}
</style>
