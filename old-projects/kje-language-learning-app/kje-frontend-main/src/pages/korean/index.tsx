import React, { useEffect, useState } from 'react'
import styles from './Contents.module.css'
import { RouterButtons } from 'components/Buttons'
import { useContentsData } from 'hooks'

const id = 'korean'
const Contents = () => {
  const { getRoute } = useContentsData()
  const [route, setRoute] = useState<{ label: string; pathname: string }[] | null>(null)

  useEffect(() => {
    setRoute(getRoute(id as string))
  }, [])
  if (!route) {
    return <div>Loading...</div>
  }
  return <RouterButtons style="dark" className={styles.links} data={route} />
}

export default Contents
