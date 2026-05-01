import { HTTPError } from '@/lib/http/http.client'
import { toast } from 'sonner'
import { duplicateRequestError } from '@/constants'

export function notifyError(error: unknown, { fallback = 'Unknown error' }: { fallback?: string } = {}) {
  if (error instanceof HTTPError) {
    if (typeof error.body === 'string' && error.body === duplicateRequestError) {
      return
    }
    toast.error(error.body ? String(error.body) : fallback)
    return
  }
  toast.error(fallback)
}
