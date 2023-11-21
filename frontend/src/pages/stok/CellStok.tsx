import React from 'react'
import { Form, Input, InputNumber, Select } from 'antd'
import { Stok } from '../../types/Stok'

interface CellStokProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: keyof Stok
  title: any
  inputType: 'number' | 'text' | 'select'
  record: Stok
  index: number
  children: React.ReactNode
  stockist: any[]
}

const CellStok: React.FC<CellStokProps> = ({
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

export default CellStok
