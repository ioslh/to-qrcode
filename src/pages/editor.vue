<template>
  <h4>Define rule params</h4>
  <section>
    <div class="mode">&lt;/&gt; source code</div>
  </section>
  <h4 class="func-title">Define rule function</h4>
  <section>
    <div class="editor" ref="funcContainer"></div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  props: {},
  emits: [],
  setup(props, { emit }){
    const funcContainer = ref()
    return {
      funcContainer,
    }
  }
})
</script>

<style lang="scss" scoped>
section {
  padding: 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  position: relative;
}

h4 {
  margin-bottom: 16px;
  color: #6068d0;
  font-weight: bold;
}

.func-title {
  margin-top: 30px;
}

.mode {
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 4px 4px 0 0;
  position: absolute;
  height: 30px;
  line-height: 30px;
  top: -30px;
  right: 20px;
  padding: 0 6px;
  background: #fff;
  cursor: pointer;
}

.editor {
  width: 100%;
}
</style>