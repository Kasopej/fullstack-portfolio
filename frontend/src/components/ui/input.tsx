import * as React from 'react'
import { cn } from '@/lib/utils/css.utils'

function Input({
  className,
  type,
  prefixEl,
  suffix,
  suffixClickable,
  wrapperClass,
  ...props
}: React.ComponentProps<'input'> & { suffix?: React.ReactNode, prefixEl?: React.ReactNode, suffixClickable?: boolean, wrapperClass?: string }) {
  return (
    <div className={cn('relative flex w-full max-w-full', wrapperClass)}>
      {prefixEl && (
        <div className={cn('absolute left-3 top-0 h-full flex items-center justify-center text-muted-foreground', suffixClickable ? 'cursor-pointer' : 'pointer-events-none')}>
          {prefixEl}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-white dark:bg-input/30 border-input flex h-9 w-full min-w-0 grow rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:typography-2 file:font-medium disabled:cursor-not-allowed disabled:bg-light-background read-only:pointer-events-none read-only:bg-light-background md:typography-2',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive group-inert/fieldset:cursor-not-allowed group-inert/fieldset:bg-light-background',
          className,
          prefixEl ? 'pl-9' : '',
        )}
        {...props}
      />
      {suffix && (
        <div className={cn('absolute right-3 top-0 h-full flex items-center justify-center', suffixClickable ? 'cursor-pointer' : 'pointer-events-none')}>
          {suffix}
        </div>
      )}
    </div>
  )
}

export { Input }
