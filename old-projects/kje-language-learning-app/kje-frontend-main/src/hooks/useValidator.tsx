import { useCallback, useMemo } from 'react'
import { JAPANESE_NUMBER_REPLACEMENT, KOREAN_NUMBER_REPLACEMENT, REPLACEMENT_STRUCTURE, SKIP_STRUCTURE } from 'data/ValidatorData'

export const useValidator = () => {
  const stringToRegExp = useCallback((inputString: string) => {
    const optionalParam = /\s*\((.*?)\)\s*/g
    const optionalRegex = /(\(\?:[^)]+\))\?/g
    const namedParam = /(\(\?)?:\w+/g
    const splatParam = /\*/g
    const escapeRegExp = /[-{}[\]+?.,\\^$|#]/g

    inputString = inputString
      .replace(escapeRegExp, '\\$&')
      .replace(optionalParam, '(?:$1)?')
      .replace(namedParam, '([^\\s]+)')
      .replace(splatParam, '(.*?)')
      .replace(optionalRegex, '\\s*$1?\\s*')
    return new RegExp('^' + inputString + '$', 'i')
  }, [])

  const testRegExpMatch = useCallback(
    (inputString: string, spokenString: string) => {
      const pattern = stringToRegExp(inputString)
      const result = pattern.exec(spokenString)
      return result !== null
    },
    [stringToRegExp]
  )

  const compareTwoStringsUsingDiceCoefficient = useCallback((inputString: string, spokenString: string) => {
    inputString = inputString.replace(/\s+/g, '').toLowerCase()
    spokenString = spokenString.replace(/\s+/g, '').toLowerCase()
    if (!inputString.length && !spokenString.length) return 1 // if both are empty strings

    if (!inputString.length || !spokenString.length) return 0 // if only one is empty string

    if (inputString === spokenString) return 1 // identical

    if (inputString.length === 1 && spokenString.length === 1) return 0 // both are 1-letter strings

    if (inputString.length < 2 || spokenString.length < 2) return 0 // if either is a 1-letter string

    const firstBigrams = new Map()

    for (let i = 0; i < inputString.length - 1; i++) {
      const bigram = inputString.substring(i, i + 2)
      const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1
      firstBigrams.set(bigram, count)
    }

    let intersectionSize = 0

    for (var i = 0; i < spokenString.length - 1; i++) {
      const bigram = spokenString.substring(i, i + 2)

      const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0

      if (count > 0) {
        firstBigrams.set(bigram, count - 1)
        intersectionSize++
      }
    }

    return (2.0 * intersectionSize) / (inputString.length + spokenString.length - 2)
  }, [])

  const testFuzzyMatch = useCallback(
    (inputString: string, spokenString: string, fuzzyMatchingThreshold: number = 0.6) => {
      const spokenStringWithoutSpecials = spokenString
        .replace(/[&/\\#,+()!$~%.'":*?<>{}]/g, '')
        .replace(/  +/g, ' ')
        .trim()
      const inputStringWithoutSpecials = inputString
        .replace(/[&/\\#,+()!$~%.'":*?<>{}]/g, '')
        .replace(/  +/g, ' ')
        .trim()

      const howSimilar = compareTwoStringsUsingDiceCoefficient(inputStringWithoutSpecials, spokenStringWithoutSpecials)
      return howSimilar >= fuzzyMatchingThreshold
    },
    [compareTwoStringsUsingDiceCoefficient]
  )

  const testOutliers = useCallback((inputString: string, spokenString: string) => {
    if (REPLACEMENT_STRUCTURE[inputString as string]) {
      return spokenString.includes(REPLACEMENT_STRUCTURE[inputString as string])
    }
    if (JAPANESE_NUMBER_REPLACEMENT[inputString as string]) {
      return spokenString.includes(JAPANESE_NUMBER_REPLACEMENT[inputString as string])
    }
    if (KOREAN_NUMBER_REPLACEMENT[inputString as string]) {
      return spokenString.includes(KOREAN_NUMBER_REPLACEMENT[inputString as string])
    }

    if (SKIP_STRUCTURE.includes(inputString)) {
      return true
    }
  }, [])

  const testExactMatch = useCallback((inputString: string, spokenString: string) => {
    return spokenString.includes(inputString)
  }, [])

  const validate = useCallback(
    (inputString: string, spokenString: string) => {
      return (
        testExactMatch(inputString, spokenString) ||
        testOutliers(inputString, spokenString) ||
        testRegExpMatch(inputString, spokenString.slice(-inputString.length)) ||
        testFuzzyMatch(inputString, spokenString.slice(-inputString.length))
      )
    },

    [testRegExpMatch, testFuzzyMatch, testOutliers, testExactMatch]
  )

  const value = useMemo(
    () => ({
      validate
    }),
    [validate]
  )

  return value
}
