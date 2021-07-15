<template>
  <div class="wrapper" >
    <div class="generate" v-loading="parsing">
      Generate Page
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { ruleContext } from '@/shared/rules'
import { monaco, monacoGetter, tsWorker, tsWorkerGetter, codeParser } from '@/shared/monaco'
import { Rule } from '@/typings'

export default defineComponent({
  props: {
    rule: {
      type: Object as PropType<Rule>,
      required: true,
    }
  },
  emits: [],
  setup(props, { emit }){
    const parsing = ref(true)
    const params = ref([])
    const error = ref('')

    const parseCode = async (code?: string) => {
      if (!code) {
        error.value = `Rule is not defined`
        return
      }
      error.value = ''
      parsing.value = true
      try {
        await codeParser(code)
      } catch(e) {
        console.log(e)
        // error.value = e.message
      }
      parsing.value = false
    }

    watch(() => props.rule.func, parseCode, { immediate: true })

    return {
      parsing
    }
  }
})
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 20px;
}
.generate {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 200px;
}
</style>