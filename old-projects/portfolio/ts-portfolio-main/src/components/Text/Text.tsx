import { classes } from 'utils/style';
import styles from './Text.module.css';
import React, { FunctionComponent } from 'react';

interface Props {
  [key: string]: any;
  children?: React.ReactNode;
  size?: string;
  as?: typeof React.Component | string;
  align?: string;
  weight?: string;
  secondary?: boolean;
  className?: string;
}

export const Text: FunctionComponent<Props> = ({
  children,
  size = 'm',
  as: Component = 'span',
  align = 'auto',
  weight = 'auto',
  secondary,
  className = '',
  ...rest
}) => {
  return (
    <Component
      className={classes(styles.text, className)}
      data-align={align}
      data-size={size}
      data-weight={weight}
      data-secondary={secondary}
      {...rest}
    >
      {children}
    </Component>
  );
};
