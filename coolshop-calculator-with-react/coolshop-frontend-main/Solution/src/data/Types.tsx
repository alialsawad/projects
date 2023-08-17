export interface RowState {
  id: number
  value: number
  sign: string
  active: boolean
}
export interface RowProps {
  deleteRow: () => void
  updateRow: (data: Data) => void
  id: number
  value: number
  sign: string
  active: boolean
}

export interface State {
  rows: RowState[]
}

export interface Action {
  type: string
  payload?: any
}

export interface Data {
  sign?: string
  value?: string
  active?: boolean
}

export interface ButtonProps {
  children: React.ReactNode
  action: () => void
  className?: string
  iconName: string
}

export interface InputProps {
  type: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
  value: number
  className?: string
}

export interface SelectProps {
  options: string[]
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  value: string
  className?: string
}

export interface IconCollection {
  [key: string]: JSX.Element
}

export interface IconProps {
  name: string
  className?: string
}
