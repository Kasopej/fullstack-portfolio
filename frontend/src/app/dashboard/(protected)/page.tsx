'use client'
import StatsCard from '@/components/Analytics/StatsCard'
import { EyeIcon } from 'lucide-react'
import { collectWebVitals, WebVitals, webVitals } from '@/lib/utils/client/web-vitals'
import { formatNumber } from '@/lib/utils/format'
import { useCallback, useEffect, useMemo, useState } from 'react'
import BarChart, { type BarChartProps, BarChartSkeleton } from '@/components/Analytics/Charts/BarChart'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useImmer } from 'use-immer'
import { PageViewHistoryFilter, useGetPageViewsHistoricalDataQuery, useGetPageViewsPerDeviceTypeQuery } from '@/queries/endpoints/analytics.endpoints'
import { parse } from 'date-fns'
import PieChart, { type PieChartProps, PieChartSkeleton } from '@/components/Analytics/Charts/PieChart'

const formatOptions: Parameters<typeof formatNumber>[1] = {
  maximumFractionDigits: 4,
  roundingMode: 'ceil',
  dp: 2,
}
export default function Dashboard() {
  const [webVitalsData, setWebVitalsData] = useState<WebVitals>({})
  const [filter, setFilter] = useImmer<{
    range: PageViewHistoryFilter
  }>({
    range: 'weekly',
  })
  const { data: pageViewsHistoricalData, isLoading: isLoadingPageViewsHistoricalData, isFetching: isFetchingPageViewsHistoricalData } = useGetPageViewsHistoricalDataQuery({
    range: filter.range,
  })
  const { data: pageViewsPerDeviceTypeData, isLoading: isLoadingPageViewsPerDeviceType, isFetching: isFetchingPageViewsPerDeviceType } = useGetPageViewsPerDeviceTypeQuery({
    range: 'monthly',
  })
  const formatLabel = useCallback((date: string) => {
    switch (filter.range) {
      case 'daily':
        return Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(new Date(date))
      case 'weekly':
        return Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(new Date(date))
      case 'monthly':
        return Intl.DateTimeFormat(undefined, { month: 'short' }).format(new Date(date))
      default:
        return date
    }
  }, [filter.range])
  const formatTooltip = useCallback((date: string) => {
    switch (filter.range) {
      case 'daily':
        return new Date(date).toLocaleString()
      case 'weekly':
        return formatLabel(date)
      case 'monthly':
        return formatLabel(date)
      default:
        return date
    }
  }, [filter.range, formatLabel])
  const pageViewsHistoricalDataChartConfig = useMemo<BarChartProps>(() => {
    return {
      data: {
        labels: pageViewsHistoricalData?.map(data => formatLabel(data[0])) || [],
        datasets: [
          {
            label: 'Sessions',
            data: pageViewsHistoricalData?.map(data => data[1]) || [],
          },
        ],
      },
      options: {
        scales: {
          y: {
            suggestedMax: 5,
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (context) => {
                return formatTooltip(pageViewsHistoricalData?.[context[0].dataIndex]?.[0] || '')
              },
            },
          },
        },
      },
    }
  }, [pageViewsHistoricalData, formatLabel, formatTooltip])
  const pageViewsPerDeviceTypeDataChartConfig = useMemo<PieChartProps>(() => {
    const total = pageViewsPerDeviceTypeData?.reduce((acc, data) => acc + data[1], 0) || 0
    return {
      data: {
        labels: pageViewsPerDeviceTypeData?.map(data => `${data[0]} (${Math.round((data[1] / total) * 100)}%)`) || [],
        datasets: [
          {
            label: 'Sessions',
            data: pageViewsPerDeviceTypeData?.map(data => data[1]) || [],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              boxHeight: 12,
              boxWidth: 12,
              // generateLabels(chart) {
              //   return chart.data.labels?.map((label, index) => ({
              //     text: label as string,
              //     index,
              //   })) || []
              // },
            },
          },
        },
      },
    }
  }, [pageViewsPerDeviceTypeData])
  const isLoading = isLoadingPageViewsHistoricalData || isFetchingPageViewsHistoricalData || isLoadingPageViewsPerDeviceType || isFetchingPageViewsPerDeviceType
  useEffect(() => {
    collectWebVitals((vitals) => {
      setWebVitalsData(vitals)
    })
  }, [filter.range])
  if (Object.entries(webVitalsData).length === 0) {
    return null
  }
  return (
    <main className="w-full overflow-auto">
      <section className="w-full flex max-lg:flex-wrap gap-6">
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
          <span className="w-full gap-2 flex justify-between items-center mb-5">
            <span className="text-base font-semibold">Page Views</span>
            <Tabs
              defaultValue={filter.range}
              onValueChange={value => setFilter({
                range: value as PageViewHistoryFilter,
              })}
            >
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </span>
          {
            isLoading ? <BarChartSkeleton /> : <BarChart chartProps={pageViewsHistoricalDataChartConfig} />
          }
        </div>
        <div className="w-full p-6 rounded-xl bg-contrast text-contrast-foreground">
          <span className="text-base font-semibold">Device Breakdown</span>
          {
            isLoading ? <PieChartSkeleton /> : <PieChart chartProps={pageViewsPerDeviceTypeDataChartConfig} />
          }
        </div>
      </section>
    </main>
  )
}
