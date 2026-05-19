<template>
  <div class="settings-page">
    <!-- General section -->
    <section class="settings-section">
      <div class="section-header">
        <Settings2 :size="16" />
        <h3>General</h3>
      </div>
      <div class="section-body">
        <div class="field-group">
          <Label for="rule-name">Rule name</Label>
          <p class="field-hint">Rename this rule (letters, numbers, hyphens, underscores only)</p>
          <Input
            id="rule-name"
            v-model="name"
            @blur="changeName"
            @keyup.enter="tryChangeName"
            class="field-input"
          />
        </div>
        <Separator />
        <div class="field-group">
          <Label for="rule-desc">Description</Label>
          <p class="field-hint">Supports Markdown. Shown as a subtitle next to the rule name.</p>
          <Textarea
            id="rule-desc"
            v-model="desc"
            @blur="changeDesc"
            placeholder="e.g. Generates a vCard QR code from contact info…"
            rows="4"
            class="field-textarea"
          />
        </div>
      </div>
    </section>

    <!-- Danger zone -->
    <section class="settings-section danger-section">
      <div class="section-header danger-header">
        <AlertTriangle :size="16" />
        <h3>Danger zone</h3>
      </div>
      <div class="section-body">
        <div class="danger-row">
          <div>
            <p class="danger-title">Remove this rule</p>
            <p class="danger-desc">This action is permanent and cannot be undone.</p>
          </div>
          <Dialog v-model:open="confirmOpen">
            <DialogTrigger as-child>
              <Button variant="destructive" size="sm">
                <Trash2 :size="14" />
                Remove
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove rule</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove <strong>"{{ rule.name }}"</strong>? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" @click="confirmOpen = false">Cancel</Button>
                <Button variant="destructive" @click="onRemove">
                  <Trash2 :size="14" />
                  Yes, remove
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { Settings2, AlertTriangle, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { Rule } from '@/typings'
import { ruleContext, validateName } from '@/shared/rules'
import trackEvent from '@/shared/track'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'

const props = defineProps<{ rule: Rule }>()

const router = useRouter()
const { update, remove, rules, rename } = inject(ruleContext)!
const confirmOpen = ref(false)

const name = ref(props.rule.name)
const desc = ref(props.rule.desc || '')

const onRemove = () => {
  trackEvent('remove-rule', { name: props.rule.name })
  remove(props.rule)
  confirmOpen.value = false
  toast.success(`Rule "${props.rule.name}" removed`)
  router.push(`/rules/${rules.value[0].name}/gen`)
}

const changeName = () => {
  const n = name.value.trim()
  if (n === props.rule.name) return
  try {
    validateName(n, rules.value)
    rename(props.rule.name, n)
    toast.success(`Rule renamed to "${n}"`)
    router.push(`/rules/${n}/settings`)
  } catch (e: any) {
    toast.warning(e.message || 'Rule name is invalid')
    name.value = props.rule.name
  }
}

const tryChangeName = (e: any) => {
  e.target.blur()
}

const changeDesc = () => {
  const d = desc.value.trim()
  if (d === props.rule.desc) return
  update({ ...props.rule, desc: d })
  toast.success('Description updated')
}
</script>

<style scoped>
.settings-page {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow-y: auto;
}

.settings-section {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  border-bottom: 1px solid hsl(var(--border));
  background: hsl(var(--muted) / 0.4);
}

.section-header h3 {
  font-size: 13px;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0;
}

.section-header svg {
  color: hsl(var(--muted-foreground));
}

.section-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-hint {
  font-size: 12px;
  color: hsl(var(--muted-foreground));
  margin: 0;
  line-height: 1.4;
}

.field-input {
  max-width: 320px;
}

.field-textarea {
  max-width: 600px;
  resize: vertical;
}

/* Danger */
.danger-section {
  border-color: hsl(var(--destructive) / 0.25);
}

.danger-header {
  background: hsl(var(--destructive) / 0.05);
  color: hsl(var(--destructive));
}

.danger-header h3,
.danger-header svg {
  color: hsl(var(--destructive));
}

.danger-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.danger-title {
  font-size: 13px;
  font-weight: 500;
  color: hsl(var(--foreground));
  margin: 0;
}

.danger-desc {
  font-size: 12px;
  color: hsl(var(--muted-foreground));
  margin: 4px 0 0;
}
</style>
