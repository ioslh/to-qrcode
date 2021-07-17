<template>
  <div class="logo">
    <i></i>
    <i></i>
    <i></i>
    <i></i>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  props: {},
  emits: [],
  setup(props, { emit }){
    return {}
  }
})
</script>

<style lang="scss" scoped>
.logo {
  width: 22px;
  height: 22px;
  display: inline-block;
  position: relative;
  i {
    width: 10px;
    height: 10px;
    position: absolute;
    border: 3px solid transparent;
    border-radius: 2px;
    &:nth-child(1) {
      left: 0;
      top: 0;
      border-color: #4284f3;
    }
    &:nth-child(2) {
      left: 12px;
      top: 0;
      border-color: #ea4335;
    }
    &:nth-child(3) {
      left: 0;
      top: 12px;
      border-color: #fabc05;
    }
    &:nth-child(4) {
      left: 12px;
      top: 12px;
      border-color: #ccc;
      background: #ccc;
    }
  }
}
</style>