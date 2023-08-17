import React from 'react'
import Link from 'next/link'
import styles from './Button.module.css'

interface RouterButtonsProps {
  style: 'dark' | 'light'
  data: {
    label: string
    pathname: string
  }[]
  className?: string
}

export function RouterButtons({ style, data, className }: RouterButtonsProps): JSX.Element {
  if (data === undefined) {
    return <div>loading...</div>
  }
  return (
    <>
      {data.map((link) => (
        <Link href={link.pathname} key={link.pathname}>
          <a className={`${styles.button} ${className} `} data-style={style}>
            {link.label}
          </a>
        </Link>
      ))}
    </>
  )
}
