import clsx from 'clsx'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

type Props = {
  className?: string
  title?: string
  icon?: React.ReactNode
  children?: React.ReactNode
}
export default function StatsCard({ className, title, icon, children }: Props) {
  return (
    <Card className={clsx('w-[260px] min-w-[200px] shrink gap-2', className)}>
      <CardHeader className="px-6">
        <CardTitle className="text-muted-foreground">
          <span className="flex items-center justify-between">
            {title}
            <i>{icon}</i>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        {children}
      </CardContent>
    </Card>
  )
}
