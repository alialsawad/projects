import React from 'react'
import styles from './InnerPageContainer.module.css'

interface InnerPageContainerProps {
  children: React.ReactNode
}

export const InnerPageContainer = ({ children }: InnerPageContainerProps) => {
  return <div className={styles.innerPageContainer}>{children}</div>
}
