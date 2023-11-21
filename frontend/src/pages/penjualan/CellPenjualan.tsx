import React from 'react'
import { Form, Input, InputNumber, Select } from 'antd'
import { Penjualan } from '../../types/Penjualan'

interface CellPenjualanProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: keyof Penjualan
  title: any
  inputType: 'number' | 'text' | 'select'
  record: Penjualan
  index: number
  children: React.ReactNode
  penyuplay: any[]
}

const CellPenjualan: React.FC<CellPenjualanProps> = ({
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
  let inputNode: React.ReactNode

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
        >
          {/* {penyuplay.map((herge) => (
            <Select.Option key={herge._id} value={herge._id}>
              {herge.nama_supplier}
            </Select.Option>
          ))} */}
        </Select>
      </Form.Item>
    )
  } else if (inputType === 'number') {
    inputNode = <InputNumber />
  } else {
    inputNode = <Input />
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

export default CellPenjualan
