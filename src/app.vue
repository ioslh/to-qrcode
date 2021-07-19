<template>
  <div v-if="isMobile" class="mobile">
    <img src="/logo.svg" />
    <h3>to-qrcode</h3>
    <p>More than a qrcode generator</p>
    <div class="tip">Better to visit on a device with wider screen</div>
    <a>https://to-qcode.com</a>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { computed, defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const isMobile = computed(() => {
      return window.innerWidth < 600
    })

    return {
      isMobile,
    }
  },
})
</script>

<style lang="scss" scoped>
.mobile {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h3 {
  margin-top: 10px;
}

p {
  margin-top: 30px;
}

a {
  position: absolute;
  bottom: 2em;
}
</style>
