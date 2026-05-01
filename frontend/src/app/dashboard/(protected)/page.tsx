'use client'
import StatsCard from '@/components/Analytics/StatsCard'
import { EyeIcon } from 'lucide-react'
import { collectWebVitals, WebVitals, webVitals } from '@/lib/utils/client/web-vitals'
import { formatNumber } from '@/lib/utils/format'
import { useEffect, useState } from 'react'
import { httpClient } from '@/lib/http/http.client'
import BarChart, { BarChartSkeleton } from '@/components/Analytics/Charts/BarChart'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WebAnalyticsData } from '@/types/session-tracking.types'
import { useImmer } from 'use-immer'
import { notifyError } from '@/lib/utils/client/errors.utils'

const formatOptions: Intl.NumberFormatOptions = {
  maximumFractionDigits: 2,
  maximumSignificantDigits: 3,
}
export default function Dashboard() {
  const [webVitalsData, setWebVitalsData] = useState<WebVitals>({})
  const [webAnalyticsData, setWebAnalyticsData] = useState<WebAnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useImmer<{
    range: 'daily' | 'weekly' | 'monthly'
  }>({
    range: 'daily',
  })
  useEffect(() => {
    collectWebVitals((vitals) => {
      setWebVitalsData(vitals)
    })
    setLoading(true)
    httpClient.request<WebAnalyticsData>('/analytics/sessions-historical-data', {
      params: {
        days: filter.range === 'daily' ? '1' : filter.range === 'weekly' ? '7' : '30',
      },
    }).then((response) => {
      setWebAnalyticsData(response.data)
    }).catch((err) => {
      notifyError(err)
    }).finally(() => {
      setLoading(false)
    })
  }, [filter.range])
  return (
    <main className="w-full overflow-auto">
      <section className="w-full flex max-md:flex-wrap gap-6">
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
      <section className="w-full grid grid-cols-[2fr_1fr] gap-6 items-start mt-6">
        <div className="w-full p-6 rounded-xl bg-contrast text-contrast-foreground">
          <p className="w-full gap-2 flex justify-between items-center mb-5">
            <span className="text-lg font-semibold">Page Views</span>
            <Tabs>
              <TabsList>
                <TabsTrigger value="page-views">Page Views</TabsTrigger>
                <TabsTrigger value="unique-visitors">Unique Visitors</TabsTrigger>
              </TabsList>
            </Tabs>
          </p>
          {
            loading ? <BarChartSkeleton /> : <BarChart />
          }
        </div>
        <div className="w-full p-6 rounded-xl bg-contrast text-contrast-foreground">
          <span className="text-lg font-semibold">Device Breakdown</span>
        </div>
      </section>
    </main>
  )
}
