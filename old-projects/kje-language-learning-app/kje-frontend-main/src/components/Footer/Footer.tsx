import Link from 'next/link'
import styles from './Footer.module.css'

interface FooterProps {
  className?: string
  position?: 'absolute'
}
export const Footer = ({ className = '', position }: FooterProps) => (
  <footer className={styles.footer} style={{ position: position }}>
    <span className={styles.date}>
      {`© ${new Date().getFullYear()} Ali Alsawad. `}
      <Link href="https://alialsawad.com">
        <a target="_" className={styles.link}>
          alialsawad.com
        </a>
      </Link>
    </span>
  </footer>
)
