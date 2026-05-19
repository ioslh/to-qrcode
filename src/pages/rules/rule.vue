<template>
  <RuleView v-if="runtimeRule" :rule="runtimeRule" />
  <div v-else class="empty-page">
    <!-- Not found -->
    <Error v-if="nameInUrl">
      <div class="not-found">
        <p>Rule <strong>"{{ nameInUrl }}"</strong> does not exist.</p>
        <p class="not-found-sub">
          Check the URL, or
          <button class="create-link" @click="onCreate">create the "{{ nameInUrl }}" rule</button>
          right now.
        </p>
      </div>
    </Error>

    <!-- Bad raw url -->
    <Error v-else-if="rawInUrl">
      <div class="bad-raw">
        <p>The raw content in the URL is invalid or failed to parse.</p>
        <pre class="raw-code">{{ rawInUrl }}</pre>
      </div>
    </Error>

    <!-- Default: select or create -->
    <div v-else class="select-prompt">
      <div class="prompt-icon">
        <QrCode :size="48" />
      </div>
      <p>Select a rule from the sidebar or <router-link to="/new">create one</router-link></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { QrCode } from 'lucide-vue-next'
import { ruleContext } from '@/shared/rules'
import { atou } from '@/shared/utils'
import type { Rule } from '@/typings'
import RuleView from '@/components/rule.vue'
import Error from '@/components/error.vue'

const { rules, add } = inject(ruleContext)!
const route = useRoute()
const router = useRouter()

const nameInUrl = computed(() => route.params.name as string)
const rawInUrl = computed(() => route.query.raw as string)

const runtimeRule = computed<Rule | undefined>(() => {
  if (nameInUrl.value) {
    const r = rules.value.find(r => r.name === nameInUrl.value)
    if (r) return r
  }
  if (rawInUrl.value) {
    try {
      const rawCode = rawInUrl.value.replace(/ /g, '+')
      const r = JSON.parse(atou(rawCode))
      if (typeof r === 'object') {
        return {
          name: r.name || 'Untitled rule',
          desc: r.desc ? String(r.desc) : '',
          func: r.func,
          raw: true,
        } as Rule
      }
    } catch {}
  }
  return undefined
})

const onCreate = () => {
  add({ name: nameInUrl.value })
  router.push(`/rules/${nameInUrl.value}/edit`)
}
</script>

<style scoped>
.empty-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.not-found {
  text-align: center;
  line-height: 1.7;
}

.not-found-sub {
  margin-top: 8px;
  color: hsl(var(--muted-foreground));
  font-size: 13px;
}

.create-link {
  background: none;
  border: none;
  color: hsl(var(--primary));
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  text-decoration: underline;
}

.bad-raw {
  text-align: center;
}

.raw-code {
  margin-top: 12px;
  padding: 12px;
  background: hsl(var(--muted));
  border: 1px solid hsl(var(--border));
  border-radius: 6px;
  font-size: 11px;
  word-break: break-all;
  white-space: pre-wrap;
  max-width: 500px;
  text-align: left;
}

.select-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: hsl(var(--muted-foreground));
  text-align: center;
}

.prompt-icon {
  opacity: 0.2;
}

.select-prompt p {
  font-size: 15px;
}
</style>
