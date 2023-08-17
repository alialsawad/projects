import { Button } from 'components/Button'

import {
  ProjectContainer,
  ProjectHeader,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectSectionText,
  ProjectTextRow,
  ProjectTransition
} from 'layouts/Project'
import { Fragment, FunctionComponent } from 'react'
import styles from './ProjectDisplay.module.css'
import { List, ListItem } from 'components/List'
import uuid from 'react-uuid'

interface ProjectDisplayProps {
  title: string
  url: string
  stack: string[]
  description?: string[]
  shortDescription: string
  showLink?: boolean
  underConstruction?: boolean
}

export const ProjectDisplay: FunctionComponent<ProjectDisplayProps> = ({
  title,
  url,
  stack,
  description,
  shortDescription,
  showLink = true,
  underConstruction = false
}) => {
  return (
    <Fragment>
      <ProjectContainer className={styles.slice}>
        <ProjectTransition>
          <ProjectSectionContent>
            <div className={styles.container}>
              <div className={styles.card}>
                <span>
                  <ProjectHeader title={title} description={shortDescription} roles={stack} />
                  {description && (
                    <>
                      <ProjectSectionHeading>Project description</ProjectSectionHeading>
                      <ProjectSectionText>
                        <ProjectTextRow>
                          <List>
                            {description.map((text) => (
                              <ListItem key={uuid()}>{text}</ListItem>
                            ))}
                          </List>
                        </ProjectTextRow>
                      </ProjectSectionText>
                    </>
                  )}
                  {!underConstruction && showLink && (
                    <Button iconHoverShift href={url} iconEnd="arrowRight">
                      View Project
                    </Button>
                  )}
                  {underConstruction && (
                    <Button iconHoverShift href={''} iconEnd="error">
                      Undergoing Updates
                    </Button>
                  )}
                </span>
              </div>
            </div>
          </ProjectSectionContent>
        </ProjectTransition>
      </ProjectContainer>
    </Fragment>
  )
}
