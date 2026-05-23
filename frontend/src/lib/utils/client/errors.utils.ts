import { HTTPError } from '@/lib/http/http.client'
import { toast } from 'sonner'
import { manualAbortError } from '@/constants'

export function notifyError(error: unknown, { fallback = 'Unknown error' }: { fallback?: string } = {}) {
  if (error instanceof HTTPError) {
    if (error.body?.message === manualAbortError) {
      return
    }
    toast.error(error.body?.message ?? fallback)
    return
  }
  toast.error(fallback)
}
