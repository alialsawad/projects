import { useCallback, useMemo } from 'react'
// @ts-ignore
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { useEffectAfterMount } from './useEffectAfterMount'

export const useDictaphone = () => {
  const { listening, transcript, resetTranscript } = useSpeechRecognition()

  const start = useCallback((language: string) => {
    SpeechRecognition.startListening({ continuous: true, language: language })
  }, [])

  const stop = useCallback(() => {
    SpeechRecognition.stopListening()
  }, [])

  const reset = useCallback(() => {
    resetTranscript()
  }, [resetTranscript])

  useEffectAfterMount(() => {
    reset()
  }, [listening])

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }
  interface DictaphoneProps {
    listening: boolean
    transcript: string
    start: (language: string) => void
    stop: () => void
    resetTranscript: () => void
  }
  const value: DictaphoneProps = useMemo(
    () => ({ listening, transcript, start, stop, resetTranscript }),
    [listening, transcript, start, stop, resetTranscript]
  )

  return value
}
