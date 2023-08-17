import React from 'react'
import { Input, Select } from '../Inputs/Inputs'
import { Button } from '../Button/Button'
// @ts-ignore
import styles from './Row.module.css'
import { RowProps } from 'data/Types'

export const Row = ({ deleteRow, updateRow, value, sign, active }: RowProps) => {
  return (
    <div className={styles.row}>
      <Select options={['+', '-']} onChange={(e) => updateRow({ sign: e.target.value })} value={sign} />
      <Input type="number" onChange={(e) => updateRow({ value: e.target.value })} disabled={!active} value={value} />
      <div>
        <Button className={styles.delete} action={deleteRow} iconName="delete">
          Delete
        </Button>
        <Button
          className={active ? styles.active : styles.inactive}
          action={() => updateRow({ active: !active })}
          iconName={active ? 'enable' : 'disable'}>
          {active ? 'Enabled' : 'Disabled'}
        </Button>
      </div>
    </div>
  )
}
