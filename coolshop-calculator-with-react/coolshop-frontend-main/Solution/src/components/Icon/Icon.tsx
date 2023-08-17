import { classes } from '../../utils/style'
import { AiFillDelete } from 'react-icons/ai'
import { GrAdd } from 'react-icons/gr'
import { BsToggleOff, BsToggleOn } from 'react-icons/bs'
import { IconCollection, IconProps } from 'data/Types'

const icons: IconCollection = {
  delete: <AiFillDelete />,
  add: <GrAdd />,
  enable: <BsToggleOn />,
  disable: <BsToggleOff />
}

export const Icon = ({ name, className = '', ...rest }: IconProps) => {
  return (
    <i className={classes(className)} {...rest}>
      {icons[name]}
    </i>
  )
}
