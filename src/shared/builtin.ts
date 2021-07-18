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
    builtin: true,
  },
  {
    name: 'eleme',
    desc: 'Eleme app scheme',
    func: `interface Input {
      url: string
  }
  
  defineRule((i: Input) => {
      return \`eleme://web?url=\${encodeURIComponent(i.url)}\`
  })`,
  builtin: true,
  },
  {
    name: 'lark-miniapp',
    desc: '打开一个飞书小程序或者小程序中的一个页面',
    func: `interface Params {
      /** @label appid */
      /** @desc 小程序 appid  */
      appId: string
      /** @label 启动模式 */
      /** @desc 小程序启动模式 */
      mode: 'sidebar-semi' | 'appCenter' | 'window' | 'window-semi'
      /** @label 	页面 */
      /** @desc 需要跳转的页面路径，如 pages/index */
      path?: string
      /** @label 页面参数  */
      /** @desc 路径后的参数，如 a=b */
      pathQuery?: string
  }
  
  defineRule((p: Params) => {
      let path = ''
      if (p.path) {
          path = p.path
          if (p.pathQuery) {
              path += \`?\${p.pathQuery}\`
          }
      }
      if (path) {
          path = \`&path=\${encodeURIComponent(path)}\`
      }
  
      return \`https://applink.feishu.cn/client/mini_program/open?appId=\${p.appId}&mode=\${encodeURIComponent(p.mode)}\${path}\`
  })`,
    builtin: true
  },
] as Rule[]
