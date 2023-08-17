import { RouterButtons } from 'components/Buttons'
import React from 'react'
import NavContainer from './NavContainer'
import { navLinks } from '../../data/NavData'
import uuid from 'react-uuid'

import { Transition } from 'components/Transition'

export function Navbar() {
  return (
    <Transition>
      <NavContainer>
        <RouterButtons key={uuid()} style="light" data={navLinks} />
      </NavContainer>
    </Transition>
  )
}
