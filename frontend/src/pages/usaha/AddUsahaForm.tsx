import React, { useState } from 'react'
import { Form, Input, Card, Button, Select, Row, Col } from 'antd'
import { useAddUsahaMutation, useGetUsahasQuery } from '../../hooks/usahaHooks'
import { Usaha } from '../../types/Usaha'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'

const AddUsahaForm: React.FC = () => {
  const [lekukan] = Form.useForm()

  const { data, isLoading } = useGetUsahasQuery()

  const [adding, setAdding] = useState(false)
  const addUsahaMutation = useAddUsahaMutation()
  const navigate = useNavigate()
  const handleAddUsaha = () => {
    lekukan.resetFields()
    setAdding(true)

    if (data && Array.isArray(data)) {
      const lastRecord = [...data]
        .sort((a, b) => a.id_usaha.localeCompare(b.id_usaha))
        .pop()

      if (lastRecord) {
        const lastIdNumber = Number(lastRecord.id_usaha.replace(/[^0-9]/g, ''))
        const nextId = lastIdNumber + 1
        const paddedId = nextId.toString().padStart(5, '0')
        lekukan.setFieldsValue({ id_usaha: `USA-${paddedId}` })
      } else {
        lekukan.setFieldsValue({ id_usaha: `USA-00001` })
      }
    }
  }
  React.useEffect(() => {
    if (!isLoading) {
      handleAddUsaha()
    }
  }, [isLoading])

  const saveNewUsaha = async () => {
    try {
      const row = (await lekukan.validateFields()) as Usaha
      const newUsaha: Usaha = {
        _id: row._id,
        id_usaha: row.id_usaha,
        nama_usaha: row.nama_usaha,
        alamat: row.alamat,
        kontak: row.kontak,
      }

      await addUsahaMutation.mutateAsync(newUsaha)
      setAdding(false)

      console.log()
      navigate('/usaha')
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
          Tambah Usaha
        </h2>
        <Form.Item
          name="id_usaha"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the ID of the usaha!',
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
          name="nama_usaha"
          label="Nama Usaha"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the name of the usaha!',
            },
          ]}
          style={{ marginTop: 30 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="alamat"
          label="Alamat"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the address of the usaha!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="kontak"
          label="Kontak"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the usaha of the usaha!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Row justify="center">
          <Col>
            <Button
              type="primary"
              onClick={saveNewUsaha}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setAdding(false)
                navigate('/usaha')
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

export default AddUsahaForm
