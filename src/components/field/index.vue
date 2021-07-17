<script lang="ts">
import { defineComponent, PropType, h, computed, watch } from 'vue'
import { ElInput, ElInputNumber } from 'element-plus'
import { Param, ParamType } from '@/typings'
import { ensureValueType } from '@/shared/rules'
import BoolCheck from './bool-check.vue'
import EnumSelect from './enum-select.vue'

type ValueType = string | number | boolean | void

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Number, Boolean, undefined] as PropType<ValueType>
    },
    param: {
      type: Object as PropType<Param>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const formComponent = computed(() => {
      let component: any = null
      if (props.param.type === ParamType.UNION) {
        component = EnumSelect
      } else {
        switch(props.param.type) {
          case ParamType.BOOLEAN:
            component = BoolCheck
            break
          case ParamType.STRING:
            component = ElInput
            break
          case ParamType.NUMBER:
            component = ElInputNumber
            break
        }
      }
      return component
    })

    watch(() => [props.modelValue, props.param.type] as [ValueType, ParamType], ([value, type]) => {
      const converted = ensureValueType(value, type)
      if (value !== converted) {
        emit('update:modelValue', converted)
      }
    })

    return () => {
      if (!formComponent.value) return null
      return h(formComponent.value, {
        param: props.param,
        modelValue: ensureValueType(props.modelValue, props.param.type),
        ['onUpdate:modelValue']: (v: any) => emit('update:modelValue', v)
      })
    }
  }
})
</script>

<style>

</style>