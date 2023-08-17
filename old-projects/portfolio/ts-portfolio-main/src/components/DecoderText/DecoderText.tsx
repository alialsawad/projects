/* eslint-disable react/display-name */
import { VisuallyHidden } from 'components/VisuallyHidden'
import { useReducedMotion, useSpring } from 'framer-motion'
import { memo, useEffect, useRef } from 'react'
import { delay } from 'utils/delay'
import { classes } from 'utils/style'
import styles from './DecoderText.module.css'

// prettier-ignore
const glyphs = [
  '!','<','>',
  '-',
  '\\'
  ,'/'
  ,'['
  ,']'
  ,'{'
  ,'}'
  ,'—'
  ,'='
  ,'+'
  ,'*'
  ,'^',
  '?',
  '#'
  ,
  '_',
0, 1, 2, 3, 4, 5, 6, 7, 8, 9
];

const CharType = {
  Glyph: 'glyph',
  Value: 'value'
}
interface Shuffle {
  (content: string[], output: { type: string; value: string }[], position: number): any
}
const shuffle: Shuffle = (content, output, position) => {
  return content.map((value, index) => {
    if (index < position) {
      return { type: CharType.Value, value }
    }

    if (position % 1 < 0.5) {
      const rand = Math.floor(Math.random() * glyphs.length)
      return { type: CharType.Glyph, value: glyphs[rand] }
    }

    return { type: CharType.Glyph, value: output[index].value }
  })
}

interface DecoderTextProps {
  [key: string]: any
  text: string
  start?: boolean
  delay?: number
  className?: string
}
export const DecoderText = memo(({ text, start = true, delay: startDelay = 0, className = '', ...rest }: DecoderTextProps) => {
  const output = useRef([{ type: CharType.Glyph, value: '' }])
  const container = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const decoderSpring = useSpring(0, { stiffness: 8, damping: 5 })

  useEffect(() => {
    const containerInstance = container.current
    const content = text.split('')
    let animation

    const renderOutput = () => {
      const characterMap = output.current.map((item) => {
        return `<span class="${styles[item.type]}">${item.value}</span>`
      })
      if (containerInstance) {
        containerInstance.innerHTML = characterMap.join('')
      }
    }

    const unsubscribeSpring = decoderSpring.onChange((value) => {
      output.current = shuffle(content, output.current, value)
      renderOutput()
    })

    const startSpring = async () => {
      await delay(startDelay)
      decoderSpring.set(content.length)
    }

    if (start && !animation && !reduceMotion) {
      startSpring()
    }

    if (reduceMotion) {
      output.current = content.map((_value, index) => ({
        type: CharType.Value,
        value: content[index]
      }))
      renderOutput()
    }

    return () => {
      unsubscribeSpring?.()
    }
  }, [decoderSpring, reduceMotion, start, startDelay, text])

  return (
    <span className={classes(styles.text, className)} {...rest}>
      <VisuallyHidden className={styles.label}>{text}</VisuallyHidden>
      <span aria-hidden className={styles.content} ref={container} />
    </span>
  )
})
