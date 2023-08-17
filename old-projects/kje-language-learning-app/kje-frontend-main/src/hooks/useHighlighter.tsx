import { useCallback, useMemo } from 'react'

import styles from './useHighlighter.module.css'

export const useHighlighter = () => {
  const highlightById = useCallback((id: string) => {
    document.getElementById(id)?.classList.add(styles.highlighted)
  }, [])

  const removeHighlightByIdList = useCallback((idList: string[]) => {
    idList.forEach((id) => {
      document.getElementById(id)?.classList.remove(styles.highlighted)
    })
  }, [])
  const highlightByClassNameList = useCallback((queryList: string[]) => {
    queryList.forEach((query) => {
      try {
        document.querySelectorAll(`.${query}`).forEach((element) => {
          element.classList.add(styles.highlighted)
        })
      } catch (error) {
        console.error(error)
      }
    })
  }, [])

  const removeHighlightByClassNameList = useCallback((queryList: string[]) => {
    queryList.forEach((query) => {
      try {
        document.querySelectorAll(`.${query}`).forEach((element) => {
          element.classList.remove(styles.highlighted)
        })
      } catch (error) {
        console.error(error)
      }
    })
  }, [])

  const value = useMemo(
    () => ({
      highlightById,
      removeHighlightByIdList,
      highlightByClassNameList,
      removeHighlightByClassNameList
    }),
    [highlightById, removeHighlightByIdList, highlightByClassNameList, removeHighlightByClassNameList]
  )

  return value
}
