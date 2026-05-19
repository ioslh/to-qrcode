<template>
  <!-- Loading -->
  <div v-if="parsing" class="loading-state">
    <div class="spinner"></div>
    <span>Parsing rule…</span>
  </div>

  <!-- Fatal error -->
  <div v-else-if="fatal" class="fatal-state">
    <XCircle :size="48" class="fatal-icon" />
    <p class="fatal-title">Fatal error</p>
    <p class="fatal-msg">{{ fatal }}</p>
    <p class="fatal-sub">
      Sorry for the trouble. Please
      <a href="https://github.com/ioslh/to-qrcode/issues/new" target="_blank">report this issue</a>
      so we can fix it.
    </p>
  </div>

  <!-- Rule error -->
  <div v-else-if="error" class="error-state">
    <div class="error-card">
      <div class="error-header">
        <AlertTriangle :size="18" class="error-icon" />
        <span>Rule error</span>
      </div>
      <p class="error-message">{{ error }}</p>
      <ul class="error-guide">
        <li v-if="!rule.builtin && !rule.raw">
          <router-link :to="`/rules/${rule.name}/edit`">Add or update</router-link>
          your rule function and parameter interface.
        </li>
        <li>Ensure both the function and interface are defined.</li>
        <li>Make sure your rule function contains a <code>defineRule</code> call.</li>
        <li>Try <strong>Import a demo</strong> in the editor to see an example.</li>
        <li>
          <a href="https://github.com/ioslh/to-qrcode/issues/new" target="_blank">Submit an issue</a>
          if you need help.
        </li>
      </ul>
    </div>
  </div>

  <!-- Main generate UI -->
  <div v-else class="generate-layout">
    <!-- Left: input form -->
    <div class="input-panel">
      <div class="input-scroll">
        <!-- Textarea mode (single string param) -->
        <div v-if="useTextarea" class="textarea-mode">
          <label class="field-label">
            <span>{{ params[0].label || params[0].prop }}</span>
            <span v-if="params[0].required" class="required-star">*</span>
          </label>
          <textarea
            class="big-textarea"
            :placeholder="params[0].desc || 'Enter your text here…'"
            :value="(input[params[0].prop] as string) || ''"
            @input="e => input[params[0].prop] = (e.target as HTMLTextAreaElement).value"
            rows="10"
          ></textarea>
        </div>

        <!-- Table mode (multiple params) -->
        <table v-else class="param-table">
          <colgroup>
            <col style="width: 140px" />
            <col />
          </colgroup>
          <tbody>
            <tr v-for="param in params" :key="param.prop" class="param-row">
              <th class="param-label">
                <Tooltip v-if="param.desc">
                  <TooltipTrigger as-child>
                    <div class="label-inner" :class="{ required: param.required }">
                      <span class="label-text">{{ param.label || param.prop }}</span>
                      <span class="prop-key">{{ param.prop }}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">{{ param.desc }}</TooltipContent>
                </Tooltip>
                <div v-else class="label-inner" :class="{ required: param.required }">
                  <span class="label-text">{{ param.label || param.prop }}</span>
                  <span class="prop-key">{{ param.prop }}</span>
                </div>
              </th>
              <td class="param-input">
                <ParamField
                  :model-value="input[param.prop]"
                  @update:model-value="v => input[param.prop] = v"
                  :param="param"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Reset row -->
        <div class="form-footer">
          <button class="reset-btn" @click="onReset">
            <RotateCcw :size="13" />
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Right: QR output -->
    <div class="output-panel">
      <QrcodeOutput :input="output" :generating="generating" :dirty="outputDirty" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, computed } from 'vue'
import { AlertTriangle, XCircle, RotateCcw } from 'lucide-vue-next'
import { codeParser } from '@/shared/monaco'
import { ParamType } from '@/typings'
import type { Rule, Param, RuleImplement } from '@/typings'
import { normalizeInitValue } from '@/shared/rules'
import ParamField from '@/components/field/index.vue'
import QrcodeOutput from '@/components/qrcode-output.vue'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { idGenerator, isThenable, isUndef } from '@/shared/utils'

const props = defineProps<{ rule: Rule }>()

const parsing = ref(true)
const params = ref<Param[]>([])
const jsCode = ref('')
const fatal = ref('')
const error = ref('')
const generating = ref(false)
const genTimer = ref<ReturnType<typeof setTimeout>>()
const input = ref<Record<string, any>>({})
const output = ref('')
const ruleImplement = ref<RuleImplement>()
const heuristicAsync = ref(false)
const outputDirty = ref(false)

const resolveImplement = () => {
  const returnIdentifier = `fn_${idGenerator()}`
  const combineCode = [
    `var ${returnIdentifier}`,
    'const defineRule = (f) => {',
    `  ${returnIdentifier} = f`,
    '  return f',
    '}',
    jsCode.value,
    `return ${returnIdentifier}`
  ].join('\n')
  try {
    return new Function(combineCode)() as RuleImplement
  } catch {
    return undefined
  }
}

const parseCode = async (code?: string) => {
  output.value = ''
  error.value = ''
  fatal.value = ''
  if (!code) {
    error.value = 'Rule function is totally empty.'
    parsing.value = false
    return
  }
  parsing.value = true
  try {
    const { defined, js, params: ps } = await codeParser(props.rule.name, code)
    if (!defined || !js || !ps.length) {
      error.value = 'Rule definition is not complete'
    } else {
      params.value = ps
      jsCode.value = js
      input.value = normalizeInitValue(ps)
      ruleImplement.value = resolveImplement()
      if (!ruleImplement.value) {
        error.value = 'Error happened while parsing rule function'
      }
    }
  } catch {
    fatal.value = 'Oops, we have a fatal problem here, try refreshing the page'
  }
  parsing.value = false
}

const onReset = () => {
  input.value = normalizeInitValue(params.value)
  output.value = ''
  outputDirty.value = false
}

const missRequiredFields = () =>
  params.value.find(param => {
    if (param.required) {
      const value = input.value[param.prop]
      if (isUndef(value)) return true
      if (value === '') return true
    }
  })

const performGenerate = async () => {
  if (!ruleImplement.value) return
  outputDirty.value = true
  if (missRequiredFields()) return
  generating.value = true
  try {
    const tryOutput = ruleImplement.value.call(null, input.value)
    if (isThenable<string>(tryOutput)) {
      heuristicAsync.value = true
      output.value = await tryOutput
      outputDirty.value = false
    } else if (typeof tryOutput === 'string') {
      output.value = tryOutput
      outputDirty.value = false
    }
  } catch {}
  generating.value = false
}

const runGenerate = () => {
  clearTimeout(genTimer.value)
  if (!heuristicAsync.value) {
    performGenerate()
  } else {
    genTimer.value = setTimeout(performGenerate, 500)
  }
}

const useTextarea = computed(() => params.value.length === 1 && params.value[0].type === ParamType.STRING)

watch(() => props.rule.func, parseCode, { immediate: true })
watch(input, runGenerate, { deep: true })
</script>

<style scoped>
/* Loading state */
.loading-state {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: hsl(var(--muted-foreground));
  font-size: 13px;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 2px solid hsl(var(--border));
  border-top-color: hsl(var(--primary));
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Fatal state */
.fatal-state {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px;
  text-align: center;
}

.fatal-icon {
  color: hsl(var(--destructive));
}

.fatal-title {
  font-size: 16px;
  font-weight: 600;
}

.fatal-msg {
  color: hsl(var(--destructive));
  font-size: 13px;
}

.fatal-sub {
  font-size: 12px;
  color: hsl(var(--muted-foreground));
}

/* Error state */
.error-state {
  padding: 20px;
  height: 100%;
}

.error-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 10px;
  padding: 20px;
}

.error-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: hsl(var(--destructive));
  margin-bottom: 10px;
}

.error-icon {
  flex-shrink: 0;
}

.error-message {
  font-size: 13px;
  color: hsl(var(--destructive));
  padding: 8px 12px;
  background: hsl(var(--destructive) / 0.06);
  border-radius: 6px;
  margin-bottom: 14px;
}

.error-guide {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.error-guide li {
  font-size: 12px;
  color: hsl(var(--muted-foreground));
  padding-left: 16px;
  position: relative;
}

.error-guide li::before {
  content: '•';
  position: absolute;
  left: 4px;
  color: hsl(var(--muted-foreground));
}

/* Generate layout */
.generate-layout {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.input-panel {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-right: 1px solid hsl(var(--border));
}

.input-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.input-scroll::-webkit-scrollbar {
  width: 4px;
}

.input-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.input-scroll::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 4px;
}

/* Textarea mode */
.textarea-mode {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  color: hsl(var(--foreground));
}

.required-star {
  color: hsl(var(--destructive));
}

.big-textarea {
  flex: 1;
  width: 100%;
  min-height: 200px;
  padding: 12px;
  border: 1px solid hsl(var(--input));
  border-radius: 8px;
  background: hsl(var(--background));
  font-size: 14px;
  color: hsl(var(--foreground));
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.big-textarea:focus {
  border-color: hsl(var(--ring));
  box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
}

.big-textarea::placeholder {
  color: hsl(var(--muted-foreground));
}

/* Param table */
.param-table {
  width: 100%;
  border-collapse: collapse;
}

.param-row th,
.param-row td {
  padding: 8px 10px;
  vertical-align: top;
}

.param-label {
  text-align: left;
  width: 140px;
  white-space: nowrap;
}

.label-inner {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
  min-height: 40px;
  justify-content: center;
  position: relative;
}

.label-inner.required::before {
  content: '*';
  position: absolute;
  left: -10px;
  top: 10px;
  color: hsl(var(--destructive));
  font-size: 12px;
  font-weight: 700;
}

.label-text {
  font-size: 13px;
  font-weight: 500;
  color: hsl(var(--foreground));
}

.prop-key {
  font-size: 10px;
  color: hsl(var(--muted-foreground));
  font-family: 'JetBrains Mono', monospace;
}

.param-input {
  vertical-align: middle;
}

/* Form footer */
.form-footer {
  margin-top: 16px;
  display: flex;
  align-items: center;
}

.reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border: 1px solid hsl(var(--border));
  border-radius: 6px;
  background: hsl(var(--background));
  color: hsl(var(--muted-foreground));
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.reset-btn:hover {
  background: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

/* Output panel */
.output-panel {
  width: 280px;
  flex-shrink: 0;
  padding: 20px;
  background: hsl(var(--muted) / 0.3);
  overflow-y: auto;
}
</style>
