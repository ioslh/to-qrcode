export const roughlyDeepCopy = <T = any>(v: T): T => JSON.parse(JSON.stringify(v))

export const idGenerator = () => Math.random().toString(16).slice(2)

export const race = <T>(p: Promise<T>, seconds: number, id?: string): Promise<T> => {
  return Promise.race([p, new Promise<never>((_, reject) => {
    setTimeout(() => reject(`Promise ${id || '' } timeout after ${seconds}s`), seconds * 1000)
  })])
}