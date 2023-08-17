import axios from 'axios'
import { useCallback, useMemo } from 'react'

export const useFetcher = () => {
  const fetchData = useCallback((method: string, url: string, options = {}) => {
    return axios({
      method,
      url,
      ...options
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  }, [])

  const value = useMemo(
    () => ({
      fetchData
    }),
    [fetchData]
  )

  return value
}
