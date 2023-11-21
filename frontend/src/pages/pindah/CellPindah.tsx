import React from 'react'
import { Form, Input, InputNumber, Select } from 'antd'
import { Pindah } from '../../types/Pindah'

interface CellPindahProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: keyof Pindah
  title: any
  inputType: 'number' | 'text' | 'select'
  record: Pindah
  index: number
  children: React.ReactNode
  stockist: any[]
}

const CellPindah: React.FC<CellPindahProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  stockist,
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
          {stockist.map((stok) => (
            <Select.Option key={stok._id} value={stok._id}>
              {stok.nama_barang}
            </Select.Option>
          ))}
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

export default CellPindah
