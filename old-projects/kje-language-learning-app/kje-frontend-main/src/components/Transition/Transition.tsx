import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Animations } from 'utils/animations'

export const Transition = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <AnimatePresence>
    <motion.div initial="initial" animate="animate" exit="exit" variants={Animations.pop.variants}>
      {children}
    </motion.div>
  </AnimatePresence>
)
