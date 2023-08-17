import { Text } from 'components/Text';
import { classes } from 'utils/style';
import styles from './Footer.module.css';

interface FooterProps {
  className?: string;
  position?: 'absolute';
}
export const Footer = ({ className = '', position }: FooterProps) => (
  <footer className={classes(styles.footer, className)} style={{ position: position }}>
    <Text size="s" align="center">
      <span className={styles.date}>{`© ${new Date().getFullYear()} Ali Alsawad.`}</span>
    </Text>
  </footer>
);
