import React from 'react'
import { Form, Input, InputNumber, Select } from 'antd'
import { Pos } from '../../types/Pos'

interface CellPosProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: keyof Pos
  title: any
  inputType: 'number' | 'text' | 'select'
  record: Pos
  index: number
  children: React.ReactNode
  penyuplay: any[]
}
const CellPos: React.FC<CellPosProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  penyuplay,
  ...restProps
}) => {
  console.log('editing:', editing)
  console.log('dataIndex:', dataIndex)
  console.log('title:', title)
  let inputNode: React.ReactNode = null

  if (editing) {
    if (inputType === 'select') {
      inputNode = (
        <Form.Item
          name={dataIndex}
          initialValue={record[dataIndex]}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children
                ? option.children
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                : false
            }
          ></Select>
        </Form.Item>
      )
    } else if (inputType === 'number') {
      inputNode = (
        <Form.Item
          name={dataIndex}
          initialValue={record[dataIndex]}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
      )
    } else {
      inputNode = (
        <Form.Item
          name={dataIndex}
          initialValue={record[dataIndex]}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          <Input />
        </Form.Item>
      )
    }
  }

  return <td {...restProps}>{inputNode || children}</td>
}

export default CellPos
