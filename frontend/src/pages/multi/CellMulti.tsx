import React from 'react'
import { Form, Input, InputNumber, Select } from 'antd'
import { Multi } from '../../types/Multi'

interface CellMultiProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: keyof Multi
  title: any
  inputType: 'number' | 'text' | 'select'
  record: Multi
  index: number
  children: React.ReactNode
  price: any[]
  outlet: any[]
  struggle: any[]
}

const CellMulti: React.FC<CellMultiProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  price,
  outlet,
  struggle,

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
          {dataIndex === 'id_harga' &&
            price.map((yanglain) => (
              <Select.Option key={yanglain._id} value={yanglain._id}>
                {yanglain.jenis_harga}
              </Select.Option>
            ))}
          {dataIndex === 'id_data_barang' &&
            outlet.map((bebaslah) => (
              <Select.Option key={bebaslah._id} value={bebaslah._id}>
                {bebaslah.nama_barang}
              </Select.Option>
            ))}
          {dataIndex === 'id_harga' &&
            struggle.map((keepFighting) => (
              <Select.Option key={keepFighting._id} value={keepFighting._id}>
                {keepFighting.jenis_harga}
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

export default CellMulti
