<template>
  <div class="app-shell">
    <!-- Sidebar -->
    <aside class="sidebar">
      <!-- Logo / Brand -->
      <div class="sidebar-header">
        <router-link to="/" class="brand-link">
          <Logo class="brand-logo" />
          <span class="brand-name">to-qrcode</span>
        </router-link>
      </div>

      <!-- Search + New -->
      <div class="sidebar-search">
        <div class="search-wrapper">
          <Search class="search-icon" :size="14" />
          <input
            v-model="keyword"
            type="text"
            placeholder="Filter rules…"
            class="search-input"
          />
        </div>
        <router-link to="/new" class="new-btn" title="Create new rule">
          <Plus :size="16" />
        </router-link>
      </div>

      <!-- Rules list -->
      <ScrollArea class="sidebar-list-area">
        <ul class="rule-list">
          <li v-for="r in displayRules" :key="r.name">
            <button
              :class="['rule-item', { active: activeRule === r.name }]"
              @click="activeRule = r.name"
            >
              <Zap v-if="r.builtin" :size="13" class="rule-icon builtin-icon" />
              <User v-else :size="13" class="rule-icon" />
              <span class="rule-name">{{ r.name }}</span>
            </button>
          </li>
        </ul>
      </ScrollArea>

      <!-- Footer -->
      <div class="sidebar-footer">
        <a
          href="https://github.com/ioslh/to-qrcode"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
        >
          <Github :size="14" />
          <span>Open source</span>
        </a>
      </div>
    </aside>

    <!-- Main content -->
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Plus, Zap, User, Github } from 'lucide-vue-next'
import builtinRules from '@/shared/builtin'
import { getRules, saveRules, ruleContext } from '@/shared/rules'
import { Rule } from '@/typings'
import Logo from '@/components/logo.vue'
import { ScrollArea } from '@/components/ui/scroll-area'

const route = useRoute()
const router = useRouter()

const activeRule = computed({
  get: () => route.params.name as string,
  set: (name) => {
    router.push(`/rules/${name}/gen`)
  }
})

const keyword = ref('')
const rules = ref<Rule[]>(getRules().filter(r => !r.builtin).concat(builtinRules))

const displayRules = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return rules.value
  return rules.value.filter(rule => rule.name.toLowerCase().includes(k))
})

watch(rules, rs => {
  saveRules(rs.filter(r => !r.builtin))
}, { deep: true })

const removeRule = (rule: Rule) => {
  if (rule.builtin) return
  const index = rules.value.findIndex(r => r.name === rule.name)
  if (index !== -1) rules.value.splice(index, 1)
}

const addRule = (rule: Rule) => {
  if (rule.builtin) return
  const index = rules.value.findIndex(r => r.name === rule.name)
  if (index === -1) {
    rules.value.unshift(rule)
  } else {
    rules.value[index] = rule
  }
}

const updateRule = (rule: Rule) => {
  if (rule.builtin) return
  const index = rules.value.findIndex(r => r.name === rule.name)
  if (index !== -1) rules.value[index] = rule
}

const renameRule = (oldName: string, newName: string) => {
  const index = rules.value.findIndex(r => r.name === oldName)
  if (index !== -1 && !rules.value[index].builtin) {
    rules.value[index] = { ...rules.value[index], name: newName }
  }
}

provide(ruleContext, { rules, add: addRule, update: updateRule, remove: removeRule, rename: renameRule })
</script>

<style scoped>
.app-shell {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: hsl(var(--background));
}

/* ── Sidebar ─────────────────────────────────────── */
.sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  border-right: 1px solid hsl(var(--border));
  background: hsl(var(--background));
}

.sidebar-header {
  padding: 0 16px;
  height: 56px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid hsl(var(--border));
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
}

.brand-logo {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.brand-name {
  font-size: 15px;
  font-weight: 700;
  color: hsl(var(--primary));
  letter-spacing: -0.3px;
}

/* ── Search row ─────────────────────────────────── */
.sidebar-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid hsl(var(--border));
}

.search-wrapper {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: hsl(var(--muted-foreground));
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 32px;
  padding: 0 8px 0 26px;
  border-radius: 6px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--muted));
  font-size: 12px;
  color: hsl(var(--foreground));
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}

.search-input::placeholder {
  color: hsl(var(--muted-foreground));
}

.search-input:focus {
  background: hsl(var(--background));
  border-color: hsl(var(--ring));
  box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
}

.new-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  text-decoration: none;
  flex-shrink: 0;
  transition: opacity 0.2s;
}

.new-btn:hover {
  opacity: 0.9;
  text-decoration: none;
}

/* ── Rules list ─────────────────────────────────── */
.sidebar-list-area {
  flex: 1;
  min-height: 0;
}

.rule-list {
  list-style: none;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rule-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  height: 34px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: hsl(var(--muted-foreground));
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, color 0.15s;
  overflow: hidden;
}

.rule-item:hover {
  background: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.rule-item.active {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.rule-icon {
  flex-shrink: 0;
  opacity: 0.7;
}

.builtin-icon {
  color: hsl(142 71% 45%);
}

.rule-item.active .rule-icon {
  opacity: 1;
}

.rule-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Footer ─────────────────────────────────────── */
.sidebar-footer {
  border-top: 1px solid hsl(var(--border));
  padding: 10px 16px;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: hsl(var(--muted-foreground));
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: hsl(var(--foreground));
  text-decoration: none;
}

/* ── Main content ───────────────────────────────── */
.main-content {
  flex: 1;
  min-width: 0;
  height: 100vh;
  background: hsl(var(--muted) / 0.3);
  overflow: hidden;
  position: relative;
}
</style>
