import React, { useContext, useState } from 'react'
import { Form, Input, Card, Button, Select, Row, Col } from 'antd'
import { useAddStokMutation, useGetStoksQuery } from '../../hooks/stokHooks'
import { Stok } from '../../types/Stok'

import {
  useAddProductMutation,
  useGetProductsQuery,
} from '../../hooks/productHooks'
import { Product } from '../../types/Product'

import { Link, useNavigate } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'
import { Outlet } from '../../types/Outlet'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import UserContext from '../../contexts/UserContext'

const AddStokForm: React.FC = () => {
  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  if (user) {
  }
  const [lekukan] = Form.useForm()
  const { data, isLoading } = useGetStoksQuery()
  const { data: outlets } = useGetoutletsQuery()
  const [adding, setAdding] = useState(false)
  const addStokMutation = useAddStokMutation()
  const { data: productsData, isLoading: isProductsLoading } =
    useGetProductsQuery()

  const navigate = useNavigate()
  const handleAddStok = () => {
    lekukan.resetFields()
    setAdding(true)
    if (data && Array.isArray(data)) {
      const lastRecord = [...data]
        .sort((a, b) => a.id_stok.localeCompare(b.id_stok))
        .pop()

      if (lastRecord) {
        const lastIdNumber = Number(lastRecord.id_stok.replace(/[^0-9]/g, ''))
        const nextId = lastIdNumber + 1
        const paddedId = nextId.toString().padStart(5, '0')
        lekukan.setFieldsValue({ id_stok: `PLN-${paddedId}` })
      } else {
        lekukan.setFieldsValue({ id_stok: `PLN-00001` })
      }
    }
  }
  React.useEffect(() => {
    if (!isLoading) {
      handleAddStok()
    }
  }, [isLoading])

  const saveNewStok = async () => {
    try {
      const row = (await lekukan.validateFields()) as Stok
      const newStok: Stok = {
        _id: row._id,
        id_stok: row.id_stok,
        jumlah_stok: row.jumlah_stok,
        id_data_barang: row.id_data_barang,
        id_outlet: row.id_outlet,
        id_usaha: row.id_usaha,
      }
      await addStokMutation.mutateAsync(newStok)
      setAdding(false)

      navigate('/Stok')
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
          Tambah Stok
        </h2>
        <Form.Item
          name="id_stok"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the ID of the Stok!',
            },
          ]}
          style={{ position: 'absolute', top: 0, right: -100 }}
        >
          <Input
            disabled
            style={{ border: 'none', backgroundColor: 'transparent' }}
          />
        </Form.Item>
        <Row>
          <Col>
            <Form.Item
              name="id_data_barang"
              label="Nama Barang"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 16 }}
              rules={[
                {
                  required: true,
                  message: 'Please select the Nama Barang!',
                },
              ]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children
                    ? option.children
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    : false
                }
                style={{ marginRight: '10px', width: '320px' }}
              >
                {productsData?.map((Itsonyou: Product) => (
                  <Select.Option key={Itsonyou._id} value={Itsonyou._id}>
                    {Itsonyou.nama_barang}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Link to="/form-outlet">
              <Button
                icon={<AiOutlinePlus />}
                style={{
                  background: 'transparent',
                  marginLeft: 6,
                }}
              />
            </Link>
          </Col>
        </Row>
        <Form.Item
          name="jumlah_stok"
          label="Jumlah Stok"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the Jumlah of the Stok!',
            },
          ]}
          style={{ marginTop: 5 }}
        >
          <Input />
        </Form.Item>
        <Col>
          <Form.Item
            name="id_outlet"
            label="Nama Outlet"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            rules={[
              {
                required: true,
                message: 'Please select the Nama Outlet!',
              },
            ]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children
                  ? option.children
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  : false
              }
              style={{ marginRight: '10px', width: '320px' }}
              defaultValue={user?.id_outlet}
              disabled={!user?.isAdmin}
            >
              {outlets?.map((Itsonyou: Outlet) => (
                <Select.Option key={Itsonyou._id} value={Itsonyou._id}>
                  {Itsonyou.nama_outlet}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Form.Item
          name="id_usaha"
          label="Usha"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the ushaha of the Stok!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Row justify="center">
          <Col>
            <Button
              type="primary"
              onClick={saveNewStok}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setAdding(false)
                navigate('/Stok')
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
export default AddStokForm
