import { Rule } from '@/typings'

export default [
  {
    name: 'text',
    desc: 'Any text to qrcode',
    func: `interface Input {
      text: string
  }
  
  defineRule((i: Input) => {
      return i.text
  })`,
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
] as Rule[]
