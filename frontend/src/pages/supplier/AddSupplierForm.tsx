import React, { useState } from 'react'
import { Form, Input, Card, Button, Select, Row, Col } from 'antd'
import {
  useAddSupplierMutation,
  useGetSuppliersQuery,
} from '../../hooks/supplierHooks'
import { Supplier } from '../../types/Supplier'

import { Link, useNavigate } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'

const AddSupplierForm: React.FC = () => {
  const [form] = Form.useForm()
  const { data: suppliersData, isLoading: isSuppliersLoading } =
    useGetSuppliersQuery()
  const { data, isLoading } = useGetSuppliersQuery()

  const [adding, setAdding] = useState(false)
  const addSupplierMutation = useAddSupplierMutation()
  const navigate = useNavigate()
  const handleAddSupplier = () => {
    form.resetFields()
    setAdding(true)

    if (data && Array.isArray(data)) {
      const lastRecord = [...data]
        .sort((a, b) => a.id_supplier.localeCompare(b.id_supplier))
        .pop()

      if (lastRecord) {
        const lastIdNumber = Number(
          lastRecord.id_supplier.replace(/[^0-9]/g, '')
        )
        const nextId = lastIdNumber + 1
        const paddedId = nextId.toString().padStart(5, '0')
        form.setFieldsValue({ id_supplier: `SUP-${paddedId}` })
      } else {
        form.setFieldsValue({ id_supplier: `SUP-00001` })
      }
    }
  }
  React.useEffect(() => {
    if (!isLoading) {
      handleAddSupplier()
    }
  }, [isLoading])

  const saveNewSupplier = async () => {
    try {
      const row = (await form.validateFields()) as Supplier
      const newSupplier: Supplier = {
        _id: row._id,
        id_supplier: row.id_supplier,
        nama_supplier: row.nama_supplier,
        alamat_supplier: row.alamat_supplier,
        kontak_supplier: row.kontak_supplier,
        id_harga: row.id_harga,
      }

      await addSupplierMutation.mutateAsync(newSupplier)
      setAdding(false)

      console.log()
      navigate('/supplier')
    } catch (errInfo) {}
  }
  return (
    <Card
      style={{
        marginTop: '160px',
        width: '600px',
        marginLeft: '400px',
        position: 'relative',
      }}
    >
      <Form form={form} component={false}>
        <h2
          style={{
            position: 'absolute',
            top: -10,
            left: -60,
            transform: 'rotate(-20deg)',
            marginBottom: '40px',
            fontSize: 30,
            color: '',
          }}
        >
          Tambah Supplier
        </h2>

        <Form.Item
          name="nama_supplier"
          label="Nama Supplier"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the name of the supplier!',
            },
          ]}
          style={{ marginTop: 30 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="alamat_supplier"
          label="alamat"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the alamat of the supplier!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="kontak_supplier"
          label="kontak"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the kontak of the supplier!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="id_supplier"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the ID of the supplier!',
            },
          ]}
          style={{ position: 'absolute', top: 0, right: -100 }}
        >
          <Input
            disabled
            style={{ border: 'none', backgroundColor: 'transparent' }}
          />
        </Form.Item>

        <Form.Item
          name="ket"
          label="Ktt"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the KEt of the supplier!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Row justify="center">
          <Col>
            <Button
              type="primary"
              onClick={saveNewSupplier}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setAdding(false)
                navigate('/supplier')
              }}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default AddSupplierForm
