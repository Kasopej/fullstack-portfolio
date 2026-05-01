import type React from 'react'
import { useEffect, useRef } from 'react'
import { Chart, ChartConfiguration } from 'chart.js/auto'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>
  chartProps?: Omit<ChartConfiguration<'bar'>, 'type'>
  className?: string
}
export default function BarChart({ canvasProps, chartProps, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (ref.current) {
      const currentRef = ref.current
      const chart = new Chart(currentRef, {
        type: 'bar',
        ...chartProps,
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })
      return () => {
        if (currentRef) {
          chart.destroy()
        }
      }
    }
  }, [])
  return (
    <div className={`relative w-full h-full min-h-[300px] ${className || ''}`}>
      <canvas {...canvasProps} ref={ref} className="absolute inset-0 w-full h-full"></canvas>
    </div>
  )
}

export function BarChartSkeleton() {
  return (
    <div className="relative w-full h-full min-h-[300px] grid grid-cols-4 items-end justify-center gap-4 p-4">
      <Skeleton className="w-full h-48 rounded-md" />
      <Skeleton className="w-full h-32 rounded-md" />
      <Skeleton className="w-full h-40 rounded-md" />
      <Skeleton className="w-full h-24 rounded-md" />
    </div>
  )
}
