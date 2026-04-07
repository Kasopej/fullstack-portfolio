import React from 'react'
import clsx from 'clsx'

type SlotProps = {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLElement>

export function Slot({ children, ...props }: SlotProps) {
  if (!React.isValidElement(children)) return null

  const childProps = children.props as Record<string, unknown>

  const mergedProps = {
    ...props,
    ...childProps,
  }

  // Merge className
  if (props.className || childProps.className) {
    mergedProps.className = clsx(props.className, childProps.className as string)
  }

  // Merge event handlers
  for (const key in props) {
    if (
      key.startsWith('on')
      && typeof props[key as keyof typeof props] === 'function'
    ) {
      mergedProps[key as keyof typeof mergedProps] = composeEventHandlers(
        childProps[key as keyof typeof childProps] as (...args: unknown[]) => void,
        props[key as keyof typeof props],
      )
    }
  }

  return React.cloneElement(children, mergedProps)
}

function composeEventHandlers(
  theirHandler?: (...args: unknown[]) => void,
  ourHandler?: (...args: unknown[]) => void,
) {
  return (...args: unknown[]) => {
    theirHandler?.(...args)
    ourHandler?.(...args)
  }
}
