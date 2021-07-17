<template>
  <div class="home">
    <div class="inner">
      <img src="/logo.svg" />
      <h3>
        Highly customizable qrcode generator
        <span>for developer</span>
      </h3>
      <ul>
        <li>All data stored on your computer, safe and fast</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

// TODO an intro page here
export default defineComponent({
  props: {},
  emits: [],
  setup(props, { emit }){
    return {}
  }
})
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
  width: 100%;
  height: 100%;
}

.inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  flex-direction: column;
}

h3 {
  margin-top: 60px;
  padding-bottom: 6px;
  font-size: 26px;
  color: #4284f3;
  border-bottom: 3px solid #fabc05;
  span {
    font-size: 12px;
    color: #ea4335;
  }
}
</style>