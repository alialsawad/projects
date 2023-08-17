import { useHighlighter, useSolutionManager } from 'hooks'
import { useCallback, useRef, useState } from 'react'
import { SentenceDisplay } from './SentenceDisplay'
import { sharedHandler } from './TranscriptHandler'
import styles from './Sentence.module.css'
import { Icon } from 'components/Icon'

import dynamic from 'next/dynamic'

const TTS = dynamic(() => import('components/TTS'), {
  ssr: false
})
const Dictaphone = dynamic(() => import('components/Dictaphone'), {
  ssr: false
})

interface SentenceProps {
  content: string[]
  uniqueIds: string[]
  romanized: string[]
  voice: number
  split: string[]
}

export const Sentence = ({ content, uniqueIds, romanized, voice, split }: SentenceProps) => {
  const { validateAndHighlight, reset } = useSolutionManager()
  const { highlightByClassNameList, removeHighlightByClassNameList } = useHighlighter()
  const [translation, setTranslation] = useState({
    context: '',
    translation: ''
  })
  const previousContext = useRef<string[]>([])
  const transcriptDisplay = useRef<HTMLDivElement | null>(null)

  const transcriptHandler = useCallback(
    (transcript: string) => {
      sharedHandler(transcript, validateAndHighlight, content, uniqueIds)
      if (transcript.length && transcriptDisplay.current) {
        transcriptDisplay.current = document.getElementById(`${uniqueIds[0]}-transcript`) as HTMLDivElement
        transcriptDisplay.current.innerHTML = transcript
      }
    },
    [validateAndHighlight, content, uniqueIds]
  )
  const showTranscript = useCallback(() => {
    if (transcriptDisplay.current) {
      transcriptDisplay.current.style.display = 'block'
    }
  }, [])

  const hideTranscript = useCallback(() => {
    if (transcriptDisplay.current) {
      transcriptDisplay.current.style.display = 'none'
    }
  }, [])

  const translationHandler = useCallback(
    async (context: string[]) => {
      if (previousContext.current.length !== 0) {
        removeHighlightByClassNameList(previousContext.current)
      }

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: context.join(''),
          from: voice === 10 ? 'ja' : 'ko'
        })
      })
      const data = await response.json()
      setTranslation({
        context: context.join(' '),
        translation: data.translation
      })

      highlightByClassNameList(context)
      previousContext.current = context
    },
    [split]
  )

  const handleTranslationPrompt = useCallback(() => {
    if (previousContext.current.length !== 0) {
      removeHighlightByClassNameList(previousContext.current)
    }
    setTranslation({
      context: '',
      translation: ''
    })
  }, [])

  return (
    <div className={styles.wrapper}>
      {translation.translation && (
        <div className={styles.translation}>
          {translation.context}: {translation.translation}
          <Icon
            icon="close"
            onClick={() => {
              handleTranslationPrompt()
            }}
            className={styles.exitTranslation}
          />
        </div>
      )}
      <SentenceDisplay
        content={content}
        voice={voice}
        uniqueIds={uniqueIds}
        romanized={romanized}
        translate={translationHandler}
        split={split}
      />
      <div id={`${uniqueIds[0]}-transcript`} className={styles.transcriptModal} ref={transcriptDisplay}></div>
      <div className={styles.buttons}>
        <Dictaphone
          transcriptHandler={transcriptHandler}
          reset={reset}
          uniqueIds={uniqueIds}
          language={voice as 10 | 11}
          showTranscript={showTranscript}
          hideTranscript={hideTranscript}
        />
        <TTS text={content} type={'connected'} voice={voice}>
          <Icon icon="play" /> Sentence
        </TTS>
        <TTS text={content} type={'split'} voice={voice}>
          <Icon icon="play" /> Split
        </TTS>
        <TTS text={content} type={'selected'} voice={voice}>
          <Icon icon="play" /> Selected
        </TTS>
      </div>
    </div>
  )
}
