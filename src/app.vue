<template>
  <TooltipProvider :delay-duration="300">
    <div v-if="isMobile" class="mobile-notice">
      <div class="flex flex-col items-center justify-center w-full h-full gap-4 p-8">
        <img src="/logo.svg" alt="to-qrcode" class="w-16 h-16" />
        <h1 class="text-2xl font-bold text-primary">to-qrcode</h1>
        <p class="text-muted-foreground text-center text-base">More than a QR code generator</p>
        <div class="mt-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm text-center max-w-xs">
          For the best experience, visit on a device with a wider screen (600px+).
        </div>
        <a href="https://to-qrcode.com" class="text-sm text-muted-foreground mt-4 no-underline hover:underline">
          https://to-qrcode.com
        </a>
      </div>
    </div>
    <router-view v-else></router-view>
    <Toaster position="top-right" rich-colors />
  </TooltipProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Toaster } from 'vue-sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

const isMobile = computed(() => window.innerWidth < 600)
</script>

<style scoped>
.mobile-notice {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsl(var(--background));
}
</style>
