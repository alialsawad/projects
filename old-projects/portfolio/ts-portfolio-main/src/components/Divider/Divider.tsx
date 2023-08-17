import { classes, cssProps, numToMs } from 'utils/style';
import styles from './Divider.module.css';

interface DividerProps {
  [key: string]: any;
  className?: string;
  lineWidth?: string;
  lineHeight?: string;
  notchWidth?: string;
  notchHeight?: string;
  collapsed?: boolean;
  collapseDelay?: number;
  style?: React.CSSProperties;
}
export const Divider = ({
  lineWidth = '100%',
  lineHeight = '2px',
  notchWidth = '90px',
  notchHeight = '10px',
  collapsed = false,
  collapseDelay = 0,

  className = '',
  style,
  ...rest
}: DividerProps) => (
  <div
    className={classes(styles.divider, className)}
    style={cssProps(
      {
        lineWidth: lineWidth,
        lineHeight: lineHeight,
        notchWidth: notchWidth,
        notchHeight: notchHeight,
        collapseDelay: numToMs(collapseDelay),
      },
      style
    )}
    {...rest}
  >
    <div className={styles.line} data-collapsed={collapsed} />
    <div
      className={styles.notch}
      data-collapsed={collapsed}
      style={cssProps({ collapseDelay: numToMs(collapseDelay + 160) })}
    />
  </div>
);
