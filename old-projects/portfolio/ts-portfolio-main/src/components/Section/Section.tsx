/* eslint-disable react/display-name */
import React, { forwardRef } from 'react'
import { classes } from 'utils/style'
import styles from './Section.module.css'

interface Props {
  [x: string]: any
  as?: typeof React.Component | string
  children: React.ReactNode
  className?: string
}

export const Section = forwardRef<typeof React.Component, Props>(({ as: Component = 'div', children, className = '', ...rest }, ref) => (
  <Component className={classes(styles.section, className)} ref={ref} {...rest}>
    {children}
  </Component>
))
