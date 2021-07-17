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
          const r = JSON.parse(atou(rawInUrl.value))
          if (typeof r === 'object' && typeof r.func === 'string') {
            return {
              name: r.name || 'Temporary rule',
              func: r.func,
            } as Rule
          }
        } catch {}
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