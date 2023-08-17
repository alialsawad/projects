import { Action, Data, RowState, State } from 'data/Types'
import { ACTIONS } from '../data/Actions'
import { useCallback, useMemo, useReducer } from 'react'

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.ADD_ROW:
      return {
        ...state,
        rows: [
          ...state.rows,
          {
            id: state.rows.length + 1,
            value: 0,
            sign: '+',
            active: true
          }
        ]
      }
    case ACTIONS.DELETE_ROW:
      return {
        ...state,
        rows: state.rows.filter((row) => row.id !== action.payload)
      }
    case ACTIONS.UPDATE_ROW:
      return {
        ...state,
        rows: state.rows.map((row) => {
          if (row.id === action.payload.id) {
            return {
              ...row,
              ...action.payload
            }
          }
          return row
        })
      }
    default:
      return state
  }
}

const initialState = {
  rows: [
    {
      id: 1,
      value: 0,
      sign: '+',
      active: true
    }
  ]
}

export const useCalculator = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { rows } = state

  const total = useMemo(
    () =>
      rows.reduce((acc: number, row: RowState) => {
        if (row.active) {
          return row.sign === '+' ? acc + Number(row.value) : acc - Number(row.value)
        }
        return acc
      }, 0),

    [rows]
  )

  const addRow = useCallback(() => {
    dispatch({ type: ACTIONS.ADD_ROW })
  }, [])

  const deleteRow = useCallback((id: number) => {
    dispatch({ type: ACTIONS.DELETE_ROW, payload: id })
  }, [])

  const updateRow = useCallback((id: number, data: Data) => {
    dispatch({ type: ACTIONS.UPDATE_ROW, payload: { id, ...data } })
  }, [])

  const value = useMemo(() => ({ rows, total, addRow, deleteRow, updateRow }), [rows, total, addRow, deleteRow, updateRow])

  return value
}
