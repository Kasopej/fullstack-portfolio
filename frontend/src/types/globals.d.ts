import { AppStore } from '@/store'

declare global {
  interface Window {
    store?: AppStore
  }
}
