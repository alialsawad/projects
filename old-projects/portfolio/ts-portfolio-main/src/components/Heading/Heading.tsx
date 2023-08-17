import { Fragment } from 'react';
import { classes } from 'utils/style';
import styles from './Heading.module.css';

interface HeadingProps {
  [key: string]: any;
  as?: string;
  children?: React.ReactNode;
  className?: string;
  level?: number;
  weight?: 'regular' | 'bold' | 'medium';
}

export const Heading = ({
  children,
  level = 1,
  as,
  align = 'auto',
  weight = 'medium',
  className = '',
  ...rest
}: HeadingProps) => {
  const clampedLevel = Math.min(Math.max(level, 0), 5);
  const Component = (as || `h${Math.max(clampedLevel, 1)}`) as React.ElementType;

  return (
    <Fragment>
      <Component
        className={classes(styles.heading, className)}
        data-align={align}
        data-weight={weight}
        data-level={clampedLevel}
        {...rest}
      >
        {children}
      </Component>
    </Fragment>
  );
};
