<template>
  <div class="home">
    <div class="inner">
      <h3>What's this</h3>
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
}
</style>