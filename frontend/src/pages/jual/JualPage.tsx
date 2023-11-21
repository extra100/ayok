import React, { useState, useEffect } from 'react'
import { Col, Form, Select, Table } from 'antd'
import { Product } from '../../types/Product'
import { Jual } from '../../types/Jual'

import { useGetProductsQuery } from '../../hooks/productHooks'
import { useGetJualsQuery, useAddJualMutation } from '../../hooks/jualHooks'

const JualPage: React.FC = () => {
  const { data: products } = useGetProductsQuery()
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  )

  const { data: sales } = useGetJualsQuery()

  const addJualMutation = useAddJualMutation()

  useEffect(() => {
    if (products && products.length > 0) {
      setSelectedProductId(products[0]._id)
    }
  }, [products])

  useEffect(() => {
    if (selectedProductId) {
      const selectedProduct = products?.find(
        (product) => product._id === selectedProductId
      )
      if (selectedProduct) {
        const newSale: Jual = {
          _id: '', // Anda perlu memberikan ID yang unik di sini
          id_jual: '', // Anda perlu memberikan ID jual yang valid di sini
          id_data_barang: selectedProduct._id,
        }
        addJualMutation.mutate(newSale)
      }
    }
  }, [selectedProductId, products, addJualMutation])

  const columns = [
    {
      title: 'id_data_barang',
      dataIndex: 'id_data_barang',
    },
    {
      title: 'nama_barang',
      dataIndex: 'nama_barang',
    },
  ]

  return (
    <div>
      <Col>
        <Form.Item>
          <Select
            value={selectedProductId}
            onChange={(value) => setSelectedProductId(value)}
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
            style={{ marginRight: '10px', width: '320px' }}
          >
            {products?.map((product: Product) => (
              <Select.Option key={product._id} value={product._id}>
                {product.nama_barang}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Table dataSource={sales} columns={columns} rowKey="_id" />
      </Col>
    </div>
  )
}

export default JualPage
