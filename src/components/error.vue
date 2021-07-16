<template>
  <div class="error">
    <i class="iconfont iconempty"/>
    <div class="desc">
      <slot>
        <p>{{ desc }}</p>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  props: {
    desc: String,
  },
  emits: [],
  setup(props, { emit }){
    return {}
  }
})
</script>

<style lang="scss" scoped>
.error {
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
  .desc {
    color: #aaa;
    font-size: 14px;
    margin-top: 20px;
  }
}
</style>