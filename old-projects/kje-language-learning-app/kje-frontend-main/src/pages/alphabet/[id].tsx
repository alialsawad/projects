import React from 'react'
import uuid from 'react-uuid'
import styles from './Alphabet.module.css'

import dynamic from 'next/dynamic'

const TTS = dynamic(() => import('components/TTS'), {
  ssr: false
})

interface PATHNAME {
  [key: string]: string
}

const PATHNAME: PATHNAME = {
  hangul: 'alphabet/hangul',
  hiragana: 'alphabet/hiragana',
  katakana: 'alphabet/katakana'
}
interface VOICES {
  [key: string]: number
}
const VOICES: VOICES = {
  hiragana: 10,
  katakana: 10,
  hangul: 11
}

const Alphabet = ({ lesson }: any) => {
  const showRoma = (event: Event) => {
    if (event.target instanceof HTMLElement) {
      const text = event.target.dataset.roma
      if (text) {
        event.target.innerText = text
      }
    }
  }

  const hideRoma = (event: Event) => {
    if (event.target instanceof HTMLElement) {
      const text = event.target.dataset.word
      if (text) {
        event.target.innerText = text
      }
    }
  }
  if (lesson.length === 0) {
    return <div>Loading...</div>
  }
  return (
    <div className={styles.alphabet}>
      {lesson.alphabet.map((item: { [key: string]: string }) => (
        <>
          <TTS
            key={uuid()}
            className={styles.alphabet__item}
            element="span"
            text={item.letter}
            type={'word'}
            voice={10}
            data-roma={item.pronunciation}
            data-word={item.letter}
            onMouseOver={showRoma}
            onMouseOut={hideRoma}>
            {item.letter}
          </TTS>
        </>
      ))}
    </div>
  )
}

export default Alphabet

export const getStaticPaths = async () => {
  const paths = [{ params: { id: 'hiragana' } }, { params: { id: 'katakana' } }, { params: { id: 'hangul' } }]

  return { paths, fallback: false }
}

export const getStaticProps = async ({ params }: any) => {
  const { id } = params
  const lesson = await fetch(`http://127.0.0.1:8000/api/alphabet/${id}?format=json`).then((res) => res.json())

  return {
    props: {
      lesson
    }
  }
}
