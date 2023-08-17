import { useCallback, useMemo, useRef } from 'react'
import { useHighlighter } from './useHighlighter'
import { useValidator } from './useValidator'
import { SKIP_STRUCTURE } from '../data/ValidatorData'

export const useSolutionManager = () => {
  const { highlightById, removeHighlightByIdList } = useHighlighter()
  const { validate } = useValidator()
  const spokenString = useRef('')

  const inputString = useRef<string>()
  const stringPointer = useRef(0)
  const stringLength = useRef(0)

  const updateStringPointer = useCallback((contentLength: number) => {
    if (stringPointer.current < contentLength - 1) {
      stringPointer.current++
    }
  }, [])

  const markAsCorrect = useCallback(
    (content: string[], uniqueIds: string[]) => {
      highlightById(uniqueIds[stringPointer.current])
      updateStringPointer(content.length)
      stringLength.current = spokenString.current.length
      inputString.current = content[stringPointer.current]
    },
    [highlightById, stringPointer, stringLength, inputString, updateStringPointer]
  )

  const validateAndHighlight = useCallback(
    (content: string[], transcript: string, uniqueIds: string[]) => {
      if (inputString.current !== content[stringPointer.current]) {
        inputString.current = content[stringPointer.current]
      }

      if (transcript.length >= stringLength.current + spokenString.current.length) {
        spokenString.current = transcript.slice(stringLength.current)
      } else {
        spokenString.current = transcript
      }

      const result = validate(inputString.current.replace(/\s+/g, ''), spokenString.current as string)
      if (result) {
        markAsCorrect(content, uniqueIds)
      }
      if (SKIP_STRUCTURE.includes(inputString.current.replace(/\s+/g, ''))) {
        markAsCorrect(content, uniqueIds)
      }
    },
    [validate, stringPointer, stringLength, spokenString, inputString, markAsCorrect]
  )

  const reset = useCallback(
    (uniqueIds: string[], resetTranscript: () => void) => {
      inputString.current = ''
      spokenString.current = ''
      stringPointer.current = 0
      stringLength.current = 0
      removeHighlightByIdList(uniqueIds)
      resetTranscript()
      removeHighlightByIdList(['10-transcript', '11-transcript'])
    },
    [removeHighlightByIdList]
  )

  const value = useMemo(() => ({ validateAndHighlight, reset }), [validateAndHighlight, reset])

  return value
}
