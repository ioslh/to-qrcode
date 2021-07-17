<template>
  <span class="tip" v-if="!options.length">枚举配置不完整</span>
  <el-select
    v-if="dropdownMode"
    :model-value="modelValue"
    @update:model-value="onChange"
    placeholder="请选择"
  >
    <el-option
      v-for="(opt, idx) in options"
      :key="idx"
      :value="opt.value"
      :label="opt.label"
    />
  </el-select>
  <el-button-group v-else>
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
import { computed, defineComponent, PropType } from 'vue'
import { Param, UnionOption } from '@/typings'
import { normalizeUnionOptions } from '@/shared/rules'

type ValueType = string | number

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Number] as PropType<ValueType>
    },
    param: {
      type: Object as PropType<Param>,
      required: true,
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const options = computed(() => normalizeUnionOptions(props.param.options || []))
    const dropdownMode = computed(() => options.value.length > 3)
    const onChange = (nextValue: ValueType) => {
      emit('update:modelValue', nextValue)
    }

    return {
      options,
      dropdownMode,
      onChange,
    }
  }
})
</script>

<style scoped lang="scss">
.tip {
  color: #aaa;
  font-size: 0.8em;
}
</style>