import usesBackgroundPlaceholder from 'assets/uses-background-placeholder.png'
// @ts-ignore
import usesBackground from 'assets/matrix.mp4'
import { Meta } from 'components/Meta'
import { ProjectBackground, SkillsContainer, ProjectHeader, ProjectSection, ProjectSectionContent, ProjectTextRow } from 'layouts/Project'
import { Fragment, useState } from 'react'
import styles from './Uses.module.css'
import TechStack from './TechStack'
import { FullStack } from './Data/Tech_and_tools/FullStack'
import { DataScience } from './Data/Tech_and_tools/DataScience'
import { DevelopmentEnvironment } from './Data/Tech_and_tools/DevEnvironment'
import { NewTechnologies } from './Data/Tech_and_tools/NewTech'
import { Certification } from './Data/Tech_and_tools/Certification'
import uuid from 'react-uuid'
import { StackSummary } from './StackSummary'

const TAB_NAMES = {
  fullStack: 'Full Stack',
  devEnvironment: 'Development Environment',
  dataScience: 'Data Science',
  newTechnologies: 'New Technologies',
  certification: 'Courses & Certifications'
}

const TABS = [
  {
    name: TAB_NAMES.fullStack,
    data: FullStack
  },
  {
    name: TAB_NAMES.dataScience,
    data: DataScience
  },
  {
    name: TAB_NAMES.devEnvironment,
    data: DevelopmentEnvironment
  },
  {
    name: TAB_NAMES.newTechnologies,
    data: NewTechnologies
  },
  {
    name: TAB_NAMES.certification,
    data: Certification
  }
]

export const Uses = () => {
  const [currentTab, setCurrentTab] = useState(TAB_NAMES.fullStack)

  const OpenTab = (tab: string) => {
    switch (tab) {
      case TAB_NAMES.fullStack:
        setCurrentTab(TAB_NAMES.fullStack)
        break
      case TAB_NAMES.dataScience:
        setCurrentTab(TAB_NAMES.dataScience)
        break
      case TAB_NAMES.devEnvironment:
        setCurrentTab(TAB_NAMES.devEnvironment)
        break
      case TAB_NAMES.newTechnologies:
        setCurrentTab(TAB_NAMES.newTechnologies)
        break
      case TAB_NAMES.certification:
        setCurrentTab(TAB_NAMES.certification)
        break
      default:
        setCurrentTab(TAB_NAMES.fullStack)
    }
  }

  return (
    <Fragment>
      <Meta title="Skills" description="A list of technologies that I use" />

      <ProjectBackground src={{ src: usesBackground }} placeholder={usesBackgroundPlaceholder} opacity={0.7} />
      <SkillsContainer className={styles.uses}>
        <div className={styles.header_margin}>
          <ProjectHeader title={'Tools and Technologies'} />
        </div>
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="s">
              <div className={styles.tabs}>
                <ul className={styles.tab_list}>
                  {TABS.map((tab) => (
                    <li
                      key={uuid()}
                      className={styles.tab}
                      onClick={() => {
                        OpenTab(tab.name)
                      }}>
                      <span className={currentTab === tab.name ? styles.tab_active : styles.tab_inactive}>{tab.name}</span>
                    </li>
                  ))}
                </ul>
                <div className={styles.slider}>
                  <div className={styles.indicator}></div>
                </div>
                <div className={styles.content}>
                  {TABS.map((tab) => (
                    <section key={uuid()} className={`${styles.tab_content} ${currentTab === tab.name ? styles.active : ''}`}>
                      <StackSummary data={tab.data} />

                      <TechStack data={tab.data} />
                    </section>
                  ))}
                </div>
              </div>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow stretch width="m"></ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </SkillsContainer>
    </Fragment>
  )
}
