import { Rule } from '@/typings'

export const demoRule = `interface User {
  /** @label Name */
  /** @default Sheldon Cooper */
  name: string
  /** @label Nickname */
  /** @desc If exist, type it in */
  /** @default Shelly */
  nickname?: string
  /** @label Age */
  /** @default 31 */
  age: number
  /** @label Gender */
  gender?: "female" | "male"
  /** @label Best friend */
  bf?: 'Leonard' | 'Howard' | 'Raj' | 'Penny' | 'Amy'
}

defineRule((user: User) => {
    let text = ''
    if (user.gender === 'male') {
        text = 'Mr '
    } else if (user.gender === 'female') {
        text = 'Miss '
    }
    text += \`\${user.name} is \${user.age} years old\`
    if (user.nickname) {
        text += \`, whose nickname is \${user.nickname}\`
    }
    if (user.bf) {
        text += \`, whost best friend is \${user.bf}\`
    }
    text += '.'
    return text
})
`

export default [
  {
    name: 'text',
    desc: 'Any text to qrcode',
    func: `interface Input {
      /** @label Text */
      /** @desc Convert any text to a qrcode */
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
