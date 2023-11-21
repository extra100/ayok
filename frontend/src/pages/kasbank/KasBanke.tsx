import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select } from 'antd'

import { useNavigate } from 'react-router-dom'
import { useGetKategoriAkunsQuery } from '../../hooks/kategoriAkunHooks'
import {
  useAddKasBankMutation,
  useGetKasBanksQuery,
} from '../../hooks/kasBankHooks'
import { KasBank } from '../../types/KasBank'
import { useAddCoaMutation } from '../../hooks/coaHooks'

interface KasBankProps {
  onCloseModal?: () => void
}

const KasBanke: React.FC<KasBankProps> = ({ onCloseModal = () => {} }) => {
  const [form] = Form.useForm()
  const { data: coas } = useGetKasBanksQuery()
  const { data: kategoriAkun } = useGetKategoriAkunsQuery()

  const addKasBankMutation = useAddCoaMutation()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const handleAddKasBank = () => {
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
        form.setFieldsValue({ kode_akun: `KasBank-${paddedId}` })
      } else {
        form.setFieldsValue({ kode_akun: `KasBank-00001` })
      }
    }
  }

  useEffect(() => {
    if (!adding) {
      handleAddKasBank()
    }
  }, [adding, coas])

  const onFinish = async (values: any) => {
    try {
      const newKasBank: KasBank = {
        _id: values._id,
        kode_akun: values.kode_akun,
        nama_akun: values.nama_akun,
        kategori: values.kategori,
        deskripsi: values.deskripsi,
      }

      await addKasBankMutation.mutateAsync(newKasBank)

      handleAddKasBank()

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
      name="addKasBankForm"
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
          {kategoriAkun?.map((e) => {
            if (e.kategori === 'Kas & Bank') {
              return (
                <Select.Option key={e._id} value={e.kategori}>
                  {e.kategori}
                </Select.Option>
              )
            }
          })}
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

export default KasBanke
