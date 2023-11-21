import React, { useState } from 'react'
import { Form, Input, Card, Button, Select, Row, Col } from 'antd'

import { Link, useNavigate } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'

import { Bank } from '../../types/Bank'
import { useAddBankMutation, useGetBanksQuery } from '../../hooks/bankHooks'

const AddBankForm: React.FC = () => {
  const [lekukan] = Form.useForm()

  const { data, isLoading } = useGetBanksQuery()

  const [adding, setAdding] = useState(false)
  const addBankMutation = useAddBankMutation()
  const navigate = useNavigate()
  const handleAddBank = () => {
    lekukan.resetFields()
    setAdding(true)

    if (data && Array.isArray(data)) {
      const lastRecord = [...data]
        .sort((a, b) => a.id_bank.localeCompare(b.id_bank))
        .pop()

      if (lastRecord) {
        const lastIdNumber = Number(lastRecord.id_bank.replace(/[^0-9]/g, ''))
        const nextId = lastIdNumber + 1
        const paddedId = nextId.toString().padStart(5, '0')
        lekukan.setFieldsValue({ id_bank: `Bnk-${paddedId}` })
      } else {
        lekukan.setFieldsValue({ id_bank: `Bnk-00001` })
      }
    }
  }
  React.useEffect(() => {
    if (!isLoading) {
      handleAddBank()
    }
  }, [isLoading])

  const saveNewBank = async () => {
    try {
      const row = (await lekukan.validateFields()) as Bank
      const newBank: Bank = {
        _id: row._id,

        id_bank: row.id_bank,
        nama_akun: row.nama_akun,
        no_rekening: row.no_rekening,
        ket: row.ket,
      }

      await addBankMutation.mutateAsync(newBank)
      setAdding(false)

      console.log()
      navigate('/bank')
    } catch (errInfo) {}
  }
  return (
    <Card
      style={{
        marginTop: '160px',
        width: '900px',
        marginLeft: '400px',
        position: 'relative',
      }}
    >
      <Form form={lekukan} component={false}>
        <h2
          style={{
            position: 'absolute',

            fontSize: 30,
            color: '',
          }}
        >
          Tambah Bank
        </h2>
        <Form.Item
          name="id_bank"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the ID of the bank!',
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
          name="nama_bank"
          label="nama_bank"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the name of the bank!',
            },
          ]}
          style={{ marginTop: 30 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="no_rekening"
          label="no_rekening"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the name of the bank!',
            },
          ]}
          style={{ marginTop: 30 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="ket"
          label="ket"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the address of the bank!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Row justify="center">
          <Col>
            <Button
              type="primary"
              onClick={saveNewBank}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setAdding(false)
                navigate('/bank')
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

export default AddBankForm
