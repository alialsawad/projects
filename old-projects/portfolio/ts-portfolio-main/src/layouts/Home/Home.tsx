import { Footer } from 'components/Footer'
import { Meta } from 'components/Meta'
import { Intro } from 'layouts/Home/Intro'
import { useRef } from 'react'
import styles from './Home.module.css'

const disciplines = ['Full Stack Engineer', 'Data Analyst']

export const Home = () => {
  const intro = useRef<HTMLElement>(null)

  return (
    <div className={styles.home}>
      <Meta
        title="Data Analyst and Full Stack Engineer"
        description="Personal portfolio of Ali Alsawad — a data analyst and a full stack engineer."
      />
      <Intro id="intro" sectionRef={intro} disciplines={disciplines} />
      <Footer position="absolute" />
    </div>
  )
}
