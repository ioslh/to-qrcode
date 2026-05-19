<template>
  <div class="editor-shell">
    <div ref="container" class="editor-container"></div>
    <div v-if="!readOnly" class="editor-toolbar">
      <div class="toolbar-left">
        <button class="toolbar-btn primary-btn" @click="save">
          <Save :size="13" />
          Save
        </button>
        <label class="autosave-toggle">
          <Switch v-model:checked="autoSave" />
          <span>Auto save</span>
        </label>
        <button class="toolbar-btn ghost-btn" @click="formatCode">
          <WrapText :size="13" />
          Format
        </button>
      </div>
      <div class="toolbar-right">
        <span class="toolbar-hint">
          Don't know how to write a rule?
        </span>
        <button class="toolbar-btn ghost-btn" @click="onImport">
          <FileCode2 :size="13" />
          Import demo
        </button>
      </div>
    </div>
    <div v-else class="editor-readonly-bar">
      <Lock :size="12" />
      Read-only rule
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, watch, PropType } from 'vue'
import type Monaco from 'monaco-editor'
import { Save, WrapText, FileCode2, Lock } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { monaco, monacoGetter, getRuntimeModel } from '@/shared/monaco'
import { ruleContext } from '@/shared/rules'
import { demoRule } from '@/shared/builtin'
import Storage from '@/shared/storage'
import { Rule } from '@/typings'
import { Switch } from '@/components/ui/switch'

const props = defineProps<{ rule: Rule }>()

const autoSaveStorageKey = '__editor_autosave__'
let editor: Monaco.editor.IStandaloneCodeEditor | null = null
let inited = false

const initMonaco = () => {
  if (inited) return
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false
  })
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    allowJs: true,
    target: monaco.languages.typescript.ScriptTarget.ES2016,
    allowNonTsExtensions: true,
    checkJs: true,
    noLib: true,
    lib: ['ES5', 'ES2015', 'ESNext']
  })
  monaco.languages.typescript.typescriptDefaults.addExtraLib([
    'declare const defineRule: <T extends {}>(f: (input: T) => string | Promise<string>) => typeof f'
  ].join('\n'), 'global.d.ts')
  inited = true
}

const timer = ref<ReturnType<typeof setTimeout>>()
const container = ref<HTMLElement>()
const code = ref(props.rule.func || '')
const autoSave = ref(Storage.get(autoSaveStorageKey, true))
const { update } = inject(ruleContext)!

watch(autoSave, val => {
  Storage.set(autoSaveStorageKey, val)
})

const syncCode = () => {
  update({ ...props.rule, func: code.value || '' })
}

const graceSyncCode = () => {
  clearTimeout(timer.value)
  timer.value = setTimeout(syncCode, 1000)
}

const cleanClear = () => {
  if (editor) {
    editor.dispose()
    editor = null
  }
}

const readOnly = computed(() => props.rule.builtin || props.rule.raw)

const initEditor = async () => {
  cleanClear()
  await monacoGetter()
  initMonaco()
  if (!container.value) return
  editor = monaco.editor.create(container.value, {
    model: getRuntimeModel(props.rule.name, code.value),
    language: 'typescript',
    theme: 'vs-light',
    fontFamily: '"JetBrains Mono",Menlo,Monaco,Consolas,monospace',
    fontLigatures: true,
    automaticLayout: true,
    readOnly: readOnly.value,
    fontSize: 13,
    lineHeight: 22,
    fixedOverflowWidgets: true,
    minimap: { enabled: false },
    scrollbar: { verticalScrollbarSize: 4 },
    padding: { top: 16 },
    renderLineHighlight: 'none',
  })
  editor.addAction({
    id: 'save-shortcut',
    label: 'Save rule',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
    run: () => {
      syncCode()
      toast.success('Rule saved!')
    }
  })
  editor.onDidChangeModelContent(() => {
    if (editor) {
      code.value = editor.getValue()
      if (autoSave.value) graceSyncCode()
    }
  })
}

const formatCode = () => {
  editor?.getAction('editor.action.formatDocument')?.run()
}

const save = () => {
  syncCode()
  toast.success('Rule saved!')
}

const onImport = () => {
  getRuntimeModel(props.rule.name).setValue(demoRule)
}

watch(() => props.rule.func, f => {
  code.value = f || ''
})

watch(() => props.rule.name, initEditor, { immediate: true })

onBeforeUnmount(() => {
  cleanClear()
})
</script>

<style scoped>
.editor-shell {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: hsl(var(--background));
  position: relative;
}

.editor-container {
  flex: 1;
  min-height: 0;
  font-family: 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;
}

/* Toolbar */
.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-top: 1px solid hsl(var(--border));
  background: hsl(var(--background));
  flex-shrink: 0;
  gap: 8px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  border: 1px solid transparent;
}

.primary-btn {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: none;
}

.primary-btn:hover {
  opacity: 0.9;
}

.ghost-btn {
  background: hsl(var(--background));
  color: hsl(var(--muted-foreground));
  border-color: hsl(var(--border));
}

.ghost-btn:hover {
  background: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.autosave-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  user-select: none;
}

.toolbar-hint {
  font-size: 12px;
  color: hsl(var(--muted-foreground));
}

/* Readonly bar */
.editor-readonly-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-top: 1px solid hsl(var(--border));
  font-size: 11px;
  color: hsl(var(--muted-foreground));
  background: hsl(var(--muted) / 0.5);
  flex-shrink: 0;
}
</style>
