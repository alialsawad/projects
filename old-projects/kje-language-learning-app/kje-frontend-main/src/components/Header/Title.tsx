import React from 'react'
import styles from './Title.module.css'
interface TitleProps {
  content: string
}
export const Title = ({ content }: TitleProps) => {
  return <h1 className={styles.skew}>{content}</h1>
}
