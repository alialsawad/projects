import React from 'react'
import styles from './EnglishSentence.module.css'

interface EnglishSentenceProps {
  content: string
}
export const EnglishSentence = ({ content }: EnglishSentenceProps) => {
  return <div className={styles.sentence}>Translation: {content}</div>
}
