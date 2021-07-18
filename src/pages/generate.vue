<template>
  <div v-if="parsing" v-loading="true" class="loading"></div>
  <div v-else-if="fatal" class="fatal">
    <i class="iconfont iconerror" />
    <p>{{ fatal }}</p>
    <p>
      Try
      <router-link v-if="!rule.builtin && !rule.raw" :to="`/rules/${rule.name}/edit`">update</router-link>
      your rule now
    </p>
  </div>
  <div v-else-if="error" class="wrapper">
    <div class="error">
      <p class="message">{{ error }}</p>
      <p class="guide">
        Try
        <router-link v-if="!rule.builtin && !rule.raw" :to="`/rules/${rule.name}/edit`">update</router-link>
        your rule now
      </p>
    </div>
  </div>
  <div v-else class="wrapper">
    <div class="rule">
      <div class="input">
        <table>
          <colgroup>
            <col width="0px"><col>
          </colgroup>
          <tbody>
            <tr v-for="param in params" :key="param.prop">
              <th>
                <template v-if="param.desc">
                  <el-tooltip placement="top-start" :content="param.desc">
                    <div class="prop-info" :class="{required: param.required}">
                      <span class="label">{{ param.label }}</span>
                      <span class="prop">({{ param.prop }})</span>
                    </div>
                  </el-tooltip>
                </template>
                <template v-else>
                  <div class="prop-info" :class="{required: param.required}">
                    <span class="label">{{ param.label }}</span>
                    <span class="prop">({{ param.prop }})</span>
                  </div>
                </template>
              </th>
              <td>
                <el-input
                  v-if="useTextarea"
                  type="textarea"
                  rows="6"
                  v-model="input[param.prop]"
                />
                <param-field
                  v-else
                  :model-value="input[param.prop]"
                  @update:model-value="v => input[param.prop] = v"
                  :param="param"
                />
              </td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>
                <el-button type="text" size="medium" @click="onReset">Reset</el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="output">
        <qrcode-output :input="output" :generating="generating" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, computed } from 'vue'
import { codeParser } from '@/shared/monaco'
import { ParamType } from '@/typings'
import type { Rule, Param, RuleImplement } from '@/typings'
import { normalizeInitValue } from '@/shared/rules'
import Error from '@/components/error.vue'
import ParamField from '@/components/field/index.vue'
import QrcodeOutput from '@/components/qrcode-output.vue'
import { idGenerator, isThenable, isUndef } from '@/shared/utils'


export default defineComponent({
  components: {
    Error,
    ParamField,
    QrcodeOutput,
  },
  props: {
    rule: {
      type: Object as PropType<Rule>,
      required: true,
    }
  },
  emits: [],
  setup(props, { emit }){
    const parsing = ref(true)
    const params = ref<Param[]>([])
    const jsCode = ref('')
    // fatal message, system error, will display message fullscreen
    const fatal = ref('')
    // normally user-input caused error
    const error = ref('')
    const generating = ref(false)
    const genTimer = ref()
    const input = ref<Record<string, any>>({})
    const output = ref('')
    const ruleImplement = ref<RuleImplement>()
    const heuristicAsync = ref(false)

    const resolveImplement = () => {
      const returnIdentifier = `fn_${idGenerator()}`
      const combineCode = [
        `var ${returnIdentifier}`,
        // use const to prevent hijack
        'const defineRule = (f) => {',
        `  ${returnIdentifier} = f`,
        '  return f',
        '}',
        jsCode.value,
        `return ${returnIdentifier}`
      ].join('\n')
      try {
        return new Function(combineCode)() as RuleImplement
      } catch(e) {
        return undefined
      }
    }

    const parseCode = async (code?: string) => {
      error.value = ''
      fatal.value = ''
      if (!code) {
        error.value = `Rule function is not defined`
        parsing.value = false
        return
      }
      parsing.value = true
      try {
        const { defined, js, params: ps } = await codeParser(props.rule.name, code)
        if (!defined || !js || !ps.length) {
          error.value = 'Rule defininition is not complete'
        } else {
          params.value = ps
          jsCode.value = js
          input.value = normalizeInitValue(ps)
          ruleImplement.value = resolveImplement()
          if (!ruleImplement.value) {
            error.value = 'Error happened while resolving rule function'
          }
        }
      } catch(e) {
        console.log(e)
        fatal.value = 'Oops, we have a problem, try refresh page'
      }
      parsing.value = false
    }

    const onReset = () => {
      input.value = normalizeInitValue(params.value)
    }

    const missRequiredFields = () => {
      return params.value.find((param) => {
        if (param.required) {
          const value = input.value[param.prop]
          if (isUndef(value)) {
            return true
          }
          // consider: should '' satisfy `required` requirement
          if (value === '') {
            return true
          }
        }
      })
    }

    const performGenerate = async () => {
      if (!ruleImplement.value) return
      let missField
      if (missField = missRequiredFields()) {
        // do not warning for now
        // ElMessage.warning(`'${missField.prop}' is required`)
        return
      }
      
      generating.value = true
      try {
        const tryOutput = ruleImplement.value.call(null, input.value)
        if (isThenable<string>(tryOutput)) {
          heuristicAsync.value = true
          output.value = await tryOutput
        } else if (typeof tryOutput === 'string') {
          output.value = tryOutput
        } else {

        }
      } catch(e) {
        //
      }
      console.log(output.value)
      generating.value = false
    }

    const runGenerate = () => {
      clearTimeout(genTimer.value)
      if (!heuristicAsync.value) {
        performGenerate()
      } else {
        genTimer.value = setTimeout(() => {
          performGenerate()
        }, 500)
      }
    }

    /** 特别的，如果只有一个文本类型参数，使用大表单输入 */
    const useTextarea = computed(() => params.value.length === 1 && params.value[0].type === ParamType.STRING)

    watch(() => props.rule.func, parseCode, { immediate: true })
    watch(input, runGenerate, { deep: true })

    return {
      fatal,
      error,
      parsing,
      params,
      input,
      output,
      generating,
      useTextarea,
      onReset,
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/styles/var.scss";

.loading {
  height: 100%;
  width: 100%;
}

.wrapper {
  padding: 20px;
  height: 100%;
}

.fatal {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  i {
    font-size: 60px;
    color: $danger-color;
    margin-bottom: 40px;
  }
  p {
    margin-top: 6px;
  }
}

.error {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
  background: #fff;
  .message {
    color: $danger-color;
  }
  .guide {
    margin-top: 20px;
    a {
      color: $main-color;
      font-weight: bold;
    }
  }
}

.rule {
  display: flex;
  align-items: flex-start;
  height: 100%;
}

.input {
  width: 70%;
  height: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th {
    text-align: left;
    width: 80px;
    white-space: nowrap;
    vertical-align: top;
  }
  th, td {
    padding: 10px 10px;
  }

  .prop-info {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    position: relative;
    &.required {
      &::before {
        content: '*';
        display: block;
        color: red;
        position: absolute;
        left: -8px;
        top: 2px;
        font-weight: 900;
      }
    }
  }

  .prop {
    font-size: 0.8em;
    color: #999;
    font-family: monaco;
    margin-left: 4px;
  }
}

.output {
  width: 30%;
  padding-left: 15px;
  padding-top: 10px;
}
</style>