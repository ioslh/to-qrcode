import type { InjectionKey, Ref } from 'vue'
import { Rule } from '@/typings'
import Storage from './storage'

const RULE_KEY = '__rules__'

export const syncRule = (rule: Rule) => {
  const rules = Storage.get<Rule[]>(RULE_KEY, [])!
  const foundIndex = rules.findIndex(r => r.name === rule.name)
  if (foundIndex === -1) {
    rules.push(rule)
  } else {
    rules[foundIndex] = rule
  }
  Storage.set(RULE_KEY, rules)
}

export const getRules = () => {
  return Storage.get<Rule[]>(RULE_KEY, [])!
}




export const createRule = (name: string) => {

}

interface RuleContext {
  rules: Ref<Rule[]>
  addRule: (r: Rule) => void
}

export const ruleContext: InjectionKey<RuleContext> = Symbol('rules')