<template>
  <div class="editor">
    <div class="container" ref="container" v-loading="monacoLoading">
    </div>
    <div class="control">
      <button>保存</button>
      <input type="checkbox" >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue'
import type Monaco from 'monaco-editor'
import { monaco, monacoGetter, getRuntimeModel } from '@/shared/monaco'
import { ruleContext } from '@/shared/rules'
import { Rule } from '@/typings'

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
    const { update } = inject(ruleContext)!

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
        fontSize: 14,
        lineHeight: 20,
        fixedOverflowWidgets: true,
        scrollbar: {
          verticalScrollbarSize: 4
        }
      })
      editor.onDidChangeModelContent(() => {
        if (editor) {
          code.value = editor.getValue()
          graceSyncCode()
        }
      })
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
      monacoLoading,
    }
  }
})
</script>

<style lang="scss" scoped>
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
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>