import React from 'react'
// @ts-ignore
import { useSpeechSynthesis } from 'react-recipes'
import { concatClasses } from 'utils/css'
import styles from './TTS.module.css'

interface TTSProps {
  text: string | string[]
  type: string
  voice: number
  element?: string
  className?: string
  id?: string
  onMouseOver?: (event: Event) => void
  onMouseOut?: (event: Event) => void
  children?: React.ReactNode
}

export default function TTS({ text, voice, children, className = '', type, element, ...otherProps }: TTSProps) {
  const { speak, voices } = useSpeechSynthesis()
  const Element: any = element || ('button' as any)
  const speakText = (modifiedText: string | string[], chosenVoice: number) => {
    speak({ text: modifiedText, voice: chosenVoice })
  }

  const getSelectedText = () => {
    let selectedText = window.getSelection()?.toString()
    if (selectedText) {
      selectedText = selectedText.replace(/\s+/g, '')
      speakText(selectedText, voices[voice])
    }
  }

  const speechHandler = () => {
    switch (type) {
      case 'word':
        speakText((text as string).split('[')[0], voices[voice])
        break
      case 'connected':
        speakText((text as string[]).join(''), voices[voice])
        break
      case 'split':
        speakText(text, voices[voice])
        break
      case 'selected':
        getSelectedText()
        break
      default:
        speakText(text, voices[voice])
    }
  }

  return (
    <Element
      onClick={speechHandler}
      className={concatClasses(styles.TTS, className, (Element === 'button' && styles.button) as string)}
      {...otherProps}>
      {children}
    </Element>
  )
}
