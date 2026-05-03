export function formatNumber(num: number, opts?: Intl.NumberFormatOptions & { dp?: number }) {
  const dp = opts?.dp ?? 2
  return new Intl.NumberFormat(undefined, opts).format(isNaN(num) ? 0 : Math.round(num * 10 ** dp) / 10 ** dp)
}
