import React from 'react'
import { classes } from '../../utils/style'
// @ts-ignore
import styles from './Button.module.css'
import { ButtonProps } from 'data/Types'
import { Icon } from '../Icon/Icon'

export const Button = ({ children, iconName, action, className = '', ...rest }: ButtonProps) => {
  return (
    <button onClick={action} className={classes(styles.button, className)} {...rest}>
      <span>{children}</span>
      <div className={styles.icon}>
        <Icon className={styles.fa} name={iconName} />
      </div>
    </button>
  )
}
