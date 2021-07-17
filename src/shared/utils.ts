export const roughlyDeepCopy = <T = any>(v: T): T => JSON.parse(JSON.stringify(v))

export const idGenerator = () => Math.random().toString(16).slice(2)

export const race = <T>(p: Promise<T>, seconds: number, id?: string): Promise<T> => {
  return Promise.race([p, new Promise<never>((_, reject) => {
    setTimeout(() => reject(`Promise ${id || '' } timeout after ${seconds}s`), seconds * 1000)
  })])
}

export const isFunc = (v: any): v is Function => typeof v === 'function'

export const isUndef = (v: any): v is void => typeof v === 'undefined'

export const NOOP = () => {}

export const isThenable = <T = any>(v: any): v is Promise<T> => (typeof v === 'object') && ('then' in v) && isFunc(v.then)

export const utoa = (data: string): string => {
  return btoa(unescape(encodeURIComponent(data)))
}

export const atou = (base64: string): string => {
  return decodeURIComponent(escape(atob(base64)))
}