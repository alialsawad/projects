import { InputProps, SelectProps } from 'data/Types'
import React from 'react'
import { classes } from '../../utils/style'
// @ts-ignore
import styles from './Inputs.module.css'

export const Input = ({ type, onChange, disabled, value, className = '', ...rest }: InputProps) => {
  return (
    <>
      <input
        type={type}
        onChange={onChange}
        disabled={disabled}
        className={classes(styles.input, styles.shared, className)}
        placeholder={`${value}`}
        {...rest}
      />
    </>
  )
}

export const Select = ({ options, onChange, value, className = '', ...rest }: SelectProps) => {
  return (
    <select className={classes(styles.select, styles.shared, className)} onChange={onChange} data-value={value} {...rest}>
      {options.map((option) => (
        <option>{option}</option>
      ))}
    </select>
  )
}
