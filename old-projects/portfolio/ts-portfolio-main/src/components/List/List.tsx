import { classes } from 'utils/style';
import styles from './List.module.css';

interface ListProps {
  className?: string;
  ordered?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}
export const List = ({ ordered, children, className = '', ...rest }: ListProps) => {
  const Element = ordered ? 'ol' : 'ul';

  return (
    <Element className={classes(styles.list, className)} {...rest}>
      {children}
    </Element>
  );
};

interface ListItemProps {
  children: React.ReactNode;
  [key: string]: any;
}
export const ListItem = ({ children, ...rest }: ListItemProps) => {
  return (
    <li className={styles.item} {...rest}>
      {children}
    </li>
  );
};
