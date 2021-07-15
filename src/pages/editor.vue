<template>
  <h4>Define rule params</h4>
  <section>
    <div class="mode">&lt;/&gt; source code</div>
    <h4>Hello world</h4>
  </section>
  <h4 class="func-title">Define rule function</h4>
  <section v-loading="monacoLoading" class="editor" ref="funcContainer" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import type Monaco from 'monaco-editor'
import { monaco as monacoNamespace, monacoGetter } from '@/shared/monaco'

let funcEditor: Monaco.editor.IStandaloneCodeEditor | null = null
let paramEditor: Monaco.editor.IStandaloneCodeEditor | null = null

export default defineComponent({
  props: {},
  emits: [],
  setup(props, { emit }){
    const monacoLoading = ref(true)
    const funcContainer = ref()
    const funcCode = ref('')

    const initFuncEditor = async () => {
      monacoLoading.value = true
      await monacoGetter()
      monacoLoading.value = false
      funcEditor = monacoNamespace.editor.create(funcContainer.value!, {
        value: funcCode.value,
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
      funcEditor.onDidChangeModelContent(() => {
        funcEditor && (funcCode.value = funcEditor.getValue())
      })
    }

    onMounted(() => {
      initFuncEditor()
    })

    return {
      funcContainer,
      monacoLoading,
    }
  }
})
</script>

<style lang="scss" scoped>
section {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  position: relative;
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

.editor {
  width: 100%;
  height: 360px;
  padding: 10px 0;
}
</style>