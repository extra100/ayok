import { InputNumber } from 'antd'
import React from 'react'

interface IDRInputProps {
  onChange?: (value: number | string | null | undefined) => void
  disabled?: boolean
  value?: number | string | null
  style?: React.CSSProperties
  inputStyle?: React.CSSProperties
  addonAfter?: JSX.Element
  type?: string
  readOnly?: boolean
  target?: number | string | null
}

const IDRInput: React.FC<IDRInputProps> = ({
  onChange,
  style,
  inputStyle,
  ...props
}) => {
  const handleChange = (value: number | string | null | undefined) => {
    if (onChange) {
      onChange(value)
    }
  }

  const combinedStyle = { ...style, ...inputStyle }

  return (
    <InputNumber
      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
      parser={(value) => value?.replace(/\./g, '') || ''}
      onChange={handleChange}
      style={combinedStyle}
      {...props}
    />
  )
}

export default IDRInput
