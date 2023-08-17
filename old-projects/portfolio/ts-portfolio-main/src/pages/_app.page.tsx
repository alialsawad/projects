import 'layouts/App/reset.css'
import 'layouts/App/global.css'

import { ThemeProvider } from 'components/ThemeProvider'
import { tokens } from 'components/ThemeProvider/theme'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import { useFoucFix, useLocalStorage } from 'hooks'
import styles from 'layouts/App/App.module.css'
import { initialState, reducer, ActionType } from 'layouts/App/reducer'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, createContext, useEffect, useReducer } from 'react'
import { msToNum } from 'utils/style'
import { Navbar } from 'components/Navbar'
import type { AppProps } from 'next/app'
import { Footer } from 'components/Footer'

export const AppContext = createContext({})

const App = ({ Component, pageProps }: AppProps) => {
  const [storedTheme] = useLocalStorage('theme', 'dark')
  const [state, dispatch] = useReducer(reducer, initialState)
  const { route, events, asPath } = useRouter()
  const canonicalRoute = route === '/' ? '' : `${asPath}`
  useFoucFix()

  useEffect(() => {
    dispatch({ type: ActionType.SET_THEME, value: storedTheme || 'dark' })
  }, [storedTheme])

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      <ThemeProvider themeId={state.theme}>
        <LazyMotion features={domAnimation}>
          <Fragment>
            <main className={styles.app} tabIndex={-1} id="MainContent">
              <AnimatePresence exitBeforeEnter>
                <m.div
                  key={route}
                  className={styles.page}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: 'tween',
                    ease: 'linear',
                    duration: msToNum(tokens.base.durationS) / 1000,
                    delay: 0.1
                  }}>
                  <Navbar />
                  <Component {...pageProps} />
                </m.div>
              </AnimatePresence>
            </main>
          </Fragment>
        </LazyMotion>
      </ThemeProvider>
    </AppContext.Provider>
  )
}

export default App
