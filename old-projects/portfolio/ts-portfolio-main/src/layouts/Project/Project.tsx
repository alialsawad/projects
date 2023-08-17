/* eslint-disable react/display-name */
import { Heading } from 'components/Heading'
import { Image } from 'components/Image'
import { Section } from 'components/Section'
import { Text } from 'components/Text'
import { tokens } from 'components/ThemeProvider/theme'
import { Transition } from 'components/Transition'
import { useParallax } from 'hooks'
import React, { forwardRef, FunctionComponent, useRef } from 'react'
import { classes, cssProps, msToNum, numToMs } from 'utils/style'
import styles from './Project.module.css'

const initDelay = 400

interface ProjectHeaderProps {
  title: string
  description?: string
  linkLabel?: string
  url?: string
  roles?: string[]
  className?: string
}

export const ProjectHeader: FunctionComponent<ProjectHeaderProps> = ({ title, description, roles, className = '' }) => {
  return (
    <Section className={classes(styles.header, className)} as="section">
      <div className={styles.headerContent} style={cssProps({ initDelay: numToMs(initDelay) })}>
        <div className={styles.details}>
          <Heading className={styles.title} level={2} as="h1">
            {title}
          </Heading>
          <Text className={styles.description} size="xl" as="div">
            {description}
          </Text>
        </div>
        {!!roles?.length && (
          <ul className={styles.meta}>
            {roles?.map((role, index) => (
              <li className={styles.metaItem} style={cssProps({ delay: numToMs(initDelay + 300 + index * 140) })} key={role}>
                <Text secondary>{role}</Text>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  )
}

interface SkillsContainerProps {
  [key: string]: any
  className?: string
}
export const SkillsContainer: FunctionComponent<SkillsContainerProps> = ({ className = '', ...rest }) => (
  <article className={classes(styles.skills, className)} {...rest} />
)

interface ProjectContainerProps {
  [key: string]: any
  className?: string
}

export const ProjectContainer: FunctionComponent<ProjectContainerProps> = ({ className = '', ...rest }) => (
  <article className={classes(styles.project, className)} {...rest} />
)

interface ProjectSectionProps {
  [key: string]: any
  className?: string
  light?: boolean
  padding?: boolean
  fullHeight?: boolean
  backgroundOverlayOpacity?: number
  children: React.ReactNode
}

export const ProjectSection = forwardRef<HTMLElement, ProjectSectionProps>(
  ({ className = '', light, padding = 'both', fullHeight, backgroundOverlayOpacity = 0.9, children, ...rest }, ref) => (
    <section className={classes(styles.section, className)} data-light={light} data-full-height={fullHeight} ref={ref} {...rest}>
      <Section className={styles.sectionInner} data-padding={padding}>
        {children}
      </Section>
    </section>
  )
)

interface ProjectBackgroundProps {
  [key: string]: any
  className?: string
  opacity?: number
}

export const ProjectBackground: FunctionComponent<ProjectBackgroundProps> = ({ opacity = 0.7, className = '', ...rest }) => {
  const imageRef = useRef<HTMLDivElement>(null)

  useParallax(0.6, (value: number) => {
    if (!imageRef.current) return
    imageRef.current.style.setProperty('--offset', `${value}px`)
  })

  return (
    <Transition in timeout={msToNum(tokens.base.durationM)}>
      {(visible: boolean) => (
        <div className={classes(styles.backgroundImage, className)} data-visible={visible}>
          <div className={styles.backgroundImageElement} ref={imageRef}>
            <Image alt="" role="presentation" {...rest} />
          </div>
          <div className={styles.backgroundScrim} style={cssProps({ opacity })} />
        </div>
      )}
    </Transition>
  )
}

interface ProjectSectionContentProps {
  [key: string]: any
  className?: string
  width?: string
}
export const ProjectSectionContent: FunctionComponent<ProjectSectionContentProps> = ({ className = '', width = 'l', ...rest }) => (
  <div className={classes(styles.sectionContent, className)} data-width={width} {...rest} />
)

interface ProjectSectionHeadingProps {
  [key: string]: any
  className?: string
  level?: number
  as?: string
}

export const ProjectSectionHeading: FunctionComponent<ProjectSectionHeadingProps> = ({ className = '', level = 3, as = 'h2', ...rest }) => (
  <Heading className={classes(styles.sectionHeading, className)} as={as} level={level} align="auto" {...rest} />
)

interface ProjectSectionTextProps {
  [key: string]: any
  className?: string
}

export const ProjectSectionText: FunctionComponent<ProjectSectionTextProps> = ({ className = '', ...rest }) => (
  <Text className={classes(styles.sectionText, className)} size="l" as="p" {...rest} />
)

interface ProjectTextRowProps {
  [key: string]: any
  className?: string
  center?: boolean
  stretch?: boolean
  justify?: string
  width?: string
  noMargin?: boolean
  centerMobile?: boolean
}

export const ProjectTextRow: FunctionComponent<ProjectTextRowProps> = ({
  center,
  stretch,
  justify = 'center',
  width = 'l',
  noMargin,
  className = '',
  centerMobile,
  ...rest
}) => (
  <div
    className={classes(styles.textRow, className)}
    data-center={center}
    data-stretch={stretch}
    data-center-mobile={centerMobile}
    data-no-margin={noMargin}
    data-width={width}
    data-justify={justify}
    {...rest}
  />
)

interface ProjectTransitionProps {
  children: React.ReactNode
}

export function ProjectTransition({ children }: ProjectTransitionProps) {
  return (
    <div style={cssProps({ initDelay: numToMs(initDelay) })}>
      <div className={styles.projectDescription}>{children}</div>
    </div>
  )
}
