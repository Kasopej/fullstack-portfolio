export type WebVitals = {
  fcp?: number
  lcp?: number
  ttfb?: number
  cls?: number
}

const webVitals: WebVitals = {}
export function collectWebVitals(
  callback?: (webVitals: WebVitals) => void,
) {
  // --- TTFB (Navigation Timing) ---
  const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

  if (navEntry) {
    webVitals.ttfb = navEntry.responseStart // ms
  }

  // --- FCP (Paint Timing) ---
  try {
    const paintObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          webVitals.fcp = entry.startTime
          callback?.({ ...webVitals })
        }
      }
    })

    paintObserver.observe({ type: 'paint', buffered: true })
  }
  catch (e) {
    // Safari fallback (older versions)
    const paints = performance.getEntriesByType('paint')
    const fcpEntry = paints.find(p => p.name === 'first-contentful-paint')
    if (fcpEntry) {
      webVitals.fcp = fcpEntry.startTime
    }
  }

  // --- LCP (Largest Contentful Paint) ---
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]

      if (lastEntry) {
        webVitals.lcp = lastEntry.startTime
        callback?.({ ...webVitals })
      }
    })

    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

    // Stop observing after page is hidden (recommended)
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        lcpObserver.disconnect()
        callback?.({ ...webVitals })
      }
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
  }
  catch (e) {
    // LCP not supported
  }

  // --- CLS ---
  try {
    let clsValue = 0

    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as (PerformanceEntry & { hadRecentInput: boolean, value: number })[]) {
        // Ignore layout shifts triggered by user input
        if (!entry.hadRecentInput) {
          clsValue += (entry.value || 0)
        }
      }

      webVitals.cls = clsValue
      callback?.({ ...webVitals })
    })

    clsObserver.observe({ type: 'layout-shift', buffered: true })

    // Finalize CLS when page is hidden
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        clsObserver.disconnect()
        callback?.({ ...webVitals })
      }
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
  }
  catch {}

  callback?.({ ...webVitals })
}

collectWebVitals()
export { webVitals }
