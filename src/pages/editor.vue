<template>
  <div class="editor">
    <div class="container" ref="container" v-loading="monacoLoading">
    </div>
    <div class="control" v-if="!readOnly">
      <div class="save-control">
        <button class="save" @click="save">Save</button>
        <div class="autosave">
          <input v-model="autoSave" id="autosave-checker" type="checkbox" >
          <label for="autosave-checker">Auto save</label>
          <a class="format" @click="formatCode">Format code</a>
        </div>
      </div>
      <div>
        Don't know how to write a rule? <a class="import" @click="onImport">Import a demo</a> and see what's happening
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onBeforeUnmount, PropType, ref, watch } from 'vue'
import type Monaco from 'monaco-editor'
import { monaco, monacoGetter, getRuntimeModel } from '@/shared/monaco'
import { ruleContext } from '@/shared/rules'
import { demoRule } from '@/shared/builtin'
import Storage from '@/shared/storage'
import { Rule } from '@/typings'
import { ElMessage } from 'element-plus'

const autoSaveStorageKey = '__editor_autosave__'
let editor: Monaco.editor.IStandaloneCodeEditor | null = null
let inited = false
const initMonaco = () => {
  if (inited) return
  // https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-configure-javascript-defaults
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
  ].join('\n'), `global.d.ts`)
  inited = true
}

export default defineComponent({
  props: {
    rule: {
      type: Object as PropType<Rule>,
      required: true,
    }
  },
  emits: [],
  setup(props, { emit }){
    const timer = ref()
    const monacoLoading = ref(true)
    const container = ref()
    const code = ref(props.rule.func || '')
    const autoSave = ref(Storage.get(autoSaveStorageKey, true))
    const { update } = inject(ruleContext)!

    watch(autoSave, val => {
      Storage.set(autoSaveStorageKey, val)
    })

    const syncCode = () => {
      update({
        ...props.rule,
        func: code.value || '',
      })
    }

    const graceSyncCode = () => {
      clearTimeout(timer.value)
      timer.value = setTimeout(() => {
        syncCode()
      }, 1000)
    }

    const cleanClear = () => {
      if (editor) {
        console.log('dispose')
        editor.dispose()
        editor = null
      }
    }

    const readOnly = computed(() => {
      return props.rule.builtin || props.rule.raw
    })

    const initEditor = async () => {
      cleanClear()
      monacoLoading.value = true
      await monacoGetter()
      initMonaco()
      monacoLoading.value = false
      editor = monaco.editor.create(container.value!, {
        model: getRuntimeModel(props.rule.name, code.value),
        language: 'typescript',
        theme: 'vs-light',
        automaticLayout: true,
        readOnly: readOnly.value,
        fontSize: 14,
        lineHeight: 20,
        fixedOverflowWidgets: true,
        minimap: {
          enabled: false,
        },
        scrollbar: {
          verticalScrollbarSize: 4
        }
      })
      editor.addAction({
        id: 'save-shortcut',
        label: 'Save rule',
        keybindings: [
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S
        ],
        run: () => {
          syncCode()
          ElMessage.success('Save successfully')
        }
      })
      editor.onDidChangeModelContent(() => {
        if (editor) {
          code.value = editor.getValue()
          if (autoSave.value) {
            graceSyncCode()
          }
        }
      })
    }

    const formatCode = () => {
      if (editor) {
        editor.getAction('editor.action.formatDocument')?.run()
      }
    }

    const save = () => {
      syncCode()
      ElMessage.success('Save successfully')
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

    return {
      container,
      save,
      readOnly,
      autoSave,
      monacoLoading,
      onImport,
      formatCode,
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/styles/var.scss";

.editor {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 10px 0;
  background: #fff;
}

.container {
  width: 100%;
  height: 100%;
}

h4 {
  margin-bottom: 16px;
  color: #6068d0;
  font-weight: bold;
}

.func-title {
  margin-top: 30px;
}

.mode {
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 4px 4px 0 0;
  position: absolute;
  height: 30px;
  line-height: 30px;
  top: -30px;
  right: 20px;
  padding: 0 6px;
  background: #fff;
  cursor: pointer;
}

.control {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 50px;
}

.save-control {
  display: flex;
  align-items: center;
}

.save {
  outline: none;
  border: 1px solid $main-color;
  border-radius: 4px;
  font-size: 12px;
  color: $main-color;
  background: #fff;
  padding: 4px 8px;
  cursor: pointer;
  transition: all .3s;
  &:hover {
    background: $main-color;
    color: #fff;
  }
}

.autosave {
  margin-left: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  label {
    margin-left: 4px;
    color: #888;
    transition: color .3s;
    cursor: pointer;
    user-select: none;
  }
  &:hover {
    label {
      color: $main-color;
    }
  }
  .format {
    margin-left: 20px;;
  }
}

</style>