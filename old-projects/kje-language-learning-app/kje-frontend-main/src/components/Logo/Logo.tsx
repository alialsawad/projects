import React from 'react'
import Image from 'next/image'
import { LogoWrapper } from './LogoWrapper'
import LogoImage from './images/logo.png'

export const Logo = () => {
  return (
    <LogoWrapper>
      <Image src={LogoImage} alt="" />
    </LogoWrapper>
  )
}
