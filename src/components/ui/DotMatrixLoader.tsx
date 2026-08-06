import { DotmSquare4, type DotmSquare4Props } from '@/components/ui/dotm-square-4'

type DotMatrixLoaderProps = DotmSquare4Props & {
  loader?: string
  className?: string
}

const DEFAULTS: DotmSquare4Props = {
  size: 49,
  dotSize: 6,
  speed: 1.25,
  color: '#BACBC9',
  pattern: 'full',
  dotShape: 'circle',
  animated: true,
  bloom: true,
  opacityBase: 0.12,
  opacityMid: 0.42,
  opacityPeak: 1,
  ariaLabel: 'Loading',
}

/**
 * ReadyGo DotMatrix loader wrapper.
 * Defaults to the Twin Orbit (`dotm-square-4`) loader used on Open-Screen.
 */
export function DotMatrixLoader({
  loader = 'dotm-square-4',
  className,
  ...props
}: DotMatrixLoaderProps = {}) {
  const merged = { ...DEFAULTS, ...props }

  if (loader !== 'dotm-square-4') {
    console.warn(
      `[DotMatrixLoader] Unsupported loader "${loader}". Falling back to dotm-square-4.`,
    )
  }

  return <DotmSquare4 className={className} {...merged} />
}
