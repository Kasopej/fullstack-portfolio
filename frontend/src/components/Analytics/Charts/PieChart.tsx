import type React from 'react'
import { useEffect, useRef } from 'react'
import { Chart, ChartConfiguration } from 'chart.js/auto'
import { Skeleton } from '@/components/ui/skeleton'
import merge from 'lodash-es/merge'

export type PieChartProps = Omit<ChartConfiguration<'pie'>, 'type'>
type Props = {
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>
  chartProps?: PieChartProps
  className?: string
}
export default function PieChart({ canvasProps, chartProps, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (ref.current) {
      const currentRef = ref.current
      const chart = new Chart(currentRef, merge<ChartConfiguration<'pie'>, PieChartProps | undefined>({
        type: 'pie',
        data: { labels: [], datasets: [] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
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

export function PieChartSkeleton() {
  return (
    <Skeleton className="w-full h-48 rounded-full" />
  )
}
