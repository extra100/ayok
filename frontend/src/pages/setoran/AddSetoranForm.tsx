import React, { useState } from 'react'
import { Form, Input, Card, Button, Select, Row, Col } from 'antd'

import { Setoran } from '../../types/Setoran'
import { Outlet } from '../../types/Outlet'
import { Bank } from '../../types/Bank'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'
import {
  useAddSetoranMutation,
  useGetSetoransQuery,
} from '../../hooks/setoranHooks'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import { useGetBanksQuery } from '../../hooks/bankHooks'
import { Product } from '../../types/Product'
import { useGetProductsQuery } from '../../hooks/productHooks'

const AddSetoranForm: React.FC = () => {
  const [lekukan] = Form.useForm()
  const { data, isLoading } = useGetSetoransQuery()

  const { data: outletsData, isLoading: isOutletsLoading } =
    useGetoutletsQuery()
  const { data: banksData, isLoading: isBanksLoading } = useGetBanksQuery()
  const { data: productsData, isLoading: isProductsLoading } =
    useGetProductsQuery()

  const [adding, setAdding] = useState(false)
  const addSetoranMutation = useAddSetoranMutation()
  const navigate = useNavigate()
  const handleAddSetoran = () => {
    lekukan.resetFields()
    setAdding(true)

    if (data && Array.isArray(data)) {
      const lastRecord = [...data]
        .sort((a, b) => a.id_setoran.localeCompare(b.id_setoran))
        .pop()

      if (lastRecord) {
        const lastIdNumber = Number(
          lastRecord.id_setoran.replace(/[^0-9]/g, '')
        )
        const nextId = lastIdNumber + 1
        const paddedId = nextId.toString().padStart(5, '0')
        lekukan.setFieldsValue({ id_setoran: `Set-${paddedId}` })
      } else {
        lekukan.setFieldsValue({ id_setoran: `Set-00001` })
      }
    }
  }
  React.useEffect(() => {
    if (!isLoading) {
      handleAddSetoran()
    }
  }, [isLoading])

  const saveNewSetoran = async () => {
    try {
      const row = (await lekukan.validateFields()) as Setoran
      const newSetoran: Setoran = {
        _id: row._id,
        id_setoran: row.id_setoran,
        id_outlet: row.id_outlet,
        tujuan_outlet: row.tujuan_outlet,
        dari_akun: row.dari_akun,
        ke_akun: row.ke_akun,
        nilai: row.nilai,
        status: row.status,
        catatan: row.catatan,
        id_data_barang: row.id_data_barang,
      }

      await addSetoranMutation.mutateAsync(newSetoran)
      setAdding(false)

      console.log()
      navigate('/setoran')
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
            marginBottom: '10px',
            fontSize: 30,
            color: '',
          }}
        >
          Tambah Setoran
        </h2>

        <Col>
          <Form.Item
            name="dari_akun"
            label="Dari Bank"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            rules={[
              {
                required: true,
                message: 'Please select the Bank!',
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
              {banksData?.map((supplier: Bank) => (
                <Select.Option key={supplier._id} value={supplier._id}>
                  {supplier.nama_akun}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="ke_akun"
            label="Ke Bank"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            rules={[
              {
                required: true,
                message: 'Please select the Bank!',
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
              {banksData?.map((supplier: Bank) => (
                <Select.Option key={supplier._id} value={supplier._id}>
                  {supplier.nama_akun}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Form.Item
          name="status"
          label="status"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the address of the setoran!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Col>
          <Form.Item
            name="id_data_barang"
            label="nama barang"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            rules={[
              {
                required: true,
                message: 'Please select the Bank!',
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
                  : true
              }
              style={{ marginRight: '10px', width: '320px' }}
            >
              {productsData?.map((product: Product) => (
                <Select.Option key={product._id} value={product._id}>
                  {product.nama_barang}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Form.Item
          name="catatan"
          label="catatan"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the address of the setoran!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="nilai"
          label="nilai"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the address of the setoran!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="id_setoran"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the ID of the setoran!',
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
              name="id_outlet"
              label="Dari Outlet"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 16 }}
              rules={[
                {
                  required: true,
                  message: 'Please select the supplier!',
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
                {outletsData?.map((supplier: Outlet) => (
                  <Select.Option key={supplier._id} value={supplier._id}>
                    {supplier.nama_outlet}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="tujuan_outlet"
              label="Outlet Tujuan"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 16 }}
              rules={[
                {
                  required: true,
                  message: 'Please select the supplier!',
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
                {outletsData?.map((supplier: Outlet) => (
                  <Select.Option key={supplier._id} value={supplier._id}>
                    {supplier.nama_outlet}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Link to="/form-stok">
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

        <Row justify="center">
          <Col>
            <Button
              type="primary"
              onClick={saveNewSetoran}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setAdding(false)
                navigate('/setoran')
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

export default AddSetoranForm
