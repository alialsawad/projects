import { useCallback, useMemo, useState } from 'react'

export const useContentsData = () => {
  const KoreanContents = [
    {
      label: 'Hangul',
      pathname: '/alphabet/hangul'
    },
    {
      label: 'Korean Conversations',
      pathname: '',
      alt: 'korean-conversations'
    }
  ]

  const KjeContents = [{ label: 'Korean, and Japanese Parallel', pathname: '', alt: 'kje' }]

  const JapaneseContents = [
    { label: 'Hiragana', pathname: '/alphabet/hiragana' },
    { label: 'Katakana', pathname: '/alphabet/katakana' },
    { label: 'Japanese Conversations', pathname: '', alt: 'japanese-conversations' },
    { label: 'Japanese 6k', pathname: '', alt: 'j6k' }
  ]
  interface ROUTES {
    [key: string]: any
  }

  const getRoute = useCallback((id: string) => {
    const ROUTES: ROUTES = {
      japanese: JapaneseContents,
      korean: KoreanContents,
      kje: KjeContents
    }
    ROUTES[id as string].map((item: any) => {
      if (item.alt) {
        if (
          item.label === 'Korean Conversations' ||
          item.label === 'Japanese Conversations' ||
          item.label === 'Japanese 6k' ||
          item.label === 'Korean, and Japanese Parallel'
        ) {
          const savedPageNumber = window.localStorage.getItem(item.alt as string)
          if (savedPageNumber) {
            item.pathname = `/${item.alt}/${savedPageNumber}`
          } else {
            item.pathname = `/${item.alt}/1`
          }
        }
      }
    })
    return ROUTES[id as string]
  }, [])
  const value = useMemo(
    () => ({
      getRoute
    }),
    [getRoute]
  )

  return value
}
