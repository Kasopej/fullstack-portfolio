import { cn } from "@/lib/utils/css.utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted-foreground", className)}
      {...props}
    />
  );
}

export { Skeleton }
