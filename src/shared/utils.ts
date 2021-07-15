export const roughlyDeepCopy = <T = any>(v: T): T => JSON.parse(JSON.stringify(v))

export const idGenerator = () => Math.random().toString(16).slice(2)
