import styles from './Table.module.css';

export interface TableProps {
  children: React.ReactNode;
}
export const Table = ({ children }: TableProps) => (
  <table className={styles.table}>{children}</table>
);

interface TableRowProps {
  children: React.ReactNode;
}
export const TableRow = ({ children }: TableRowProps) => (
  <tr className={styles.row}>{children}</tr>
);

interface TableHeadProps {
  children: React.ReactNode;
}
export const TableHead = ({ children }: TableHeadProps) => (
  <thead className={styles.head}>{children}</thead>
);

interface TableBodyProps {
  children: React.ReactNode;
}
export const TableBody = ({ children }: TableBodyProps) => (
  <tbody className={styles.body}>{children}</tbody>
);

interface TableHeadCellProps {
  children: React.ReactNode;
}
export const TableHeadCell = ({ children }: TableHeadCellProps) => (
  <th className={styles.headCell}>{children}</th>
);

interface TableCellProps {
  children: React.ReactNode;
}
export const TableCell = ({ children }: TableCellProps) => (
  <td className={styles.cell}>{children}</td>
);
