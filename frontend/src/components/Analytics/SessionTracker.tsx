'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js/dist/module.slim'

export default function SessionTracker({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
      api_host: 'https://eu.i.posthog.com',
      capture_pageview: 'history_change',
      defaults: '2026-01-30',
    })
    // if (isDevMode) mixpanel.opt_out_tracking()
  }, [])
  return children
}
