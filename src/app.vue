<template>
  <nav>
    <router-link class="logo" to="/">[to-qrcode]</router-link>
    <div class="search">
      <input type="text" v-model="keyword" placeholder="Filter rules" />
      <router-link to="/new" class="create">New</router-link>
    </div>
    <ul class="list">
      <li v-for="r in rules" :key="r.name">
        <router-link active-class="active" :to="`/rules/${r.name}`">{{ r.name }}</router-link>
      </li>
    </ul>
  </nav>
  <main>
    <router-view></router-view>
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, provide } from 'vue'
import builtinRules from '@/shared/builtin'
import { getRules, ruleContext } from '@/shared/rules'
import { Rule } from './typings'


export default defineComponent({
  setup() {
    const keyword = ref('')
    const rules = ref<Rule[]>([])

    const addRule = (rule: Rule) => {
      rules.value.unshift(rule)
    }

    provide(ruleContext, { rules, addRule })

    onMounted(() => {
      rules.value = getRules().concat(builtinRules.map(r => r.toJSON()))
    })
    return {
      keyword,
      rules,
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
}

.logo {
  display: block;
  width: 100%;
  text-align: center;
  height: 40px;
  line-height: 40px;
  color: $main-color;
  text-decoration: none;
  margin-bottom: 20px; 
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
    width: calc(100% - 60px);
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
    &:hover {
      background: #eee;
    }
    &.active {
      background: $main-color;
      color: #fff;
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
