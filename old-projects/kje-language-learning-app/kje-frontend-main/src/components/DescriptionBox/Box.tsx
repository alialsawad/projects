import { Icon } from 'components/Icon'
import React from 'react'
import styles from './Box.module.css'

interface BoxProps {
  icon: React.ReactNode

  description: string
}

export const Box = ({ icon, description }: BoxProps) => {
  return (
    <div className={styles.box}>
      <Icon className={styles.icon} icon={icon} />
      <span className={styles.description}>{description}</span>
    </div>
  )
}
