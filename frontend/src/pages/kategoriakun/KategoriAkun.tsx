import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select } from 'antd'

import { useNavigate } from 'react-router-dom'
import {
  useAddKategoriAkunMutation,
  useGetKategoriAkunsQuery,
} from '../../hooks/kategoriAkunHooks'
import { KategoriAkun } from '../../types/KategoriAkun'

interface AddKategoriAkunProps {
  onCloseModal?: () => void
}

const AddKategoriAkun: React.FC<AddKategoriAkunProps> = ({
  onCloseModal = () => {},
}) => {
  const [form] = Form.useForm()
  const { data: katogriAkuns } = useGetKategoriAkunsQuery()
  const addKategoriAkunMutation = useAddKategoriAkunMutation()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const handleAddKategoriAkun = () => {
    form.resetFields()
    setAdding(true)

    if (katogriAkuns && Array.isArray(katogriAkuns)) {
      const lastRecord = [...katogriAkuns]
        .sort((a, b) =>
          a.kode_kategori_akun.localeCompare(b.kode_kategori_akun)
        )
        .pop()

      if (lastRecord) {
        const lastIdNumber = Number(
          lastRecord.kode_kategori_akun.replace(/[^0-9]/g, '')
        )
        const nextId = lastIdNumber + 1
        const paddedId = nextId.toString().padStart(5, '0')
        form.setFieldsValue({ kode_kategori_akun: `Kata-${paddedId}` })
      } else {
        form.setFieldsValue({ kode_kategori_akun: `Kata-00001` })
      }
    }
  }

  useEffect(() => {
    if (!adding) {
      handleAddKategoriAkun()
    }
  }, [adding, katogriAkuns])

  const onFinish = async (values: any) => {
    try {
      const newKategoriAkun: KategoriAkun = {
        _id: values._id,
        kode_kategori_akun: values.kode_kategori_akun,

        kategori: values.kategori,
      }

      await addKategoriAkunMutation.mutateAsync(newKategoriAkun)

      handleAddKategoriAkun()

      setAdding(false)
      navigate('/kategoriakunlist')
      onCloseModal()
    } catch (error) {
      console.error('Error adding COA:', error)
    }
  }

  return (
    <Form
      form={form}
      name="addKategoriAkunForm"
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="kode_kategori_akun"
        label="Kode Kategori AKun"
        rules={[
          {
            required: true,
            message: 'Please input the Kode of the coa!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="kategori"
        label="Kategori"
        rules={[
          {
            required: true,
            message: 'Please input the Deskripsi of the coa!',
          },
        ]}
        initialValue={''}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AddKategoriAkun
