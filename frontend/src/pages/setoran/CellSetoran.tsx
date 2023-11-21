import React from 'react'
import { Form, Input, InputNumber, Select } from 'antd'
import { Setoran } from '../../types/Setoran'

interface CellSetoranProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: keyof Setoran
  title: any
  inputType: 'number' | 'text' | 'select'
  record: Setoran
  index: number
  children: React.ReactNode
  penyuplay: any[]
  bankir: any[]
  product: any[]
}

const CellSetoran: React.FC<CellSetoranProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  penyuplay,
  bankir,
  product,
  ...restProps
}) => {
  let inputNode: React.ReactNode

  if (inputType === 'select') {
    if (dataIndex === 'id_outlet' || dataIndex === 'tujuan_outlet') {
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
            {penyuplay.map((herge) => (
              <Select.Option key={herge._id} value={herge._id}>
                {herge.nama_outlet}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )
    } else if (dataIndex === 'dari_akun' || dataIndex === 'ke_akun') {
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
            {bankir.map((herge) => (
              <Select.Option key={herge._id} value={herge._id}>
                {herge.nama_bank}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )
    }
  } else if (dataIndex === 'id_data_barang') {
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
          {product.map((product) => (
            <Select.Option key={product._id} value={product._id}>
              {product.nama_barang}
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

export default CellSetoran
