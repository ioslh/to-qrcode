import { Rule } from '@/typings'
import ParamImplement from './param'
import { syncRule } from '@/shared/rules'

export default class RuleImplement  {
  name: string
  desc: string
  params: ParamImplement[]
  func: string
  builtin: boolean
  constructor(input: Partial<Rule>) {
    if (!input.name) {
      throw new Error('`name` is required to create a rule')
    }
    this.name = input.name
    this.desc = input.desc || ''
    this.params = (input.params || []).map(p => new ParamImplement(p))
    this.func = input.func || ''
    this.builtin = input.builtin || false
  }

  toJSON(): Rule {
    return {
      name: this.name,
      desc: this.desc,
      params: this.params.map(p => p.toJSON()),
      func: this.func,
      builtin: this.builtin
    }
  }

  sync() {
    syncRule(this.toJSON())
    return this
  }
}
