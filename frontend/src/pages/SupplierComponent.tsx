import React from 'react'
import { Form, Select } from 'antd'
import { useGetSuppliersQuery } from '../hooks/supplierHooks'
import { Supplier } from '../types/Supplier'

type SupplierComponentProps = {
  isEditing: boolean
  dapatkanSupById: Function
  supplier: Supplier
}

const SupplierComponent: React.FC<SupplierComponentProps> = ({
  isEditing,
  dapatkanSupById,
  supplier,
}) => {
  const { data: penyuplay, isLoading, isError } = useGetSuppliersQuery()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error occurred...</div>

  return (
    <div style={{ textAlign: 'center' }}>
      {isEditing ? (
        <Form.Item
          name="id_supplier"
          rules={[
            {
              required: true,
              message: 'Please select a supplier!',
            },
          ]}
        >
          <Select>
            {penyuplay.map((supplier: any) => (
              <Select.Option key={supplier._id} value={supplier._id}>
                {supplier.nama_supplier}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ) : (
        dapatkanSupById(supplier?.id_supplier)
      )}
    </div>
  )
}

export default SupplierComponent
