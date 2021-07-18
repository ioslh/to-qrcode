<template>
  <header>
    <div class="intro">
      <div class="left">
        <input class="name" type="text" v-model="name" />
        <input :disabled="rule.builtin || rule.raw" v-model="desc" class="tip" type="text" :placeholder="rule.raw ? '' : '// Add some descriptions for this rule'" />
      </div>
      <div class="actions" v-if="!rule.raw">
        <el-popconfirm
          v-if="!rule.builtin"
          title="Are you sure to delete?"
          confirmButtonText="Yes"
          cancelButtonText="Cancel"
          @confirm="onRemove"
        >
          <template #reference>
            <i class="iconfont icondelete" />
          </template>
        </el-popconfirm>
        <i class="iconfont iconshare" @click="onShare" />
      </div>
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
    <!-- <settings v-if="menu === 'settings'" :rule="currentRule" /> -->
    <editor v-if="runtimeMenu === 'edit'" :rule="rule" />
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
    const { update, remove, rules, rename } = inject(ruleContext)!
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

    const onShare = () => {
      const raw = utoa(JSON.stringify(props.rule))
      const link = `${location.origin}/rules?raw=${raw}`
      console.log(link)
      window.open(link, '_blank')
    }

    const onRemove = () => {
      remove(props.rule)
      router.push(`/rules/${rules.value[0].name}/gen`)
    }
 
    return {
      name,
      desc,
      menus,
      onShare,
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

.intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
}

.name {
  outline: none;
  border: none;
  font-size: 20px;
  color: #333;
}

.tip {
  font-size: 12px;
  color: #999;
  outline: none;
  border: none;
  width: 100%;
  margin-left: 20px;
  &::placeholder {
    color: #ccc;
  }
  &:disabled {
    background: transparent;
  }
}

.actions {
  font-size: 18px;
  i {
    color: #999;
    margin-right: 6px;
    cursor: pointer;
    &:hover {
      color: $main-color;
    }
  }
}

h2 {
  flex-shrink: 0;
  font-size: 26px;
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