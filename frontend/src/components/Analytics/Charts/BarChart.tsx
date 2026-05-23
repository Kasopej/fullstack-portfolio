import type React from 'react'
import { useEffect, useRef } from 'react'
import { Chart, ChartConfiguration } from 'chart.js/auto'
import { Skeleton } from '@/components/ui/skeleton'
import merge from 'lodash-es/merge'

export type BarChartProps = Omit<ChartConfiguration<'bar'>, 'type'>
type Props = {
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>
  chartProps?: BarChartProps
  className?: string
}
export default function BarChart({ canvasProps, chartProps, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    Chart.defaults.datasets.bar.maxBarThickness = 40
    if (ref.current) {
      const currentRef = ref.current
      const chart = new Chart(currentRef, merge({
        type: 'bar',
        data: { labels: [], datasets: [] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      }, chartProps))
      return () => {
        if (currentRef) {
          chart.destroy()
        }
      }
    }
  }, [chartProps])
  return (
    <div className={`relative w-full h-full min-h-[300px] ${className || ''}`}>
      <canvas {...canvasProps} ref={ref} className="absolute inset-0 w-full h-full"></canvas>
    </div>
  )
}

export function BarChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={`relative w-full h-full min-h-[300px] grid grid-cols-4 items-end justify-center gap-4 p-4 ${className || ''}`}>
      <Skeleton className="w-full h-48 rounded-md" />
      <Skeleton className="w-full h-32 rounded-md" />
      <Skeleton className="w-full h-40 rounded-md" />
      <Skeleton className="w-full h-24 rounded-md" />
    </div>
  )
}
