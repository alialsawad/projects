import { useHasMounted } from 'hooks'
import Head from 'next/head'
import { createContext, FunctionComponent, useEffect } from 'react'
import { classes, media } from 'utils/style'
import { theme, tokens } from './theme'
import { useTheme } from './useTheme'
import React from 'react'

interface ThemeProvider {
  [x: string]: any
  themeId?: string
  theme?: string[]
  children: React.ReactNode
  className?: string
  as?: typeof React.Component | string
}

export const ThemeContext = createContext({})

export const ThemeProvider: FunctionComponent<ThemeProvider> = ({
  themeId = 'dark',
  theme: themeOverrides,
  children,
  className = '',
  as: Component = 'div',
  ...rest
}) => {
  const currentTheme = { ...theme[themeId as keyof typeof theme], ...themeOverrides }
  const parentTheme = useTheme()
  const isRootProvider = !parentTheme.themeId
  const hasMounted = useHasMounted()

  // Save root theme id to localstorage and apply class to body
  useEffect(() => {
    if (isRootProvider && hasMounted) {
      window.localStorage.setItem('theme', JSON.stringify(themeId))
      document.body.dataset.theme = themeId
    }
  }, [themeId, isRootProvider, hasMounted])

  return (
    <ThemeContext.Provider value={currentTheme}>
      {isRootProvider && (
        <>
          <Head>
            <meta name="theme-color" content={`rgb(${currentTheme.rgbBackground})`} />
          </Head>
          {children}
        </>
      )}
      {/* Nested providers need a div to override theme tokens */}
      {!isRootProvider && (
        <Component className={classes('theme-provider', className)} data-theme={themeId} {...rest}>
          {children}
        </Component>
      )}
    </ThemeContext.Provider>
  )
}

/**
 * Squeeze out spaces and newlines
 */
export function squish(styles: string) {
  return styles.replace(/\s\s+/g, ' ')
}

/**
 * Transform theme token objects into CSS custom property strings
 */
export function createThemeProperties(theme: { [key: string]: string | number }) {
  return squish(
    Object.keys(theme)
      .filter((key) => key !== 'themeId')
      .map((key) => `--${key}: ${theme[key]};`)
      .join('\n\n')
  )
}

/**
 * Transform theme tokens into a React CSSProperties object
 */
export function createThemeStyleObject(theme: { [id: string]: string | number }) {
  let style: { [id: string]: string | number } = {}

  for (const key of Object.keys(theme)) {
    if (key !== 'themeId') {
      style[`--${key}`] = theme[key]
    }
  }

  return style
}

/**
 * Generate media queries for tokens
 */
export function createMediaTokenProperties() {
  return squish(
    Object.keys(media)
      .map((key) => {
        return `
        @media (max-width: ${media[key]}px) {
          :root {
            ${createThemeProperties(tokens[key as keyof typeof tokens])}
          }
        }
      `
      })
      .join('\n')
  )
}

export const tokenStyles = squish(`
  :root {
    ${createThemeProperties(tokens.base)}
  }

  ${createMediaTokenProperties()}

  [data-theme='dark'] {
    ${createThemeProperties(theme.dark)}
  }

  [data-theme='light'] {
    ${createThemeProperties(theme.light)}
  }
`)

export const fontStyles = squish(`
  @font-face {
    font-family: 'Courier New', Courier, monospace;
    font-display: block;
    font-style: normal;
  }
`)
