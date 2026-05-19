<template>
  <div class="qrcode-output">
    <!-- QR canvas area -->
    <div class="qr-wrapper">
      <!-- Loading spinner -->
      <div v-if="showLoading" class="qr-placeholder">
        <div class="qr-spinner"></div>
      </div>
      <!-- QR image -->
      <div v-else-if="qrcodeImage" class="qr-image-wrap" :class="{ dirty }" @click="onShowBigger">
        <img :src="qrcodeImage" alt="QR Code" />
        <div class="qr-overlay">
          <Maximize2 :size="20" />
        </div>
      </div>
      <!-- Empty state -->
      <div v-else class="qr-empty">
        <QrCode :size="40" class="qr-empty-icon" />
        <span>Awaiting input</span>
      </div>
    </div>

    <!-- Actions -->
    <div v-if="qrcodeImage && !showLoading" class="qr-actions">
      <button class="action-btn" @click="onDownload" title="Download QR code">
        <Download :size="14" />
        Download
      </button>
      <button class="action-btn" @click="onCopyText" title="Copy encoded text">
        <Copy :size="14" />
        Copy text
      </button>
    </div>

    <!-- Encoded text -->
    <div v-if="input && !showLoading" class="qr-text">{{ input }}</div>

    <!-- Full-size dialog -->
    <Dialog v-model:open="showBigger">
      <DialogContent class="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>
        <div class="dialog-qr" v-if="showBigger">
          <img :src="qrcodeImage" alt="QR Code" />
          <p class="dialog-text">{{ input }}</p>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { QrCode, Maximize2, Download, Copy } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import QRCode from 'qrcode'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const props = defineProps<{
  generating?: boolean
  input?: string
  dirty?: boolean
}>()

const qrcodeImage = ref('')
const parsing = ref(false)
const showBigger = ref(false)
const showLoading = computed(() => parsing.value || props.generating)

const parseToImage = async (text: string) => {
  parsing.value = true
  try {
    qrcodeImage.value = await QRCode.toDataURL(text, {
      width: 400,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    })
  } catch {
    qrcodeImage.value = ''
  }
  parsing.value = false
}

const onShowBigger = () => {
  if (qrcodeImage.value) showBigger.value = true
}

const onDownload = () => {
  if (!qrcodeImage.value) return
  const a = document.createElement('a')
  a.href = qrcodeImage.value
  a.download = 'qrcode.png'
  a.click()
  toast.success('QR code downloaded!')
}

const onCopyText = async () => {
  if (!props.input) return
  try {
    await navigator.clipboard.writeText(props.input)
    toast.success('Text copied to clipboard!')
  } catch {
    toast.error('Failed to copy text')
  }
}

watch(() => props.input, raw => {
  if (raw) {
    parseToImage(raw)
  } else {
    qrcodeImage.value = ''
  }
})
</script>

<style scoped>
.qrcode-output {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* QR wrapper (square) */
.qr-wrapper {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  border: 1px dashed hsl(var(--border));
  background: hsl(var(--background));
  overflow: hidden;
  position: relative;
}

.qr-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-spinner {
  width: 28px;
  height: 28px;
  border: 2px solid hsl(var(--border));
  border-top-color: hsl(var(--primary));
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.qr-image-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: opacity 0.2s;
}

.qr-image-wrap.dirty {
  opacity: 0.35;
}

.qr-image-wrap img {
  max-width: 90%;
  max-height: 90%;
}

.qr-overlay {
  position: absolute;
  inset: 0;
  background: hsl(0 0% 0% / 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 12px;
}

.qr-image-wrap:hover .qr-overlay {
  opacity: 1;
}

.qr-empty {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: hsl(var(--muted-foreground));
}

.qr-empty-icon {
  opacity: 0.25;
}

.qr-empty span {
  font-size: 12px;
}

/* Actions */
.qr-actions {
  display: flex;
  gap: 8px;
  width: 100%;
}

.action-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 6px 10px;
  border: 1px solid hsl(var(--border));
  border-radius: 6px;
  background: hsl(var(--background));
  color: hsl(var(--muted-foreground));
  font-size: 11px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.action-btn:hover {
  background: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

/* Encoded text */
.qr-text {
  width: 100%;
  font-size: 11px;
  color: hsl(var(--muted-foreground));
  word-break: break-all;
  white-space: pre-wrap;
  background: hsl(var(--muted));
  padding: 8px 10px;
  border-radius: 6px;
  line-height: 1.5;
  font-family: 'JetBrains Mono', monospace;
  max-height: 100px;
  overflow-y: auto;
}

/* Dialog */
.dialog-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
}

.dialog-qr img {
  max-width: 100%;
}

.dialog-text {
  font-size: 12px;
  color: hsl(var(--muted-foreground));
  word-break: break-all;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  background: hsl(var(--muted));
  padding: 8px;
  border-radius: 6px;
  width: 100%;
}
</style>
