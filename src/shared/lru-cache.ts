export default class LruCache<T> extends Map {
  capacity: number
  constructor (capacity: number) {
    super()
    this.capacity = capacity
  }

  get (key: string) {
    if (this.has(key)) {
      const result = super.get(key)
      this.delete(key)
      super.set(key, result)
      return result as T
    }
    return null
  }

  set (key: string, value: T) {
    if (this.has(key)) {
      this.delete(key)
    }
    super.set(key, value)
    if (this.size > this.capacity) {
      const [firstkey] = this.keys().next().value
      this.delete(firstkey)
    }
    return this
  }
}
