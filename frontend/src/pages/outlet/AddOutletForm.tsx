import React, { useState } from 'react'
import { Form, Input, Card, Button, Select, Row, Col, message } from 'antd'
import {
  useAddoutletMutation,
  useGetoutletsQuery,
  useUpdateoutletMutation,
} from '../../hooks/outletHooks'
import { Outlet } from '../../types/Outlet'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'
import { useGetProductsQuery } from '../../hooks/productHooks'
import {
  useAddStokMutation,
  useUpdateStokMutation,
  useUpdateStokMutations,
} from '../../hooks/stokHooks'
import { Collection } from 'mongoose'
const AddOutletForm: React.FC = () => {
  const [lekukan] = Form.useForm()
  const { data, isLoading } = useGetoutletsQuery()
  const [adding, setAdding] = useState(false)
  const addOutletMutation = useAddoutletMutation()
  const { data: products } = useGetProductsQuery()

  const addStok = useAddStokMutation()
  const navigate = useNavigate()
  const handleAddOutlet = () => {
    lekukan.resetFields()
    setAdding(true)
    if (data && Array.isArray(data)) {
      const lastRecord = [...data]
        .sort((a, b) => a.id_outlet.localeCompare(b.id_outlet))
        .pop()

      if (lastRecord) {
        const lastIdNumber = Number(lastRecord.id_outlet.replace(/[^0-9]/g, ''))
        const nextId = lastIdNumber + 1
        const paddedId = nextId.toString().padStart(5, '0')
        lekukan.setFieldsValue({ id_outlet: `OTL-${paddedId}` })
      } else {
        lekukan.setFieldsValue({ id_outlet: `OTL-00001` })
      }
    }
  }

  React.useEffect(() => {
    if (!isLoading) {
      handleAddOutlet()
    }
  }, [isLoading])

  const saveNewOutlet = async () => {
    try {
      const row = (await lekukan.validateFields()) as Outlet
      const newOutlet: Outlet = { ...row }
      const createdOutlet = await addOutletMutation.mutateAsync(newOutlet)

      const outletId = createdOutlet.data._id

      if (products && products.length) {
        const newStoks = products.map((product: any) => ({
          _id: '',
          id_stok: '0',
          id_usaha: '0',
          id_data_barang: product._id,
          id_outlet: outletId,
          jumlah_stok: 100,
        }))

        for (let stok of newStoks) {
          await addStok.mutateAsync(stok)
        }
        message.success('Stock added successfully!')
      }

      setAdding(false)
      navigate('/outlet')
    } catch (errInfo) {}
  }
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available.</div>
  }

  const lastId = data[data.length - 1]._id

  return (
    <Card
      style={{
        marginTop: '160px',
        width: '600px',
        marginLeft: '400px',
        position: 'relative',
      }}
    >
      <Form form={lekukan} component={false}>
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
          Tambah Outlet
        </h2>
        <Form.Item
          name="id_outlet"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the ID of the outlet!',
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
          name="nama_outlet"
          label="Nama Outlet"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the name of the outlet!',
            },
          ]}
          style={{ marginTop: 30 }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="bm"
          label="bm"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the BM of the outlet!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lokasi"
          label="lokasi"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the Lokasi of the outlet!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="cp"
          label="cp"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the cp of the outlet!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Row justify="center">
          <Col>
            <Button
              type="primary"
              onClick={saveNewOutlet}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setAdding(false)
                navigate('/outlet')
              }}
            >
              Cancel
            </Button>
            <span>Last _id: {lastId}</span>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}
export default AddOutletForm
