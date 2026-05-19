<script lang="ts">
import { defineComponent, PropType, h, computed, watch } from 'vue'
import { Param, ParamType } from '@/typings'
import { ensureValueType } from '@/shared/rules'
import { Input } from '@/components/ui/input'
import BoolCheck from './bool-check.vue'
import EnumSelect from './enum-select.vue'

type ValueType = string | number | boolean | void

// Minimal number input wrapper
const NumberInput = defineComponent({
  props: {
    modelValue: [Number, String] as PropType<number | string | void>,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('input', {
      type: 'number',
      value: props.modelValue ?? '',
      onInput: (e: Event) => emit('update:modelValue', Number((e.target as HTMLInputElement).value)),
      class: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    })
  }
})

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
      if (props.param.type === ParamType.UNION) return EnumSelect
      switch (props.param.type) {
        case ParamType.BOOLEAN: return BoolCheck
        case ParamType.STRING: return Input
        case ParamType.NUMBER: return NumberInput
      }
      return null
    })

    watch(() => [props.modelValue, props.param.type] as [ValueType, ParamType], ([value, type]) => {
      const converted = ensureValueType(value, type)
      if (value !== converted) emit('update:modelValue', converted)
    })

    return () => {
      if (!formComponent.value) return null
      return h(formComponent.value, {
        param: props.param,
        modelValue: ensureValueType(props.modelValue, props.param.type),
        'onUpdate:modelValue': (v: any) => emit('update:modelValue', v)
      })
    }
  }
})
</script>
