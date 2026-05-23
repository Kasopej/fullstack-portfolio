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
import PieChart, { type PieChartProps, PieChartSkeleton } from '@/components/Analytics/Charts/PieChart'

const formatOptions: Parameters<typeof formatNumber>[1] = {
  maximumFractionDigits: 4,
  roundingMode: 'ceil',
  dp: 2,
}
export default function Dashboard() {
  const [webVitalsData, setWebVitalsData] = useState<WebVitals>({})
  const [pageViewHistoryFilter, setPageViewHistoryFilter] = useImmer<{
    range: PageViewHistoryFilter
  }>({
    range: 'weekly',
  })
  const [pageViewPerDeviceTypeFilter, setPageViewPerDeviceTypeFilter] = useImmer<{
    range: PageViewHistoryFilter
  }>({
    range: 'monthly',
  })
  const { data: pageViewsHistoricalData, isLoading: isLoadingPageViewsHistoricalData, isFetching: isFetchingPageViewsHistoricalData } = useGetPageViewsHistoricalDataQuery({
    range: pageViewHistoryFilter.range,
  })
  const { data: pageViewsPerDeviceTypeData, isLoading: isLoadingPageViewsPerDeviceType, isFetching: isFetchingPageViewsPerDeviceType } = useGetPageViewsPerDeviceTypeQuery({
    range: pageViewPerDeviceTypeFilter.range,
  })
  const formatLabel = useCallback((date: string) => {
    switch (pageViewHistoryFilter.range) {
      case 'daily':
        return Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(new Date(date))
      case 'weekly':
        return Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(new Date(date))
      case 'monthly':
        return Intl.DateTimeFormat(undefined, { month: 'short' }).format(new Date(date))
      default:
        return date
    }
  }, [pageViewHistoryFilter.range])
  const formatTooltip = useCallback((date: string) => {
    switch (pageViewHistoryFilter.range) {
      case 'daily':
        return new Date(date).toLocaleString()
      case 'weekly':
        return formatLabel(date)
      case 'monthly':
        return formatLabel(date)
      default:
        return date
    }
  }, [pageViewHistoryFilter.range, formatLabel])
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
  const historicalDataIsLoading = isLoadingPageViewsHistoricalData || isFetchingPageViewsHistoricalData
  const pageViewPerDeviceDataIsLoading = isLoadingPageViewsPerDeviceType || isFetchingPageViewsPerDeviceType
  useEffect(() => {
    collectWebVitals((vitals) => {
      setWebVitalsData(vitals)
    })
  }, [pageViewHistoryFilter.range])
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
        <div className="w-full flex flex-col p-6 rounded-xl bg-contrast text-contrast-foreground">
          <span className="w-full gap-2 flex justify-between items-center mb-5">
            <span className="text-base font-semibold">Page Views</span>
            <Tabs
              defaultValue={pageViewHistoryFilter.range}
              onValueChange={value => setPageViewHistoryFilter({
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
            historicalDataIsLoading ? <BarChartSkeleton className="-mt-10" /> : <BarChart chartProps={pageViewsHistoricalDataChartConfig} />
          }
        </div>
        <div className="w-full flex flex-col items-center p-6 rounded-xl bg-contrast text-contrast-foreground">
          <span className="w-full gap-2 flex flex-col mb-5">
            <span className="text-base font-semibold">Device Breakdown</span>
            <Tabs
              defaultValue={pageViewPerDeviceTypeFilter.range}
              onValueChange={value => setPageViewPerDeviceTypeFilter({
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
            pageViewPerDeviceDataIsLoading ? <PieChartSkeleton className="self-center max-w-[300px]" /> : <PieChart chartProps={pageViewsPerDeviceTypeDataChartConfig} />
          }
        </div>
      </section>
    </main>
  )
}
