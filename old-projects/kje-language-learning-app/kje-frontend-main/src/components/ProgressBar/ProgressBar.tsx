import { useEffectAfterMount } from 'hooks'
import React, { useState } from 'react'
import styles from './ProgressBar.module.css'

export const ProgressBar = ({ current, total, toPage }: any) => {
  const [input, setInput] = useState(current)

  const handleInput = (e: any) => {
    setInput(e.target.value)
  }

  const getPage = (e: any) => {
    if (input > total || input < 1) return
    if (e.key === 'Enter') {
      toPage(input)
    }
  }

  useEffectAfterMount(() => {
    setInput(current)
  }, [current])

  return (
    <div className={styles.wrapper}>
      <div className={styles.background}>
        <div className={styles.foreground} style={{ width: `${(current / total) * 100}%` }}></div>
      </div>
      <input type="number" className={styles.slider} onChange={(e) => handleInput(e)} value={input} onKeyDown={(e) => getPage(e)} />/{total}
    </div>
  )
}
