'use client'

import { useEffect } from 'react'
import mixpanel from 'mixpanel-browser'
import { isDevMode } from '@/constants'

export default function SessionTracker({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!, {
      api_host: 'https://api-eu.mixpanel.com',
      autocapture: {
        pageview: 'full-url',
        click: true,
        dead_click: false,
        rage_click: true,
        scroll: true,
        submit: false,
      },
      track_pageview: true,
      record_sessions_percent: 10,
    })
    if (isDevMode) mixpanel.opt_out_tracking()
  }, [])
  return children
}
