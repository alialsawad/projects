import { classes } from 'utils/style'
import styles from './Icon.module.css'
import ArrowLeft from './svg/arrow-left.svg'
import ArrowRight from './svg/arrow-right.svg'
import Check from './svg/check.svg'
import ChevronRight from './svg/chevron-right.svg'
import Close from './svg/close.svg'
import Copy from './svg/copy.svg'
import Error from './svg/error.svg'
import LinkedIn from './svg/linkedin.svg'
import Github from './svg/github.svg'
import Link from './svg/link.svg'
import Menu from './svg/menu.svg'
import Pause from './svg/pause.svg'
import Play from './svg/play.svg'
import Send from './svg/send.svg'
import { FunctionComponent, SVGProps } from 'react'

interface icons {
  [key: string]: SVGProps<SVGSymbolElement>
}

export const icons: icons = {
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  check: Check,
  chevronRight: ChevronRight,
  close: Close,
  copy: Copy,
  error: Error,
  linkedin: LinkedIn,
  github: Github,
  link: Link,
  menu: Menu,
  pause: Pause,
  play: Play,
  send: Send
}

interface Icon {
  [key: string]: any
  icon: string
  className?: string
}

export const Icon: FunctionComponent<Icon> = ({ icon, className = '', ...rest }) => {
  const IconComponent = icons[icon] as React.ElementType

  return <IconComponent aria-hidden className={classes(styles.icon, className)} {...rest} />
}
