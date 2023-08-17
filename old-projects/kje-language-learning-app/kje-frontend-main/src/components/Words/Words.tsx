import React from 'react'
import styles from './Words.module.css'
import dynamic from 'next/dynamic'

const TTS = dynamic(() => import('components/TTS'), {
  ssr: false
})
interface WordsProps {
  english: string
  korean?: string
  japanese: string
}
export const Words = ({ english, japanese, korean }: WordsProps) => {
  return (
    <div className={styles.wrapper}>
      <TTS text={japanese} element={'span'} voice={10} type={'word'}>
        {japanese}
      </TTS>
      {korean && (
        <TTS text={korean} element={'span'} voice={11} type={'word'}>
          {korean}
        </TTS>
      )}
      <span className={styles.word}>{english}</span>
    </div>
  )
}
