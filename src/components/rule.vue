<template>
  <div class="rule-shell">
    <!-- Header -->
    <div class="rule-header">
      <!-- Shared rule banner -->
      <div v-if="rule.raw && showShareTip" class="share-banner">
        <div class="banner-content">
          <Info :size="14" />
          <span>This rule is temporary (shared via URL). <button class="banner-action" @click="onSaveAs">Save it locally</button> for later use.</span>
        </div>
        <button class="banner-close" @click="onHideShareTip" title="Don't show again">
          <X :size="14" />
        </button>
      </div>

      <!-- Rule info row -->
      <div class="header-row">
        <div class="rule-info">
          <Badge v-if="rule.raw" variant="secondary" class="rule-badge">
            <Share2 :size="10" class="mr-1" />Shared
          </Badge>
          <Badge v-else-if="rule.builtin" variant="success" class="rule-badge">
            <Zap :size="10" class="mr-1" />Builtin
          </Badge>
          <h1 class="rule-name">{{ rule.name }}</h1>
          <span v-if="descRender" class="rule-desc" v-html="descRender"></span>
        </div>
        <div class="header-actions">
          <Button v-if="rule.raw" size="sm" variant="outline" @click="onSaveAs">
            <Download :size="14" />
            Save locally
          </Button>
          <Button v-else size="sm" variant="outline" @click="onShare">
            <Share2 :size="14" />
            Share
          </Button>
        </div>
      </div>

      <!-- Tab menu -->
      <div class="tab-bar">
        <button
          v-for="m in menus"
          :key="m.key"
          :class="['tab-btn', { active: m.key === runtimeMenu }]"
          @click="runtimeMenu = m.key"
        >
          <component :is="m.icon" :size="14" />
          {{ m.name }}
        </button>
      </div>
    </div>

    <!-- Content panel -->
    <div class="rule-body">
      <Settings v-if="runtimeMenu === 'settings'" :rule="rule" />
      <Editor v-else-if="runtimeMenu === 'edit'" :rule="rule" />
      <Generate v-else :rule="rule" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, inject, watch, onMounted, PropType } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { Share2, Download, Info, X, Zap, QrCode, Code2, Settings2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import Generate from '@/components/generate.vue'
import Settings from '@/components/settings.vue'
import Editor from '@/components/editor.vue'
import { ruleContext, validateName } from '@/shared/rules'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Rule } from '@/typings'
import { utoa, idGenerator } from '@/shared/utils'
import Storage from '@/shared/storage'
import trackEvent from '@/shared/track'

const props = defineProps<{ rule: Rule }>()

const markdownParser = new MarkdownIt({ linkify: true })
const ShareStorageKey = '__show_share_tip__'

const showShareTip = ref(Storage.get(ShareStorageKey, true))
const { remove, rules, add } = inject(ruleContext)!
const route = useRoute()
const router = useRouter()

const menus = computed(() => {
  const ms = [
    { name: 'Generate', key: 'gen', icon: QrCode },
    { name: 'Rule', key: 'edit', icon: Code2 },
  ]
  if (props.rule.raw || props.rule.builtin) return ms
  return [...ms, { name: 'Settings', key: 'settings', icon: Settings2 }]
})

const descRender = computed(() =>
  props.rule.desc ? markdownParser.renderInline(props.rule.desc) : ''
)

const menu = ref('gen')
const runtimeMenu = computed({
  get: () => {
    const returnMenu = props.rule.raw ? menu.value : (route.params.menu as string || 'gen')
    if (menus.value.map(v => v.key).includes(returnMenu)) return returnMenu
    return menus.value[0].key
  },
  set: (v) => {
    let nextMenu = v
    if (!menus.value.map(v => v.key).includes(v)) nextMenu = menus.value[0].key
    if (props.rule.raw) {
      menu.value = nextMenu
    } else {
      router.push(`/rules/${props.rule.name}/${nextMenu}`)
    }
  }
})

const onShare = () => {
  const raw = utoa(JSON.stringify(props.rule))
  const link = `${location.origin}/rules?raw=${raw}`
  window.open(link, '_blank')
  toast.success('Share link opened in a new tab')
}

const onSaveAs = () => {
  let newName = `${props.rule.name}-from-shared`
  try {
    validateName(newName, rules.value)
  } catch {
    newName += `-${idGenerator()}`
  }
  const rule = { ...props.rule, name: newName, raw: false }
  trackEvent('fork-rule', { name: props.rule.name })
  add(rule)
  toast.success(`Rule saved as "${newName}"`)
  router.push(`/rules/${newName}/gen`)
}

const onHideShareTip = () => {
  showShareTip.value = false
}

watch(showShareTip, v => {
  Storage.set(ShareStorageKey, v)
})

onMounted(() => {
  trackEvent('use-rule', { name: props.rule.name })
})
</script>

<style scoped>
.rule-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* ── Header ─────────────────────────────────────── */
.rule-header {
  background: hsl(var(--background));
  border-bottom: 1px solid hsl(var(--border));
  flex-shrink: 0;
}

/* Share banner */
.share-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;
  background: hsl(38 92% 50% / 0.1);
  border-bottom: 1px solid hsl(38 92% 50% / 0.25);
  font-size: 12px;
  color: hsl(38 92% 35%);
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.banner-action {
  background: none;
  border: none;
  color: hsl(var(--primary));
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  font-weight: 600;
  text-decoration: underline;
}

.banner-close {
  background: none;
  border: none;
  cursor: pointer;
  color: hsl(38 92% 35%);
  padding: 2px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.banner-close:hover {
  background: hsl(38 92% 50% / 0.2);
}

/* Header row */
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px 10px;
}

.rule-info {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  flex: 1;
}

.rule-badge {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}

.rule-name {
  font-size: 20px;
  font-weight: 700;
  color: hsl(var(--foreground));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.rule-desc {
  font-size: 12px;
  color: hsl(var(--muted-foreground));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

.rule-desc :deep(a) {
  color: hsl(var(--muted-foreground));
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 12px;
}

/* Tab bar */
.tab-bar {
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 4px;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  font-size: 13px;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.tab-btn:hover {
  color: hsl(var(--foreground));
}

.tab-btn.active {
  color: hsl(var(--primary));
  border-bottom-color: hsl(var(--primary));
}

/* ── Body ───────────────────────────────────────── */
.rule-body {
  flex: 1;
  min-height: 0;
  position: relative;
}
</style>
