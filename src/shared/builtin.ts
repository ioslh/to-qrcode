import { Rule } from '@/typings'
import RuleImplement from '@/models/rule'

const builtinRules: Rule[] = [
  {
    name: 'text',
    desc: 'Any text to qrcode',
    func: '',
    params: [],
    builtin: true,
  },
  {
    name: 'contact',
    desc: 'Convert contact vcard to qrcode',
    func: '',
    params: [],
    builtin: true,
  },
]

export default builtinRules.map(rule => new RuleImplement(rule))