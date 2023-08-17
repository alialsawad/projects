import { useEffectAfterMount, useFetcher } from 'hooks'

import React, { useState } from 'react'
import styles from './Lesson.module.css'
import { ProgressBar } from 'components/ProgressBar'
import { Icon } from 'components/Icon'
import { useRouter } from 'next/router'
import LessonContainer from 'components/LessonContainer/[id]'
import Link from 'next/link'

const PATHNAME: any = {
  'korean-conversations': 'lesson/korean-conversations',
  'japanese-conversations': 'lesson/japanese-conversations',
  kje: 'lesson/kje',
  j6k: 'lesson/j6k'
}
const slug = 'korean-conversations'
const Lesson = ({ lessonProps }: any) => {
  const router = useRouter()
  const { id } = router.query
  const [pageNumber, setPageNumber] = useState(parseInt(id as string))
  const [lesson, setLesson] = useState<any>(lessonProps)
  const { fetchData } = useFetcher()

  useEffectAfterMount(() => {
    const path = `${PATHNAME[slug as string]}/${id}`
    fetchData('GET', path).then((res) => {
      setLesson(res)
      window.localStorage.setItem(slug as string, res.pageNumber)
      setPageNumber(parseInt(res.pageNumber))
    })
  }, [])
  useEffectAfterMount(() => {
    window.localStorage.setItem(slug as string, pageNumber.toString())
    if (pageNumber.toString() !== lesson.pageNumber.toString() && pageNumber.toString() !== id?.toString()) {
      router.push(`/${slug}/${pageNumber}`)
    }
  }, [pageNumber])

  const getNextPage = () => {
    if (pageNumber < lesson.totalPages) {
      setPageNumber((prevPage) => prevPage + 1)
    }
  }
  const getPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prevPage) => prevPage - 1)
    }
  }
  const handlePageRequest = (value: string) => {
    let intValue = parseInt(value)

    if (intValue >= 1 && intValue <= lesson.totalPages) {
      setPageNumber(intValue)
    }
  }

  if (lesson.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <>
      <ProgressBar current={lesson.pageNumber} total={lesson.totalPages} toPage={handlePageRequest} />
      <LessonContainer lesson={lesson} id={slug} />
      <Link href="/korean-conversations/[id]" as={`/korean-conversations/${pageNumber - 1}`}>
        <Icon className={styles.prev} data-hidden={pageNumber === 1} icon="left" onClick={getPrevPage} />
      </Link>
      <Link href="/korean-conversations/[id]" as={`/korean-conversations/${pageNumber + 1}`}>
        <Icon icon="right" className={styles.next} data-hidden={pageNumber === lesson.totalPages} onClick={getNextPage} />
      </Link>
    </>
  )
}

export default Lesson
export const getStaticPaths = async () => {
  const paths = []

  for (let i = 1; i <= 4563; i++) {
    paths.push({ params: { id: `${i}` } })
  }

  return { paths, fallback: false }
}

export const getStaticProps = async ({ params }: any) => {
  const { id } = params
  const lessonProps = await fetch(`http://127.0.0.1:8000/api/lesson/korean-conversations/${id}?format=json`).then((res) => res.json())

  return {
    props: {
      lessonProps
    }
  }
}
