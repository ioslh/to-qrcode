<template>
  <rule-view v-if="runtimeRule" :rule="runtimeRule" />
  <h2 v-else>lalala</h2>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRules, ruleContext } from '@/shared/rules'
import { atou } from '@/shared/utils'
import type { Rule } from '@/typings'
import RuleView from '@/components/rule.vue'

  // <error v-if="!currentRule">
  //   <p>The rule "<strong>{{ name }}</strong>" is not existed</p>
  // </error>

export default defineComponent({
  components: {
    RuleView
  },
  props: {},
  emits: [],
  setup(props, { emit }){
    const { rules, update } = inject(ruleContext)!
    const route = useRoute()
    const router = useRouter()
    const nameInUrl = computed(() => {
      return route.params.name as string
    })
    const rawInUrl = computed(() => {
      return route.query.raw as string
    })
    const runtimeRule = computed(() => {
      if (nameInUrl.value) {
        const r = rules.value.find(r => r.name === nameInUrl.value)
        if (r) return r
      }
      if (rawInUrl.value) {
        try {
          /**
           * vue-router will replace + with space(' '),
           * we have to replace it back
           * https://github.com/vuejs/vue-router-next/blob/master/src/query.ts#L56
           */
          const rawCode = rawInUrl.value.replace(/ /g, '+')
          const r = JSON.parse(atou(rawCode))
          if (typeof r === 'object' && typeof r.func === 'string') {
            return {
              name: r.name || 'Untitled rule',
              desc: r.desc ? String(r.desc) : '',
              func: r.func,
              raw: true,
            } as Rule
          }
        } catch(e) {
          console.log(e)
        }
      }
      return undefined
    })
    console.log(runtimeRule.value)

    return {
      runtimeRule,
      nameInUrl,
    }
  }
})
</script>

<style lang="scss" scoped>

</style>