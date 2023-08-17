import { Icon } from 'components/Icon'
import React, { useRef, useState } from 'react'
import styles from './SentenceDisplay.module.css'
import dynamic from 'next/dynamic'

const TTS = dynamic(() => import('components/TTS'), {
  ssr: false
})
export const SentenceDisplay = ({ content, voice, uniqueIds, romanized, translate, split }: any) => {
  const previousWord = useRef<string>('')
  const showRoma = (event: Event) => {
    if (event.target instanceof HTMLElement) {
      const id = event.target.id
      const index = uniqueIds.indexOf(id)
      if (index !== -1) {
        event.target.innerText = romanized[index]
      }
    }
  }
  const hideRoma = (event: Event) => {
    if (event.target instanceof HTMLElement) {
      const id = event.target.id
      const index = uniqueIds.indexOf(id)
      if (index !== -1) {
        event.target.innerText = content[index]
      }
    }
  }
  return (
    <div className={styles.mainWrapper}>
      {content.map((word: string, index: number) => {
        return (
          <div className={styles.sentenceWrapper} key={uniqueIds[index]}>
            <TTS
              className={styles.word}
              id={uniqueIds[index]}
              text={word}
              type={'word'}
              voice={voice}
              element="span"
              data-roma={romanized[index]}
              data-word={word}
              onMouseOver={showRoma}
              onMouseOut={hideRoma}>
              {word}
            </TTS>

            {split[word] && word !== ',' && (
              <Icon
                icon="translation"
                className={`${styles.translator} ${word} ${styles.translation}`}
                onClick={() => {
                  translate(split[word])
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
