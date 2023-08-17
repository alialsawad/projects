/* eslint-disable react/display-name */
import React, { forwardRef } from 'react'
import { classes } from 'utils/style'
import styles from './VisuallyHidden.module.css'

interface VisuallyHiddenProps {
  [key: string]: any
  children: React.ReactNode
  className?: string
  showOnFocus?: boolean
  as?: React.ElementType
  visible?: boolean
}

export const VisuallyHidden = forwardRef(
  ({ className = '', showOnFocus, as: Component = 'span', children, visible, ...rest }: VisuallyHiddenProps, ref) => {
    return (
      <Component
        className={classes(styles.hidden, className)}
        data-hidden={!visible && !showOnFocus}
        data-show-on-focus={showOnFocus}
        ref={ref}
        {...rest}>
        {children}
      </Component>
    )
  }
)
