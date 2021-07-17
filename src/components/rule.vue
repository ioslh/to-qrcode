<template>
  <header>
    <div class="intro">
      <h2>{{ rule.name }}</h2>
      <div class="desc">
        <input :disabled="rule.builtin" v-model="desc" class="tip" type="text" placeholder="// Add some descriptions for this rule" />
      </div>
    </div>
    <div class="menu">
      <a
        v-for="m in menus"
        :key="m.key"
        :class="{active: m.key === menu}"
        @click="redirectMenu(m.key)"
      >{{ m.name }}</a>
    </div>
  </header>
  <section>
    <!-- <settings v-if="menu === 'settings'" :rule="currentRule" /> -->
    <editor v-if="menu === 'edit'" :rule="rule" />
    <generate v-else :rule="rule" />
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, inject, PropType } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Generate from '@/pages/generate.vue'
import Settings from '@/pages/settings.vue'
import Editor from '@/pages/editor.vue'
import { ruleContext } from '@/shared/rules'
import Readonly from '@/components/readonly.vue'
import Error from '@/components/error.vue'
import type { Rule } from '@/typings'

interface MenuItem {
  name: string
  key: string
}

export default defineComponent({
  components: {
    Generate,
    Settings,
    Editor,
    Readonly,
    Error,
  },
  props: {
    rule: {
      type: Object as PropType<Rule>,
      required: true,
    }
  },
  emits: [],
  setup(props, { emit }){
    const { update } = inject(ruleContext)!
    const route = useRoute()
    const router = useRouter()
    const desc = computed({
      get: () => props.rule.desc || '',
      set: v => {
        const nextRule = {
          ...props.rule,
          desc: v,
        }
        update(nextRule)
      }
    })

    const menus = ref<MenuItem[]>([])
    const menu = computed(() => route.params.menu as string || 'gen')

    onMounted(() => {
      menus.value = [
        {
          name: 'Generate QRCode',
          key: 'gen',
        },
        {
          name: 'Edit Rule',
          key: 'edit',
        },
        // {
        //   name: 'Settings',
        //   key: 'settings',
        // },
      ]
    })
    
    const redirectMenu = (key: string) => {
      router.push(`/rules/${props.rule.name}/${key}`)
    }
 
    return {
      name,
      menu,
      menus,
      desc,
      redirectMenu,
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/styles/var.scss";

header {
  padding: 20px 20px 0 20px;
  background: #fff;
  border-bottom: 1px solid #ddd;
  font-size: 30px;
}

.intro {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

h2 {
  flex-shrink: 0;
  font-size: 26px;
}

.desc {
  font-size: 14px;
  margin-left: 20px;
  color: #aaa;
  overflow: hidden;
  flex: 1;
}

.tip {
  font-size: 12px;
  color: #999;
  outline: none;
  border: none;
  width: 100%;
  &::placeholder {
    color: #ccc;
  }
  &:disabled {
    background: transparent;
  }
}

.menu {
  position: relative;
  bottom: -1px;
  a {
    display: inline-block;
    font-size: 12px;
    text-decoration: none;
    padding: 6px 0;
    border-bottom: 2px solid transparent;
    color: #999;
    margin-right: 20px;
    cursor: pointer;
    &.active {
      border-bottom-color: $main-color;
      color: $main-color;
    }
  }
}

section {
  height: calc(100% - 99px);
  position: relative;
}
</style>