/* eslint-disable react/display-name */
import { Icon } from 'components/Icon'
import { Loader } from 'components/Loader'
import { Transition } from 'components/Transition'
import RouterLink from 'next/link'
import { forwardRef } from 'react'
import { classes } from 'utils/style'
import styles from './Button.module.css'
import React from 'react'

function isExternalLink(href: string) {
  return href?.includes('://')
}

interface ButtonProps {
  [x: string]: any
  children: string
  href: string
  className: string
  secondary?: boolean
  iconHoverShift?: boolean
  icon?: string
  as?: typeof React.Component | string
  loading: string
  loadingText?: string
  iconEnd?: string
  iconOnly?: string
  rel?: string
  target?: string
  disabled?: boolean
}

export const Button = forwardRef<typeof React.Component, ButtonProps>(({ href, ...rest }, ref) => {
  if (isExternalLink(href) || !href) {
    return <ButtonContent href={href} ref={ref} {...rest} />
  }

  return (
    <RouterLink passHref href={href} scroll={false}>
      <ButtonContent href={href} ref={ref} {...rest} />
    </RouterLink>
  )
})

const ButtonContent = forwardRef<typeof React.Component, ButtonProps>(
  (
    {
      className,
      as,
      secondary,
      loading,
      loadingText = 'loading',
      icon,
      iconEnd,
      iconHoverShift,
      iconOnly,
      children,
      rel,
      target,
      href,
      disabled,
      ...rest
    },
    ref
  ) => {
    const isExternal = isExternalLink(href)
    const defaultComponent = href ? 'a' : 'button'
    const Component = (as || defaultComponent) as React.ElementType;

    return (
      <Component
        className={classes(styles.button, className)}
        data-loading={loading}
        data-icon-only={iconOnly}
        data-secondary={secondary}
        data-icon={icon}
        href={href}
        rel={rel || isExternal ? 'noopener noreferrer' : undefined}
        target={target || isExternal ? '_blank' : undefined}
        disabled={disabled}
        ref={ref}
        {...rest}>
        {!!icon && <Icon className={styles.icon} data-start={!iconOnly} data-shift={iconHoverShift} icon={icon} />}
        {!!children && <span className={styles.text}>{children}</span>}
        {!!iconEnd && <Icon className={styles.icon} data-end={!iconOnly} data-shift={iconHoverShift} icon={iconEnd} />}
        <Transition unmount in={loading}>
          {(visible: boolean) => <Loader className={styles.loader} size={32} text={loadingText} data-visible={visible} />}
        </Transition>
      </Component>
    )
  }
)
