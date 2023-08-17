import { InnerPageContainer } from 'components/InnerPageContainer'
import { OuterPageContainer } from 'components/OuterPageContainer'
import { Transition } from 'components/Transition'
import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Transition>
      <OuterPageContainer>
        <InnerPageContainer>{children}</InnerPageContainer>
      </OuterPageContainer>
    </Transition>
  )
}
