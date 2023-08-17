import React, { useEffect, useState } from 'react'
import uuid from 'react-uuid'
import styles from './StackSummary.module.css'

interface StackSummaryProps {
  data: { [key: string]: string }[]
}
export const StackSummary = ({ data }: StackSummaryProps) => {
  const [uniqueEntries, setUniqueEntries] = useState<{ [key: string]: string }[]>([])

  useEffect(() => {
    const uniqueEntries = data.filter((item, index, self) => {
      return index === self.findIndex((t) => t.title === item.title)
    })

    setUniqueEntries(uniqueEntries)
  }, [data])
  return (
    <div className={styles.summary_container}>
      {uniqueEntries.map((item: { [key: string]: string }) => (
        <span className={styles.summary} key={uuid()}>
          {item.title}
        </span>
      ))}
    </div>
  )
}
