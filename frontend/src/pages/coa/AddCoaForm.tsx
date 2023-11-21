import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select } from 'antd'
import { useGetCoasQuery, useAddCoaMutation } from '../../hooks/coaHooks'
import { Coa } from '../../types/coa'
import { useNavigate } from 'react-router-dom'
import { useGetKategoriAkunsQuery } from '../../hooks/kategoriAkunHooks'

interface AddCoaFormProps {
  onCloseModal?: () => void
}

const AddCoaForm: React.FC<AddCoaFormProps> = ({ onCloseModal = () => {} }) => {
  const [form] = Form.useForm()
  const { data: coas } = useGetCoasQuery()
  const { data: kategoriAkun } = useGetKategoriAkunsQuery()

  const addCoaMutation = useAddCoaMutation()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const handleAddCoa = () => {
    form.resetFields()
    setAdding(true)

    if (coas && Array.isArray(coas)) {
      const lastRecord = [...coas]
        .sort((a, b) => a.kode_akun.localeCompare(b.kode_akun))
        .pop()

      if (lastRecord) {
        const lastIdNumber = Number(lastRecord.kode_akun.replace(/[^0-9]/g, ''))
        const nextId = lastIdNumber + 1
        const paddedId = nextId.toString().padStart(5, '0')
        form.setFieldsValue({ kode_akun: `Coa-${paddedId}` })
      } else {
        form.setFieldsValue({ kode_akun: `Coa-00001` })
      }
    }
  }

  useEffect(() => {
    if (!adding) {
      handleAddCoa()
    }
  }, [adding, coas])

  const onFinish = async (values: any) => {
    try {
      const newCoa: Coa = {
        _id: values._id,
        kode_akun: values.kode_akun,
        nama_akun: values.nama_akun,
        kategori: values.kategori,
        deskripsi: values.deskripsi,
      }

      await addCoaMutation.mutateAsync(newCoa)

      handleAddCoa()

      setAdding(false)
      navigate('/akunlist')
      onCloseModal()
    } catch (error) {
      console.error('Error adding COA:', error)
    }
  }

  return (
    <Form
      form={form}
      name="addCoaForm"
      onFinish={onFinish}
      layout="vertical"
      style={{ borderRadius: 0 }}
    >
      <Form.Item
        name="nama_akun"
        label="Nama Akun"
        rules={[
          {
            required: true,
            message: 'Please input the name of the coa!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="kode_akun"
        label="Kode Akun"
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
        <Select
          showSearch
          style={{ width: '320px' }}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option?.children?.toString()
              ? option.children
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              : false
          }
        >
          {kategoriAkun?.map((e) => (
            <Select.Option key={e._id} value={e.kategori}>
              {e.kategori}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="deskripsi" label="Deskripsi">
        <Input.TextArea />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AddCoaForm
