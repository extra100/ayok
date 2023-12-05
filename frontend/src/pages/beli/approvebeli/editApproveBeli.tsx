import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Menu,
  Select,
  Table,
} from 'antd'

import { v4 as uuidv4 } from 'uuid'

import moment from 'moment'

import { Link, useParams } from 'react-router-dom'
import {
  AiOutlineArrowLeft,
  AiOutlineDown,
  AiOutlineMore,
  AiOutlinePrinter,
  AiOutlineSave,
  AiOutlineShareAlt,
} from 'react-icons/ai'
import dayjs, { Dayjs } from 'dayjs'

import { parseInt } from 'lodash'

import Item from 'antd/es/list/Item'

import { useGetPembelianByIdQuery } from '../../../hooks/pembelianHooks'
import { Beli } from '../../../types/Beli'
import { useGetProductsQuery } from '../../../hooks/productHooks'
import { useGetoutletsQuery } from '../../../hooks/outletHooks'
import PosPrintKomponent from '../../printcoba/PosPrintKomponent'
import { useGetPajaksQuery } from '../../../hooks/pajakHooks'
import { Outlet } from '../../../types/Outlet'
import TagPage from '../../pos/TagPage'
import { useGetSuppliersQuery } from '../../../hooks/supplierHooks'
import {
  useAddApproveBeliMutation,
  useGetApproveBeliDetailQuery,
  useUpdateApproveBeliMutation,
} from '../../../hooks/approveBeliHooks'
import UserContext from '../../../contexts/UserContext'
import { useGetStoksQuery } from '../../../hooks/stokHooks'
import { ApproveBeli } from '../../../types/ApproveBeli'
import { useGetBeliDetailQuery } from '../../../hooks/beliHooks'

const EditApproveBeli: React.FC = (kledo: any) => {
  const { id_beli } = useParams<{ id_beli?: string }>()
  const AmbilData = !!id_beli
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = ''
  if (user) {
    idOutletLoggedIn = user.id_outlet
  }
  const { data: stokku } = useGetStoksQuery()

  const { data: getApproveBeliDetail } = useGetApproveBeliDetailQuery(
    id_beli as string
  )
  const { data: getBeliDetail } = useGetBeliDetailQuery(id_beli as string)

  const { data: getPembelianDetail } = useGetPembelianByIdQuery(
    id_beli as string
  )

  const [form] = Form.useForm()
  const [nilaiPiutang, setNilaiPiutang] = useState<any>(null)
  const [nilaiBayar, setNilaiBayar] = useState<any>(null)

  useEffect(() => {
    if (AmbilData && getPembelianDetail && getPembelianDetail.length > 0) {
      const nilaiTerhutang = parseFloat(getPembelianDetail[0]?.piutang)
      setNilaiPiutang(nilaiTerhutang)
    }
  }, [AmbilData, getPembelianDetail])
  useEffect(() => {
    if (AmbilData && getPembelianDetail && getPembelianDetail.length > 0) {
      const nilaiTerbayar = parseFloat(getPembelianDetail[0]?.bayar)
      setNilaiBayar(nilaiTerbayar)
    }
  }, [AmbilData, getPembelianDetail])

  useEffect(() => {
    if (AmbilData) {
      if (getApproveBeliDetail) {
        const formData = getApproveBeliDetail.reduce<{
          [key: string]: ApproveBeli
        }>((acc, curr) => {
          acc[curr._id] = {
            ...curr,
          }
          return acc
        }, {})

        setBelis(getApproveBeliDetail as any)

        form.setFieldsValue(formData)
      }

      if (getPembelianDetail && getPembelianDetail.length > 0) {
        setSelectedPelanganId(getPembelianDetail[0].id_supplier || null)
      }
      if (getPembelianDetail && getPembelianDetail.length > 0) {
        setTotalSemua(parseFloat(getPembelianDetail[0].total_semua) || null)
      }
    }
  }, [AmbilData, getApproveBeliDetail, getPembelianDetail, form])

  const [selectedOutletId, setSelectedOutletId] = useState('')
  const { data: products } = useGetProductsQuery()
  const { data: outletData } = useGetoutletsQuery()
  const [total_semua, setTotalSemua] = useState<number | null>(null)

  const menu = (
    <Menu key="1">
      <Menu.Item>
        <PosPrintKomponent />
      </Menu.Item>
      <Menu.Item key="2">pdf</Menu.Item>
    </Menu>
  )

  const [poss, setBelis] = useState<Beli[]>([])

  const generateInvoiceId = (): string => {
    if (AmbilData) {
      return id_beli
    }
    const uuid = uuidv4()
    const splitUUID = uuid.split('-')
    const lastPartOfUUID = splitUUID[splitUUID.length - 1]
    return `INV/${parseInt(lastPartOfUUID, 5)}`
  }
  const [currentIdBeli, setCurrentIdBeli] = useState(generateInvoiceId())

  const { data: suppliers } = useGetSuppliersQuery()
  const [selectedPelanganId, setSelectedPelanganId] = useState<string | null>(
    null
  )
  const currentDate = dayjs()
  const [startDate, setStartDate] = useState<Dayjs>(
    kledo.value ? dayjs(kledo.value) : currentDate
  )

  const handlePerubahanTanggal = (date: Dayjs | null, dateString: string) => {
    if (date) {
      setStartDate(date)
      if (kledo.onChange) {
        kledo.onChange(date.format('DD-MM-YYYY'))
      }
    }
  }

  const { mutate: simpanRetur } = useUpdateApproveBeliMutation()
  const [inputanQtyRetur, setInputanQtyRetur] = useState<{
    [key: string]: any
  }>({})
  const [tulakKepeng, setTulakKepeng] = useState<{ [key: string]: any }>({})

  const updateQtyBeri = (id: string, nilaiInputanKolomQtyRetur: any) => {
    if (!isNaN(nilaiInputanKolomQtyRetur)) {
      setInputanQtyRetur((prevState) => ({
        ...prevState,
        [id]: nilaiInputanKolomQtyRetur,
      }))

      const updatedData = poss?.map((item: any) => {
        if (item._id === id) {
          const hargaJual = parseFloat(item.harga_jual)
          const diskon = parseFloat(item.diskon)
          const qtyRetur = nilaiInputanKolomQtyRetur
          const uangRetur = qtyRetur * hargaJual - diskon
          const selectedPajak = pajaks?.find(
            (pajak) => pajak.jenis_pajak === item
          )

          setTulakKepeng((prevTulakKepeng) => ({
            ...prevTulakKepeng,
            [id]: uangRetur,
          }))
          item.uang_retur = uangRetur
        }
        return item
      })
      // setBelis(updatedData)
    }
  }

  const [returHarga, setReturHarga] = useState<{ [key: string]: any }>({})
  const [inputanHargaRetur, setInputanHargaRetur] = useState<{
    [key: string]: any
  }>({})
  const rubahReturHarga = (id: string, nilaiInputanKolomQtyRetur: any) => {
    if (!isNaN(nilaiInputanKolomQtyRetur)) {
      setInputanHargaRetur((prevState) => ({
        ...prevState,
        [id]: nilaiInputanKolomQtyRetur,
      }))

      const testes = poss?.map((item: any) => {
        if (item._id === id) {
          const tesReturHarga = nilaiInputanKolomQtyRetur
          const hargaRetur = tesReturHarga * 10
          setReturHarga((prevTulakKepeng) => ({
            ...prevTulakKepeng,
            [id]: hargaRetur,
          }))
          item.aaa = hargaRetur
        }
        return item
      })
      setBelis(testes)
    }
  }

  useEffect(() => {
    if (getApproveBeliDetail) {
      setBelis(getApproveBeliDetail as any)
    }
  }, [getApproveBeliDetail])

  const saveData = () => {
    const dataToSave = poss
      .filter((item) => tulakKepeng[item._id] > 0)

      .map((item) => ({
        id_data_barang: item.id_data_barang,
        id_beli: currentIdBeli,
        harga_jual: item.harga_jual,
        diskon: item.diskon,
        total: item.total,
        qty_diapprove: inputanQtyRetur[item._id],
        id_outlet: user?.id_outlet || '',

        id_satuan: returHarga[item._id] || 0,
        uang_retur: tulakKepeng[item._id],
      }))

    simpanRetur(dataToSave as any)
  }
  const { data: pajaks } = useGetPajaksQuery()

  const columns = [
    {
      title: 'Nama Barang',
      dataIndex: 'id_data_barang',
      key: 'nama_barang',
      render: (id_data_barang: string) => {
        const goods = products?.find((goods) => goods._id === id_data_barang)
        return goods ? goods.nama_barang : '-'
      },
    },
    {
      title: 'qty Faktur',
      dataIndex: 'qty_sold',
      key: 'qty_sold',
      render: (text: any, record: any) => (
        <Input
          defaultValue={
            AmbilData && getBeliDetail && getBeliDetail.length > 0
              ? record.qty_sold
              : undefined
          }
          readOnly
        />
      ),
    },
    {
      title: 'Harga Beli',
      dataIndex: 'harga_jual',
      key: 'harga_jual',
      render: (harga_jual: any) => <Input value={harga_jual} />,
    },
    {
      title: 'Qty Approve',
      dataIndex: 'qty_diapprove',
      key: 'qty_diapprove',
      render: (text: any, record: any) => (
        <Input
          value={text}
          onChange={(e: any) =>
            updateQtyBeri(record._id, parseInt(e.target.value || 0))
          }
        />
      ),
    },
    {
      title: 'Qty Approve',
      dataIndex: 'qty_diapprove',
      key: 'qty_diapprove',
      render: (text: any, record: any) => (
        <Input
          defaultValue={
            AmbilData && getApproveBeliDetail && getApproveBeliDetail.length > 0
              ? record.qty_diapprove
              : undefined
          }
          readOnly
        />
      ),
    },
    {
      title: 'Jenis Pajak',
      dataIndex: 'jenis_pajak',
      key: 'jenis_pajak',
      render: (text: any, record: any) => (
        <Select
          value={text}
          onChange={(value: any) => {
            const selectedPajak = pajaks?.find(
              (pajak) => pajak.jenis_pajak === value
            )
            if (selectedPajak) {
              updateQtyBeri(record._id, parseInt(selectedPajak.jumlah_pajak))
            }
          }}
        >
          {pajaks?.map((pajak) => (
            <Select.Option key={pajak._id} value={pajak.jenis_pajak}>
              {pajak.jenis_pajak}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Jumlah pajak',
      dataIndex: 'jumlah_pajak',
      key: 'jumlah_pajak',
      render: (text: any) => {
        if (text === null || text === undefined) {
          return 0
        }
        return text
      },
    },
    {
      title: 'Jumlah',
      dataIndex: 'total',
      key: 'total',
      render: (total: any) => <Input value={total} />,
    },
    {
      title: 'Uang Retur',
      dataIndex: 'uang_retur',
      key: 'uang_retur',
      render: (text: any) => {
        if (text === null || text === undefined) {
          return 0
        }
        return text
      },
    },
  ]

  return (
    <div
      className="radius"
      style={{
        border: '1px #f0f0f0 solid',
        padding: '15px',
        background: 'white',
      }}
    >
      <div style={{ border: '1px' }}>
        <div style={{ display: 'flex', marginBottom: 20 }}>
          <div
            style={{
              flex: '1',
              border: '1px solid white',
              flexBasis: '40%',
              textAlign: 'right',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <h1 style={{ fontSize: '2.5rem' }}>
                Detail Tagihan:{' '}
                {AmbilData &&
                getApproveBeliDetail &&
                getApproveBeliDetail.length > 0
                  ? getApproveBeliDetail[0]?.id_beli
                  : undefined}
              </h1>
            </div>
          </div>
          <div
            style={{
              flex: '1',
              border: '1px solid white',
              flexBasis: '40%',
              display: 'flex',
              justifyContent: 'right',
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <h1 style={{ fontSize: '1.5rem' }}></h1>
            </div>
          </div>
          <div
            style={{
              flex: '1',
              border: '1px solid white',
              flexBasis: '5%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                display: 'flex',

                background: '#eb9234',
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                width: '80%',
              }}
            >
              <AiOutlineArrowLeft />
              Kembali
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            borderTop: '1px #f0f0f0 solid',
            borderRight: '1px #f0f0f0 solid',
            borderLeft: '1px #f0f0f0 solid',
            padding: '15px',
          }}
        >
          <div
            style={{
              flex: '1',
              border: '1px solid white',
              flexBasis: '30%',
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'left', fontSize: '20px' }}>
              <h5
                className={
                  nilaiPiutang <= 0
                    ? 'lunas'
                    : nilaiBayar > 0
                    ? 'bayar-setengah'
                    : 'belum-bayar'
                }
              >
                {nilaiPiutang <= 0
                  ? 'Lunas'
                  : nilaiBayar > 0
                  ? 'Dibayar Sebagian'
                  : 'Belum Dibayar'}
              </h5>
            </div>
          </div>

          <div
            style={{
              flex: '1',
              border: '1px solid white',
              flexBasis: '40%',
              display: 'flex',
              justifyContent: 'right',
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <h1 style={{ fontSize: '1.5rem' }}></h1>
            </div>
          </div>

          <div
            style={{
              flex: '1',
              border: '1px solid white',
              flexBasis: '2%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                flex: '1',
                border: '1px solid #e9ecef',
                flexBasis: '2%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                height: '30px',
              }}
            >
              <Dropdown overlay={menu} placement="bottomRight">
                <a
                  style={{ textDecoration: 'none' }}
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  <div
                    style={{
                      flex: '1',

                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100px',
                      color: 'black',
                    }}
                  >
                    <AiOutlineShareAlt />
                    <div style={{ marginRight: '5px', marginLeft: '5px' }}>
                      Bagikan
                    </div>

                    <AiOutlineDown />
                  </div>
                </a>
              </Dropdown>
            </div>
          </div>
          <div
            style={{
              flex: '1',
              border: '1px solid white',
              flexBasis: '2%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                flex: '1',
                border: '1px solid #e9ecef',
                flexBasis: '2%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                height: '30px',
              }}
            >
              <Dropdown overlay={menu} placement="bottomRight">
                <a
                  style={{ textDecoration: 'none' }}
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  <div
                    style={{
                      flex: '1',

                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100px',
                      color: 'black',
                    }}
                  >
                    <AiOutlinePrinter />
                    <div style={{ marginRight: '5px', marginLeft: '5px' }}>
                      Print
                    </div>

                    <AiOutlineDown />
                  </div>
                </a>
              </Dropdown>
            </div>
          </div>
          <div
            style={{
              flex: '1',
              border: '1px solid white',
              flexBasis: '2%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                flex: '1',
                border: '1px solid white',
                flexBasis: '2%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <Dropdown overlay={menu} placement="bottomRight">
                <AiOutlineMore />
              </Dropdown>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px #f0f0f0 solid',
            borderBottom: '1px #f0f0f0 solid',
            borderLeft: '1px #f0f0f0 solid',
            borderRight: '1px #f0f0f0 solid',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
            }}
          >
            <div
              style={{
                flex: '1',
                flexBasis: '40%',
                textAlign: 'right',
                marginBottom: '16px',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <span>Nama Supplier</span>
                <br />
                <h5>
                  {AmbilData &&
                  getPembelianDetail &&
                  getPembelianDetail.length > 0 ? (
                    <Link
                      style={{ textDecoration: 'none' }}
                      to={`/customer/${getPembelianDetail[0]?.id_supplier}`}
                    >
                      {
                        suppliers?.find(
                          (outlet: any) =>
                            outlet._id === getPembelianDetail[0]?.id_supplier
                        )?.nama_supplier
                      }
                    </Link>
                  ) : undefined}
                </h5>
              </div>
            </div>
            <div
              style={{
                flex: '1',
                flexBasis: '40%',
                textAlign: 'right',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <span>Nomor</span>
                <br />
                <h5 style={{ fontSize: '1.25rem' }}>{currentIdBeli}</h5>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
            }}
          >
            <div
              style={{
                flex: '1',
                borderRadius: '0px 0px 0px',

                textAlign: 'right',
                marginBottom: '16px',
              }}
            >
              {/* <div style={{ textAlign: 'left' }}>
                <span>Tgl. Transaksi</span>
                <br />
                <div
                  style={{
                    textAlign: 'left',

                    borderRadius: '0px 0px 0px',
                    flex: '1',
                  }}
                >
                  <DatePindahForm
                    defaultValue={
                      AmbilData &&
                      getPembelianDetail &&
                      getPembelianDetail.length > 0
                        ? getPembelianDetail[0]?.tanggal_mulai
                        : undefined
                    }
                  />
                </div>
              </div> */}
            </div>
            <div style={{ flex: '1', textAlign: 'right' }}>
              <div style={{ textAlign: 'left' }}>
                <span>Tgl. Retur</span>
                <DatePicker
                  value={startDate as any}
                  onChange={handlePerubahanTanggal}
                  style={{ width: '100%' }}
                  disabled={user?.isAdmin}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
            }}
          >
            <div
              style={{
                flex: '1',
                flexBasis: '50%',
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'center',
              }}
            >
              <Form.Item
                style={{
                  textAlign: 'left',
                  flexBasis: '100%',
                  alignItems: 'center',
                  marginBottom: 0,
                  marginRight: 20,
                }}
                name="id_outlet"
                rules={[
                  {
                    required: true,
                    message: 'Please select the Nama Outlet!',
                  },
                ]}
              >
                <div className="my-select-container">
                  <span>Outlet</span>
                  <Select
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option?.children
                        ? option.children
                            .toString()
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        : false
                    }
                    disabled={!user?.isAdmin}
                    onChange={(value) => setSelectedOutletId(value)}
                    defaultValue={
                      AmbilData &&
                      getApproveBeliDetail &&
                      getApproveBeliDetail.length > 0
                        ? getApproveBeliDetail[0]?.id_outlet
                        : undefined
                    }
                  >
                    {outletData?.map((Itsonyou: Outlet) => (
                      <Select.Option key={Itsonyou._id} value={Itsonyou._id}>
                        {Itsonyou.nama_outlet}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </Form.Item>
            </div>

            <div
              style={{
                textAlign: 'left',
                flexBasis: '50%',
                alignItems: 'center',
                marginBottom: 0,
              }}
            >
              <div
                style={{
                  textAlign: 'left',
                  flexBasis: '100%',
                  alignItems: 'center',
                  marginBottom: 0,
                }}
              >
                <div className="my-select-container">
                  <span style={{ textAlign: 'left' }}>Tags</span>
                </div>
              </div>
            </div>
          </div>

          <Form form={form}>
            <Table
              style={{ borderRadius: '0 0 0 ' }}
              dataSource={poss}
              columns={columns}
              rowKey={(record) => record._id}
              pagination={false}
              rowClassName={() => 'testos'}
            />
          </Form>
        </div>

        <div style={{ border: '1px' }}>
          <div style={{ display: 'flex', padding: '20px' }}>
            <div
              style={{
                flex: '1',
                borderTop: '1px solid #f0f0f0',
                padding: '20px',

                borderRight: '1px solid #f0f0f0',
                borderBottom: '1px solid #f0f0f0',
                textAlign: 'right',
              }}
            >
              <div
                style={{
                  flex: '1',
                  flexBasis: '10px',
                  textAlign: 'right',
                }}
              >
                <div>
                  <Form.Item>
                    <Link to="/pembelian">
                      <Button
                        size="small"
                        type="primary"
                        style={{
                          background: '#0190fe',
                          width: '50%',
                          height: '2.2rem',
                          color: 'white',
                          borderRadius: '0px 0px 0px',
                          marginTop: '10px',
                        }}
                        onClick={saveData}
                      >
                        <AiOutlineSave
                          style={{ marginRight: 7, marginTop: -4 }}
                        />
                        Simpan
                      </Button>
                    </Link>
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditApproveBeli
