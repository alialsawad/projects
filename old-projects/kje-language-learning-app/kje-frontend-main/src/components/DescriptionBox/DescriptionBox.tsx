import React from 'react'
import { DescriptionData } from './DescriptionData'
import styles from './DescriptionBox.module.css'
import uuid from 'react-uuid'

import { Box } from './Box'

export const DescriptionBox = () => {
  return (
    <div className={styles.container}>
      {DescriptionData.map((item) => (
        <Box key={uuid()} icon={item.icon} description={item.description} />
      ))}
    </div>
  )
}
