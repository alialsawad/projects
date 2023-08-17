import React from 'react'
import styles from './LogoWrapper.module.css'

interface LogoWrapperProps {
  children: React.ReactNode
}
export const LogoWrapper = ({ children }: LogoWrapperProps) => {
  return <span className={styles.wrapper}>{children}</span>
}
