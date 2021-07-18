<template>
  <rule-view v-if="runtimeRule" :rule="runtimeRule" />
  <div class="wrapper" v-else>
    <div class="inner">
      <error v-if="nameInUrl">
        <div class="guide">
          <p>Rule "{{ nameInUrl }}" is not exist.</p>
          <p>Double check the url, or maybe <a @click="onCreate">create the "{{ nameInUrl }}" rule</a> right now?</p>
        </div>
      </error>
      <error v-else-if="rawInUrl">
        <div class="guide">
          <p>Raw content in url is illegal and failed parsing</p>
          <div class="raw">{{ rawInUrl }}</div>
        </div>
      </error>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ruleContext } from '@/shared/rules'
import { atou } from '@/shared/utils'
import type { Rule } from '@/typings'
import RuleView from '@/components/rule.vue'
import Error from '@/components/error.vue'

export default defineComponent({
  components: {
    RuleView,
    Error
  },
  props: {},
  emits: [],
  setup(props, { emit }){
    const { rules, add } = inject(ruleContext)!
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
          if (typeof r === 'object') {
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

    const onCreate = () => {
      add({ name: nameInUrl.value })
      router.push(`/rules/${nameInUrl.value}/edit`)
    }

    return {
      runtimeRule,
      nameInUrl,
      rawInUrl,
      onCreate,
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/styles/var.scss";

.wrapper {
  padding: 20px;
  height: 100%;
}

.inner {
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  height: 100%;
}

.guide {
  text-align: center;
  p {
    margin-top: 10px;
  }
}

.raw {
  width: 60%;
  word-break: break-all;
  margin:  20px auto 0;
  padding: 20px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>