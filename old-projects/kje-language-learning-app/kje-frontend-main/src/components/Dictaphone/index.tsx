import React, { useCallback, useRef, useState } from 'react'
import { useDictaphone, useEffectAfterMount } from 'hooks'
import { Icon } from 'components/Icon'
import styles from './Dictaphone.module.css'

const LANGUAGES = {
  10: 'ja-JP',
  11: 'ko-KR'
}

interface DictaphoneProps {
  transcriptHandler: (transcript: string) => void
  reset: any
  uniqueIds: string[]
  language: 10 | 11
  showTranscript: () => void
  hideTranscript: () => void
}

export default function Dictaphone({ transcriptHandler, reset, uniqueIds, language, showTranscript, hideTranscript }: DictaphoneProps) {
  const { listening, transcript, start, stop, resetTranscript }: any = useDictaphone()
  const [recording, setRecording] = useState(false)
  const previousTranscript = useRef<string>('')

  useEffectAfterMount(() => {
    if (listening && recording) {
      transcriptHandler(transcript.replace(/\s+/g, ''))
      if (transcript !== previousTranscript.current) {
        previousTranscript.current = transcript
        setTimeout(() => {
          transcriptHandler(transcript.replace(/\s+/g, ''))
        }, 200)
      }
    }
  }, [transcript, listening, transcriptHandler, stop, start])

  const startRecording = useCallback(() => {
    showTranscript()
    resetTranscript()
    setRecording(true)
    start(LANGUAGES[language])
  }, [language, showTranscript, start])

  const stopRecording = useCallback(() => {
    setRecording(false)
    stop()
    hideTranscript()
  }, [stop, hideTranscript])

  if (!start || !stop) {
    return null
  }

  return (
    <div className={styles.dictaphoneWrapper}>
      <Icon
        icon="speak"
        onClick={startRecording}
        onTouchStart={startRecording}
        onMouseDown={startRecording}
        onTouchEnd={stopRecording}
        onMouseUp={stopRecording}
        onMouseLeave={stopRecording}
        onTouchCancel={stopRecording}
        className={`${listening && recording && styles.listening} ${styles.mic} ${styles.icon}`}
      />

      <Icon icon="reset" className={`${styles.reset} ${styles.icon}`} onClick={() => reset(uniqueIds, resetTranscript)} />
    </div>
  )
}
