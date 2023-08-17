import React from 'react'
import { Description } from './Description'
import { Title } from './Title'
import styles from './Header.module.css'
import { Logo } from 'components/Logo'

interface HeaderProps {
  title: string
}
export const Header = ({ title }: HeaderProps) => {
  return (
    <div className={styles.header}>
      <Title content={title} />
      <Logo />
    </div>
  )
}
