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

export type ReturnPromisify<F extends Function> =
  F extends (a: infer A) => infer T
    ? (a: A) => Promise<T>
    : F extends (a: infer A, b: infer B) => infer T
      ? (a: A, b: B) => Promise<T>
      : F extends (a: infer A, b: infer B, c: infer C) => infer T
        ? (a: A, b: B, c: C) => Promise<T>
        : F extends (a: infer A, b: infer B, c: infer C, d: infer D) => infer T
          ? (a: A, b: B, c: C, d: D) => Promise<T>
          : F extends (a: infer A, b: infer B, c: infer C, d: infer D, e: infer E) => infer T
            ? (a: A, b: B, c: C, d: D, e: E) => Promise<T>
            : Function
