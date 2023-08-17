import { useEffect, useRef, useState } from 'react';
import { classes, cssProps } from 'utils/style';
import styles from './TextArea.module.css';

interface TextAreaProps {
  [key: string]: any;
  className?: string;
  resize?: string;
  value?: string;
  onChange: any;
  minRows?: number;
  maxRows?: number;
}

export const TextArea = ({
  className = '',
  resize = 'none',
  value,
  onChange,
  minRows = 1,
  maxRows,
  ...rest
}: TextAreaProps) => {
  const [rows, setRows] = useState(minRows);
  const [textareaDimensions, setTextareaDimensions] = useState({
    lineHeight: 0,
    paddingHeight: 0,
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const style = getComputedStyle(textareaRef.current as Element);
    const lineHeight = parseInt(style.lineHeight, 10);
    const paddingHeight =
      parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10);
    setTextareaDimensions({ lineHeight, paddingHeight });
  }, []);

  interface handleChange {
    (e: React.ChangeEvent<HTMLTextAreaElement>): void;
  }
  const handleChange: handleChange = event => {
    onChange(event);

    const { lineHeight, paddingHeight } = textareaDimensions;
    const previousRows = event.target.rows;
    event.target.rows = minRows;

    const currentRows = ~~((event.target.scrollHeight - paddingHeight) / lineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (maxRows && currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }

    setRows(maxRows && currentRows > maxRows ? maxRows : currentRows);
  };

  return (
    <textarea
      className={classes(styles.textarea, className)}
      ref={textareaRef}
      onChange={handleChange}
      style={cssProps({ resize })}
      rows={rows}
      value={value}
      {...rest}
    />
  );
};
