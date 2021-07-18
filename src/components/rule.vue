<template>
  <header>
    <div class="head">
      <div class="info">
        <span class="raw" v-if="rule.raw">Shared</span>
        <h2>{{ rule.name }}</h2>
        <div>{{ rule.desc }}</div>
      </div>
      <a class="action" v-if="rule.raw" @click="onSaveAs">Save locally</a>
      <a v-else class="action" @click="onShare">Open share link</a>
    </div>
    <div class="menu">
      <a
        v-for="m in menus"
        :key="m.key"
        :class="{active: m.key === runtimeMenu}"
        @click="runtimeMenu = m.key"
      >{{ m.name }}</a>
    </div>
  </header>
  <section>
    <settings v-if="runtimeMenu === 'settings'" :rule="rule" />
    <editor v-else-if="runtimeMenu === 'edit'" :rule="rule" />
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
import { utoa } from '@/shared/utils'

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
    const { update, remove, rules, add } = inject(ruleContext)!
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

    const name = computed({
      get: () => props.rule.name,
      set: (v) => {
        //
      }
    })

    const menus = ref<MenuItem[]>([])
    const menu = ref('gen')
    const runtimeMenu = computed({
      get: () => {
        if (props.rule.raw) {
          return menu.value
        } else {
          return route.params.menu as string || 'gen'
        }
      },
      set: (v) => {
        if (props.rule.raw) {
          menu.value = v
        } else {
          router.push(`/rules/${props.rule.name}/${v}`)
        }
      }
    })

    onMounted(() => {
      menus.value = [
        {
          name: 'Generate',
          key: 'gen',
        },
        {
          name: 'Rule',
          key: 'edit',
        },
        {
          name: 'Settings',
          key: 'settings',
        },
      ]
    })

    const onShare = () => {
      const raw = utoa(JSON.stringify(props.rule))
      const link = `${location.origin}/rules?raw=${raw}`
      window.open(link, '_blank')
    }

    const onRemove = () => {
      remove(props.rule)
      router.push(`/rules/${rules.value[0].name}/gen`)
    }

    const onSaveAs = () => {
      const newName = `${props.rule.name}(from-shared)`
      const rule = {
        ...props.rule,
        name: newName,
        raw: false,
      }
      add(rule)
      router.push(`/rules/${newName}/gen`)
    }
 
    return {
      name,
      desc,
      menus,
      onShare,
      onSaveAs,
      onRemove,
      runtimeMenu,
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

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  width: calc(100% - 140px);
  overflow: hidden;
  span {
    font-size: 10px;
    border: 1px solid #fabc05;
    color: #fff;
    background: #fabc05;
    padding: 4px;
    border-radius: 2px;
    margin-right: 4px;
  }
  h2 {
    flex-shrink: 0;
    font-size: 26px;
  }
  div {
    color: #ccc;
    font-size: 12px;
    margin-left: 20px;
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.action {
  font-size: 12px;
  color: $main-color;
  cursor: pointer;
  width: 120px;
  flex-shrink: 0;
  text-align: right;
  &:hover {
    color: $main-color;
    text-decoration: underline;
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