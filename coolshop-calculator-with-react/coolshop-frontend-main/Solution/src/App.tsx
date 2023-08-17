import { Data, RowState } from 'data/Types'
import React from 'react'
import { Button } from './components/Button/Button'
import { Row } from './components/Row/Row'
import { useCalculator } from './hooks/useCalculator'
// @ts-ignore
import styles from './App.module.css'

const App = () => {
  const { rows, total, addRow, deleteRow, updateRow } = useCalculator()
  return (
    <div className={styles.container}>
      {rows.map((row: RowState) => (
        <Row
          key={row.id}
          {...row}
          deleteRow={() => deleteRow(row.id)}
          updateRow={(data: Data) => updateRow(row.id, data)}
          value={row.value}
          sign={row.sign}
          active={row.active}
        />
      ))}

      <div className={styles.total} data-sign={total >= 0}>
        <Button className={styles.button} iconName="add" action={addRow}>
          Add row
        </Button>
        {total}
      </div>
    </div>
  )
}

export default App
