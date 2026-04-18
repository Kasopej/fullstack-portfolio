'use client'
import StatsCard from '@/components/Analytics/StatsCard'
import { EyeIcon } from 'lucide-react'
import { collectWebVitals, WebVitals, webVitals } from '@/lib/utils/client/web-vitals'
import { formatNumber } from '@/lib/utils/format'
import { useEffect, useState } from 'react'

const formatOptions: Intl.NumberFormatOptions = {
  maximumFractionDigits: 2,
  maximumSignificantDigits: 3,
}
export default function Dashboard() {
  const [webVitalsData, setWebVitalsData] = useState<WebVitals>({})
  useEffect(() => {
    collectWebVitals((vitals) => {
      setWebVitalsData(vitals)
    })
  }, [])
  return (
    <main className="w-full overflow-auto">
      <section className="flex max-md:flex-wrap gap-6">
        <StatsCard title="FCP" icon={<EyeIcon className="size-4" />}>
          <p className="text-[28px] font-bold">{webVitalsData.fcp ? `${formatNumber(webVitalsData.fcp, formatOptions)}ms` : 'N/A'}</p>
        </StatsCard>
        <StatsCard title="LCP" icon={<EyeIcon className="size-4" />}>
          <p className="text-[28px] font-bold">{webVitals.lcp ? `${formatNumber(webVitals.lcp, formatOptions)}ms` : 'N/A'}</p>
        </StatsCard>
        <StatsCard title="TTFB" icon={<EyeIcon className="size-4" />}>
          <p className="text-[28px] font-bold">{webVitals.ttfb ? `${formatNumber(webVitals.ttfb, formatOptions)}ms` : 'N/A'}</p>
        </StatsCard>
        <StatsCard title="CLS" icon={<EyeIcon className="size-4" />}>
          <p className="text-[28px] font-bold">{webVitals.cls ? `${formatNumber(webVitals.cls, formatOptions)}` : 'N/A'}</p>
        </StatsCard>
      </section>
    </main>
  )
}
