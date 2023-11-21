import React, { useState } from 'react'
import { Form, Input, Card, Button, Select, Row, Col } from 'antd'
import { useAddMultiMutation, useGetMultisQuery } from '../../hooks/multiHooks'
import { Multi } from '../../types/Multi'

import { Link, useNavigate } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'

const AddMultiForm: React.FC = () => {
  const [form] = Form.useForm()
  const { data: multisData, isLoading: isMultisLoading } = useGetMultisQuery()
  const { data, isLoading } = useGetMultisQuery()

  const [adding, setAdding] = useState(false)
  const addMultiMutation = useAddMultiMutation()
  const navigate = useNavigate()
  const handleAddMulti = () => {
    form.resetFields()
    setAdding(true)

    if (data && Array.isArray(data) && data.length > 0) {
      const lastRecord = [...data]
        .sort((a, b) => (a.id_multi || '').localeCompare(b.id_multi || ''))
        .pop()

      if (lastRecord) {
        const lastIdNumber = Number(lastRecord.id_multi.replace(/[^0-9]/g, ''))
        const nextId = lastIdNumber + 1
        const paddedId = nextId.toString().padStart(5, '0')
        form.setFieldsValue({ id_multi: `MUL-${paddedId}` })
      } else {
        form.setFieldsValue({ id_multi: `MUL-00001` })
      }
    }
  }

  React.useEffect(() => {
    if (!isLoading) {
      handleAddMulti()
    }
  }, [isLoading])

  const saveNewMulti = async () => {
    try {
      const row = (await form.validateFields()) as Multi
      const newMulti: Multi = {
        _id: row._id,
        id_multi: row.id_multi,
        id_data_barang: row.id_data_barang,
        id_harga: row.id_harga,
        harga_tertinggi: row.harga_tertinggi,
        harga_terendah: row.harga_terendah,
      }

      await addMultiMutation.mutateAsync(newMulti)
      setAdding(false)

      console.log()
      navigate('/multi')
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
          Tambah Multi
        </h2>
        <Form.Item
          name="id_multi"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the ID of the multi!',
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
          name="id_data_barang"
          label="Nama Barang"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the name of the multi!',
            },
          ]}
          style={{ marginTop: 30 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="id_harga"
          label="nama harga"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the nama harag of the multi!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="harga"
          label="nilai harga"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the kontak of the multi!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Row justify="center">
          <Col>
            <Button
              type="primary"
              onClick={saveNewMulti}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setAdding(false)
                navigate('/multi')
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

export default AddMultiForm
