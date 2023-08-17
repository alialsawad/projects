import React from 'react'
import styles from './NavContainer.module.css'

interface NavContainerProps {
  children: React.ReactNode
}

function NavContainer({ children }: NavContainerProps) {
  return <nav className={styles.navContainer}>{children}</nav>
}

export default NavContainer
