import React from 'react'
import { Form, Input, InputNumber, Select } from 'antd'
import { Supplier } from '../../types/Supplier'

interface CellSupplierProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: keyof Supplier
  title: any
  inputType: 'number' | 'text' | 'select'
  record: Supplier
  index: number
  children: React.ReactNode
  suppliers: any[]
}

const CellSupplier: React.FC<CellSupplierProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  suppliers,
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
          {suppliers.map((supplier) => (
            <Select.Option key={supplier._id} value={supplier._id}>
              {supplier.nama_supplier}
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

export default CellSupplier
