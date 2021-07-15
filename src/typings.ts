export interface UnionOption {
  label: string
  value: any
}

export interface EditingUnionOption extends UnionOption {
  _id: string
}

export enum ParamType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  UNION = 'union',
}


export interface Param {
  prop: string
  type: ParamType
  label?: string
  desc?: string
  // used when type is union
  options?: UnionOption[]
  defaultValue?: any
  required?: boolean
}

export interface Rule {
  name: string
  desc?: string
  params?: Param[]
  func?: string
  builtin?: boolean
}

export interface CodeParserResult {
  params: Param[]
  js: string
}

export type ReturnPromisify<F extends ((...args: any) => any)> = F extends (...args: infer P) => infer R ? (...args: P) => Promise<R> : never;