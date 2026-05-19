<template>
  <div class="new-page">
    <div class="panel">
      <div class="panel-header">
        <div class="panel-icon">
          <Plus :size="20" />
        </div>
        <div>
          <h2 class="panel-title">Create new rule</h2>
          <p class="panel-desc">Give your rule a unique name</p>
        </div>
      </div>

      <div class="form-row">
        <Input
          ref="inputRef"
          v-model="name"
          placeholder="e.g. my-wifi, meeting-url…"
          @keyup="onTyping"
          @keyup.enter="submit"
          :class="error ? 'border-destructive focus-visible:ring-destructive' : ''"
        />
        <Button @click="submit" :disabled="!name.trim()">
          <ArrowRight :size="16" />
          Create
        </Button>
      </div>

      <p v-if="error" class="error-msg">
        <AlertCircle :size="13" />
        {{ error }}
      </p>
      <p v-else class="hint-msg">
        Only letters, numbers, hyphens and underscores are allowed (e.g. <code>my-rule</code>).
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { inject } from 'vue'
import { Plus, ArrowRight, AlertCircle } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { ruleContext, validateName } from '@/shared/rules'
import trackEvent from '@/shared/track'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const inputRef = ref()
const router = useRouter()
const name = ref('')
const error = ref('')
const { rules, add } = inject(ruleContext)!

const submit = async () => {
  try {
    await validateName(name.value, rules.value)
    add({ name: name.value })
    trackEvent('create-rule', { name: name.value })
    toast.success(`Rule "${name.value}" created!`)
    router.push(`/rules/${name.value}/edit`)
  } catch (e: any) {
    error.value = e.message
  }
}

const onTyping = () => {
  error.value = ''
}

onMounted(() => {
  if (inputRef.value?.$el) {
    inputRef.value.$el.focus()
  }
})
</script>

<style scoped>
.new-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.panel {
  width: 100%;
  max-width: 480px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 32px hsl(0 0% 0% / 0.05);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.panel-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.panel-title {
  font-size: 18px;
  font-weight: 700;
  color: hsl(var(--foreground));
  margin: 0;
}

.panel-desc {
  font-size: 13px;
  color: hsl(var(--muted-foreground));
  margin: 2px 0 0;
}

.form-row {
  display: flex;
  gap: 10px;
}

.form-row :deep(input) {
  flex: 1;
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: hsl(var(--destructive));
  margin: 0;
}

.hint-msg {
  font-size: 12px;
  color: hsl(var(--muted-foreground));
  margin: 0;
  line-height: 1.5;
}
</style>
