<template>
  <div v-if="parsing" v-loading="true" class="loading"></div>
  <error v-else-if="error" :desc="error" />
  <div v-else>bazinga</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { codeParser } from '@/shared/monaco'
import { Rule } from '@/typings'
import Error from '@/components/error.vue'

export default defineComponent({
  components: {
    Error
  },
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
      console.log('------')
      console.log(code)
      if (!code) {
        error.value = `Rule is not defined`
        parsing.value = false
        return
      }
      error.value = ''
      parsing.value = true
      try {
        const { defined, js, params } = await codeParser(props.rule.name, code)
        if (!defined || !js) {
          error.value = 'Rule defininition is not complete'
        }
      } catch(e) {
        error.value = 'Oops, we have a problem'
        console.log(e)
      }
      parsing.value = false
    }

    watch(() => props.rule.func, parseCode, { immediate: true })

    return {
      error,
      parsing
    }
  }
})
</script>

<style lang="scss" scoped>
.loading {
  height: 100%;
  width: 100%;
}

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