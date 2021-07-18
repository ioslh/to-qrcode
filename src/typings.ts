export type Primitive = string | number | boolean | symbol | void
export interface UnionOption {
  label: string
  value: Primitive
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
  options?: UnionOption[]
  defaultValue?: Primitive
  required?: boolean
}

export interface Rule {
  name: string
  desc?: string
  func?: string
  builtin?: boolean
  raw?: boolean
}

export interface CodeParserResult {
  params: Param[]
  defined: boolean
  js: string
}

export type ReturnPromisify<F extends ((...args: any) => any)> = F extends (...args: infer P) => infer R ? (...args: P) => Promise<R> : never;

export type RuleImplement = (i: Record<string, any>) => string | Promise<string>