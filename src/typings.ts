export interface UnionOption {
  label: string
  value: string | number | boolean | void
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
  options?: UnionOption[] | any[]
  defaultValue?: any
  required?: boolean
}

export interface Rule {
  name: string
  desc: string
  params: Param[]
  func: string
  builtin?: boolean
}