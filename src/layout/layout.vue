<template>
  <nav>
    <router-link class="index" to="/">
      <logo />
      <span>to-qrcode</span>
    </router-link>
    <div class="search">
      <input type="text" v-model="keyword" placeholder="Filter rules" />
      <router-link to="/new" class="create">New</router-link>
    </div>
    <ul class="list">
      <li v-for="r in displayRules" :key="r.name">
        <a :class="{active: activeRule === r.name, builtin: r.builtin }" @click="activeRule = r.name">
          <i v-if="r.builtin" class="iconfont el-icon-s-opportunity" />
          {{ r.name }}
        </a>
      </li>
    </ul>
  </nav>
  <main>
    <router-view></router-view>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, provide, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import builtinRules from '@/shared/builtin'
import { getRules, saveRules, ruleContext } from '@/shared/rules'
import { Rule } from '@/typings'
import Logo from '@/components/logo.vue'

export default defineComponent({
  components: {
    Logo
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const activeRule = computed({
      get: () => route.params.name as string,
      set: (name) => {
        router.push(`/rules/${name}/gen`)
      }
    })
    const keyword = ref('')
    const rules = ref<Rule[]>(getRules().filter(r => !r.builtin).concat(builtinRules))

    const displayRules = computed(() => {
      const k = keyword.value.trim().toLowerCase()
      if (!k) return rules.value
      return rules.value.filter(rule => {
        if (rule.name.toLowerCase().includes(k)) return true
        return false
      })
    })

    watch(rules, rs => {
      saveRules(rs.filter(r => !r.builtin))
    }, { deep: true })

    const removeRule = (rule: Rule) => {
      if (rule.builtin) return
      const index = rules.value.findIndex(r => r.name === rule.name)
      if (index !== -1) {
        rules.value.splice(index, 1)
      }
    }

    const addRule = (rule: Rule) => {
      if (rule.builtin) return
      const index = rules.value.findIndex(r => r.name === rule.name)
      if (index === -1) {
        rules.value.unshift(rule)
      } else {
        rules.value[index] = rule
      }
    }

    const updateRule = (rule: Rule) => {
      if (rule.builtin) return
      const index = rules.value.findIndex(r => r.name === rule.name)
      if (index !== -1) {
        rules.value[index] = rule
      }
    }

    const renameRule = (oldName: string, newName: string) => {
      const index = rules.value.findIndex(r => r.name === oldName)
      if (index !== -1) {
        const rule = {
          ...rules.value[index],
          name: newName
        }
        rules.value[index] = rule
      }
    }

    provide(ruleContext, { rules, add: addRule, update: updateRule, remove: removeRule, rename: renameRule })
    return {
      activeRule,
      keyword,
      rules,
      displayRules,
    }
  }
})
</script>

<style scoped lang="scss">
@import "@/styles/var.scss";

$nav-width: 260px;

nav {
  width: $nav-width;
  border-right: 1px solid #ddd;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
}

.index {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  text-align: left;
  height: 60px;
  line-height: 60px;
  color: $main-color;
  text-decoration: none;
  span {
    margin-left: 16px;
    color: #f3a39c;
    transition: color .3s;
    font-weight: bold;
  }
  &:hover {
    span {
      color: #ea4335;
    }
  }
}

.search {
  width: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  input {
    height: 36px;
    border: 2px solid #eee;
    background: #eee;
    outline: none;
    transition: border-color .3s;
    border-radius: 4px;
    text-indent: 1em;
    width: calc(100% - 50px);
    &:hover {
      border-color: #888;
    }
    &:focus {
      border-color: $main-color;
      background: #fff;
    }
  }
  a {
    height: 36px;
    width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: $main-color;
    background: #fff;
    font-size: 20px;
    text-decoration: none;
  }
}

.list {
  list-style: none;
  margin-top: 10px;
  overflow: auto;
  height: calc(100% - 100px);
  padding-bottom: 40px;
  &::-webkit-scrollbar {
    display: none;
  }
  li {
    margin: 4px 0;
  }
  a {
    display: block;
    width: 100%;
    height: 36px;
    line-height: 36px;
    text-decoration: none;
    color: #aaa;
    padding: 0 10px;
    border-radius: 4px;
    transition: all .3s;
    background: transparent;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
    &.active {
      background: $main-color;
      color: #fff;
      i {
        color: #daf5cd;
      }
    }
    i {
      color: #69af47;
    }
  }
}

main {
  width: calc(100vw - #{$nav-width});
  font-size: 12px;
  background: #fafafa;
  position: relative;
}
</style>
