import { concatClasses } from 'utils/css'
import styles from './Icon.module.css'
import { TiMicrophoneOutline } from 'react-icons/ti'
import { FaAssistiveListeningSystems } from 'react-icons/fa'
import { MdOutlineCancel, MdTranslate } from 'react-icons/md'
import { FaSpellCheck } from 'react-icons/fa'
import { BiReset } from 'react-icons/bi'
import { FiPlay } from 'react-icons/fi'
import { MdArrowBackIos } from 'react-icons/md'
import { MdArrowForwardIos } from 'react-icons/md'

interface Icons {
  [key: string]: any
}
export const icons: Icons = {
  listen: <FaAssistiveListeningSystems />,
  translation: <MdTranslate />,
  speak: <TiMicrophoneOutline />,
  validation: <FaSpellCheck />,
  reset: <BiReset />,
  play: <FiPlay />,
  left: <MdArrowBackIos />,
  right: <MdArrowForwardIos />,
  close: <MdOutlineCancel />
}

export const Icon = ({ icon, className = '', ...rest }: any) => {
  return (
    <span aria-hidden className={concatClasses(styles.icon, className)} {...rest}>
      {icons[icon]}
    </span>
  )
}
