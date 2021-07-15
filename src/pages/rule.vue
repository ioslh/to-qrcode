<template>
  <div class="empty" v-if="!name">
    <i class="iconfont iconempty"/>
    <p>Empty rule name</p>
  </div>
  <template v-else>
    <header>
      <h2>{{ name }}</h2>
      <div class="menu">
        <a
          v-for="m in menus"
          :key="m.key"
          :class="{active: m.key === menu}"
          @click="redirectMenu(m.key)"
        >{{ m.name }}</a>
      </div>
    </header>
    <section>content here</section>
  </template>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface MenuItem {
  name: string
  key: string
}

export default defineComponent({
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
      get: () => route.params.menu as string || 'use',
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
  padding: 20px 30px 0 30px;
  background: #fff;
  border-bottom: 1px solid #ddd;
  font-size: 30px;
}

.menu {
  position: relative;
  bottom: -1px;
  a {
    display: inline-block;
    font-size: 14px;
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
</style>