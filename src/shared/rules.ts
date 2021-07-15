import type { InjectionKey, Ref } from 'vue'
import { Rule } from '@/typings'
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
}

export const ruleContext: InjectionKey<RuleContext> = Symbol('rules')