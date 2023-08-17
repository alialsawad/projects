/* eslint-disable react/display-name */
import { forwardRef, LegacyRef, useId } from 'react'
import { classes } from 'utils/style'
import styles from './Monogram.module.css'

const PATH = `M 9.9 70.1 L 9.9 67.1 L 46.7 67.1 L 25.5 8.8 L 3.2 70.1 L 0 70.1 L 25.5 0 L 51 70.1 L 9.9 70.1 Z`

interface MonogramProps {
  [key: string]: any
  className?: string
  highlight?: boolean
}

export const Monogram = forwardRef(({ highlight, className = '', ...props }: MonogramProps, ref) => {
  const id = useId()
  const clipId = `${id}monogram-clip`

  return (
    <svg
      aria-hidden
      className={classes(styles.monogram, className)}
      width="56"
      height="39"
      ref={ref as LegacyRef<SVGSVGElement>}
      viewBox="-5 0 61.2 71.2"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <defs>
        <clipPath id={clipId}>
          <path d={PATH} />
        </clipPath>
      </defs>
      <rect clipPath={`url(#${clipId})`} width="100%" height="100%" />
      {highlight && (
        <g clipPath={`url(#${clipId})`}>
          <rect className={styles.highlight} width="100%" height="100%" />
        </g>
      )}
    </svg>
  )
})
