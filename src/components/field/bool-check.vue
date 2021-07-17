<template>
  <el-button-group>
    <el-button
      @click="onChange(opt.value)"
      v-for="(opt, idx) in options"
      :key="idx"
      :type="modelValue === opt.value ? 'primary' : undefined"
    >
      {{ opt.label }}
    </el-button>
  </el-button-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const options = [
  {
    label: '是',
    value: true,
  },
  {
    label: '否',
    value: false,
  },
]

export default defineComponent({
  props: { modelValue: Boolean },
  emits: ['update:modelValue'],
  setup(_, { emit }) {
    const onChange = (bool: boolean) => {
      emit('update:modelValue', bool)
    }
    return {
      options,
      onChange
    }
  }
})
</script>

<style>

</style>