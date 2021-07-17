import { isUndef } from '@/shared/utils'

export default {
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get<T = any>(key: string, defaultValue?: T) {
    const value = localStorage.getItem(key)
    if (!value) return isUndef(defaultValue) ? null : defaultValue
    try {
      return JSON.parse(value) as T
    } catch (e) {
      return isUndef(defaultValue) ? null : defaultValue
    }
  }
}