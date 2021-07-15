<template>
  <div class="empty" v-if="!name">
    <i class="iconfont iconempty"/>
    <p>Empty rule name</p>
  </div>
  <template v-else>
    <header>
      <div class="intro">
        <h2>{{ name }}</h2>
        <div class="desc">hello world</div>
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
      <div class="inner">
        <generate v-if="menu === 'gen'" />
        <settings v-else-if="menu === 'settings'" />
        <editor v-else-if="menu === 'edit'" />
        <div v-else>
          oops
        </div>
      </div>
    </section>
  </template>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Generate from '@/pages/generate.vue'
import Settings from '@/pages/settings.vue'
import Editor from '@/pages/editor.vue'

interface MenuItem {
  name: string
  key: string
}

export default defineComponent({
  components: {
    Generate,
    Settings,
    Editor,
  },
  props: {},
  emits: [],
  setup(props, { emit }){
    const route = useRoute()
    const router = useRouter()
    const name = computed(() => {
      return route.params.name as string
    })
    const menus = ref<MenuItem[]>([])
    const menu = computed({
      get: () => route.params.menu as string || 'gen',
      set: (v) => {
        router.push({
          params: {
            ...route.params,
            name: name.value,
            menu: menu.value,
          }
        })
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
        {
          name: 'Settings',
          key: 'settings',
        },
      ]
    })
    
    const redirectMenu = (key: string) => {
      router.push(`/rules/${name.value}/${key}`)
    }
 
    return {
      name,
      menu,
      menus,
      redirectMenu,
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/styles/var.scss";

.empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  i {
    font-size: 40px;
    color: #ec9999;
  }
  p {
    color: #aaa;
    font-size: 14px;
    margin-top: 20px;
  }
}

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
  padding: 20px;
}

.inner {
  width: 100%;
  height: 100%;
}
</style>