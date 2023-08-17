import React from 'react'
import styles from './Description.module.css'

interface DescriptionProps {
  content: string
}

export const Description = ({ content }: DescriptionProps) => {
  return <div className={styles.description}>{content}</div>
}
