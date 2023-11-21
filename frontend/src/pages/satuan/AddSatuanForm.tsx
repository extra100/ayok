import React, { useState } from 'react'
import { Form, Input, Card, Button, Select, Row, Col } from 'antd'
import {
  useAddSatuanMutation,
  useGetSatuansQuery,
} from '../../hooks/satuanHooks'

import { Satuan } from '../../types/Satuan'

import { Link, useNavigate } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'

const AddSatuanForm: React.FC = () => {
  const [form] = Form.useForm()

  const { data, isLoading } = useGetSatuansQuery()

  const [adding, setAdding] = useState(false)
  const addSatuanMutation = useAddSatuanMutation()
  const navigate = useNavigate()
  const handleAddSatuan = () => {
    form.resetFields()
    setAdding(true)

    if (data && Array.isArray(data)) {
      const lastRecord = [...data]
        .sort((a, b) => a.id_satuan.localeCompare(b.id_satuan))
        .pop()

      if (lastRecord) {
        const lastIdNumber = Number(lastRecord.id_satuan.replace(/[^0-9]/g, ''))
        const nextId = lastIdNumber + 1
        const paddedId = nextId.toString().padStart(5, '0')
        form.setFieldsValue({ id_satuan: `HAR-${paddedId}` })
      } else {
        form.setFieldsValue({ id_satuan: `HAR-00001` })
      }
    }
  }
  React.useEffect(() => {
    if (!isLoading) {
      handleAddSatuan()
    }
  }, [isLoading])

  const saveNewSatuan = async () => {
    try {
      const row = (await form.validateFields()) as Satuan
      const newSatuan: Satuan = {
        _id: row._id,
        id_satuan: row.id_satuan,
        nama_satuan: row.nama_satuan,
      }

      await addSatuanMutation.mutateAsync(newSatuan)
      setAdding(false)

      console.log()
      navigate('/satuan')
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
          Tambah Satuan
        </h2>

        <Form.Item
          name="nama_satuan"
          label="Nama Satuan"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the name of the satuan!',
            },
          ]}
          style={{ marginTop: 30 }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="id_satuan"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the ID of the satuan!',
            },
          ]}
          style={{ position: 'absolute', top: 0, right: -100 }}
        >
          <Input
            disabled
            style={{ border: 'none', backgroundColor: 'transparent' }}
          />
        </Form.Item>

        <Row justify="center">
          <Col>
            <Button
              type="primary"
              onClick={saveNewSatuan}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setAdding(false)
                navigate('/satuan')
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

export default AddSatuanForm
