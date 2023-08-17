import { EnglishSentence, Sentence } from 'components/Sentences'
import { Words } from 'components/Words'

import uuid from 'react-uuid'
import React from 'react'
import styles from './Lesson.module.css'

const LessonContainer = ({ lesson, id }: any) => {
  return (
    <>
      <div className={styles.wrapper}>
        {id !== 'j6k' ? (
          <div className={styles.wordsContainer}>
            {lesson.english.word && <Words english={lesson.english.word} japanese={lesson.japanese.word} korean={lesson.korean.word} />}
            <EnglishSentence content={lesson.english.sentence} />
          </div>
        ) : (
          <div className={styles.wordsContainer}>
            <Words english={lesson.words[1]} japanese={lesson.words[0]} />
          </div>
        )}

        {lesson.korean && lesson.japanese && (
          <div className={styles.container}>
            <Sentence
              key={uuid()}
              content={lesson.japanese.sentence}
              uniqueIds={lesson.japanese.uuidList}
              split={lesson.japanese.split}
              romanized={lesson.japanese.altSpelling.romanized}
              voice={10}
            />
          </div>
        )}
        {lesson.korean ? (
          <div className={styles.conversationContainer}>
            <Sentence
              key={uuid()}
              content={lesson.korean.sentence}
              uniqueIds={lesson.korean.uuidList}
              split={lesson.korean.split}
              romanized={lesson.korean.altSpelling}
              voice={11}
            />
          </div>
        ) : id !== 'j6k' ? (
          <div className={styles.conversationContainer}>
            <Sentence
              key={uuid()}
              content={lesson.japanese.sentence}
              uniqueIds={lesson.japanese.uuidList}
              split={lesson.japanese.split}
              romanized={lesson.japanese.altSpelling.romanized}
              voice={10}
            />
          </div>
        ) : (
          <>
            {lesson.jOneBundle && (
              <div className={styles.container}>
                <EnglishSentence content={lesson.eOneBundle} />
                <Sentence
                  key={uuid()}
                  content={lesson.jOneBundle.sentence}
                  uniqueIds={lesson.jOneBundle.uuidList}
                  split={lesson.jOneBundle.split}
                  romanized={lesson.jOneBundle.altSpelling.romanized}
                  voice={10}
                />
              </div>
            )}
            {lesson.jTwoBundle && (
              <div className={styles.container}>
                <EnglishSentence content={lesson.eTwoBundle} />
                <Sentence
                  key={uuid()}
                  content={lesson.jTwoBundle.sentence}
                  uniqueIds={lesson.jTwoBundle.uuidList}
                  split={lesson.jTwoBundle.split}
                  romanized={lesson.jTwoBundle.altSpelling.romanized}
                  voice={10}
                />{' '}
              </div>
            )}
            {lesson.jThreeBundle && (
              <div className={styles.container}>
                <EnglishSentence content={lesson.eThreeBundle} />
                <Sentence
                  key={uuid()}
                  content={lesson.jThreeBundle.sentence}
                  uniqueIds={lesson.jThreeBundle.uuidList}
                  split={lesson.jThreeBundle.split}
                  romanized={lesson.jThreeBundle.altSpelling.romanized}
                  voice={10}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default LessonContainer
