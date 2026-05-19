<template>
  <div class="qr-logo" :style="{ width: size + 'px', height: size + 'px' }">
    <i></i><i></i><i></i><i></i>
  </div>
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>

<style scoped>
.qr-logo {
  display: inline-block;
  position: relative;
  flex-shrink: 0;
}

.qr-logo i {
  position: absolute;
  border-radius: 3px;
  border: 3px solid transparent;
}

.qr-logo i:nth-child(1) {
  left: 0; top: 0;
  width: 48%; height: 48%;
  border-color: hsl(221.2 83.2% 53.3%);
}

.qr-logo i:nth-child(2) {
  right: 0; top: 0;
  width: 48%; height: 48%;
  border-color: hsl(0 84.2% 60.2%);
}

.qr-logo i:nth-child(3) {
  left: 0; bottom: 0;
  width: 48%; height: 48%;
  border-color: hsl(38 92% 50%);
}

.qr-logo i:nth-child(4) {
  right: 0; bottom: 0;
  width: 48%; height: 48%;
  border-color: hsl(var(--muted-foreground) / 0.4);
  background: hsl(var(--muted-foreground) / 0.15);
}
</style>
