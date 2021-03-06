import type { InjectionKey, Ref } from 'vue'
import { Rule, Param, ParamType, Primitive, UnionOption } from '@/typings'
import { isUndef } from '@/shared/utils'
import builtinRules from '@/shared/builtin'
import Storage from './storage'

const RULE_KEY = '__rules__'


export const getRules = () => {
  return Storage.get<Rule[]>(RULE_KEY, [])!
}

export const saveRules = (rules: Rule[]) => {
  Storage.set(RULE_KEY, rules)
}


interface RuleContext {
  rules: Ref<Rule[]>
  add: (r: Rule) => void
  update: (r: Rule) => void
  remove: (r: Rule) => void
  rename: (oldName: string, newName: string) => void
}

export const normalizeInitValue = (ps: Param[]): Record<string, any> => {
  return ps.reduce((obj, param) => {
    obj[param.prop] = param.defaultValue
    return obj
  }, {} as Record<string, any>)
}

export const ruleContext: InjectionKey<RuleContext> = Symbol('rules')


export const ensureValueType = (value: any, expectType: ParamType) => {
  if (isUndef(value)) return undefined
  switch(expectType) {
    case ParamType.BOOLEAN:
      return !!value
    case ParamType.NUMBER:
      return Number(value)
    case ParamType.STRING:
      return String(value)
    default:
      return value
  }
}

export const normalizeUnionOptions = (options: Primitive[]): UnionOption[] => {
  return options.filter(v => !isUndef(v)).map(v => ({
    value: v,
    label: String(v),
  }))
}


export const NAME_PATTERN = /^[-_a-zA-Z0-9]+$/


export const validateName = (name: string, existingRules: Rule[]) => {
  if (!name) {
    throw new Error('name cannot be empty')
  }
  if (!NAME_PATTERN.test(name)) {
    throw new Error(`name '${name}' is not match the pattern '${NAME_PATTERN}'`)
  }
  if (builtinRules.find(rule => rule.name === name)) {
    throw new Error(`name '${name}' is already used as builtin rule`)
  }
  if (existingRules.find(rule => rule.name === name)) {
    throw new Error(`name '${name}' is already used`)
  }
}