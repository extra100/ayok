import React, { useState } from 'react'
import { Form, Input, Card, Button, Select, Row, Col } from 'antd'
import { useAddHargaMutation, useGetHargasQuery } from '../../hooks/hargaHooks'
import { useGetSuppliersQuery } from '../../hooks/supplierHooks'
import { Harga } from '../../types/Harga'
import { Supplier } from '../../types/Supplier'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'

const AddHargaForm: React.FC = () => {
  const [lekukan] = Form.useForm()
  const { data: suppliersData, isLoading: isSuppliersLoading } =
    useGetSuppliersQuery()

  const { data, isLoading } = useGetHargasQuery()

  const [adding, setAdding] = useState(false)
  const addHargaMutation = useAddHargaMutation()
  const navigate = useNavigate()
  const handleAddHarga = () => {
    lekukan.resetFields()
    setAdding(true)

    if (data && Array.isArray(data)) {
      const lastRecord = [...data]
        .sort((a, b) => a.id_harga.localeCompare(b.id_harga))
        .pop()

      if (lastRecord) {
        const lastIdNumber = Number(lastRecord.id_harga.replace(/[^0-9]/g, ''))
        const nextId = lastIdNumber + 1
        const paddedId = nextId.toString().padStart(5, '0')
        lekukan.setFieldsValue({ id_harga: `HAR-${paddedId}` })
      } else {
        lekukan.setFieldsValue({ id_harga: `HAR-00001` })
      }
    }
  }
  React.useEffect(() => {
    if (!isLoading) {
      handleAddHarga()
    }
  }, [isLoading])

  const saveNewHarga = async () => {
    try {
      const row = (await lekukan.validateFields()) as Harga
      const newHarga: Harga = {
        _id: row._id,
        id_harga: row.id_harga,
        jenis_harga: row.jenis_harga,
      }

      await addHargaMutation.mutateAsync(newHarga)
      setAdding(false)

      console.log()
      navigate('/harga')
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
          Tambah Harga
        </h2>
        <Form.Item
          name="id_harga"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the ID of the harga!',
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
          name="jenis_harga"
          label="Jenis Harga"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the name of the harga!',
            },
          ]}
          style={{ marginTop: 30 }}
        >
          <Input />
        </Form.Item>

        <Row justify="center">
          <Col>
            <Button
              type="primary"
              onClick={saveNewHarga}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setAdding(false)
                navigate('/harga')
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

export default AddHargaForm
