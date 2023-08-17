import React from 'react'
import styles from './OuterPageContainer.module.css'

interface OuterContainerProps {
  children: React.ReactNode
}

export function OuterPageContainer({ children }: OuterContainerProps) {
  return <div className={styles.outerPageContainer}>{children}</div>
}
