import React, { useContext, useEffect, useState } from 'react'
import {
  Form,
  Input,
  Card,
  Button,
  Select,
  Row,
  Col,
  Table,
  DatePicker,
  Tooltip,
  Dropdown,
  Divider,
  Collapse,
  Menu,
} from 'antd'
import { Pindah } from '../../types/Pindah'
import {
  useAddPindahMutation,
  useGetPindahDetailQuery,
  useGetPindahsQuery,
} from '../../hooks/pindahHooks'
import UserContext from '../../contexts/UserContext'
import { Outlet } from '../../types/Outlet'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import {
  AiOutlineArrowLeft,
  AiOutlineDown,
  AiOutlineMore,
  AiOutlinePlus,
  AiOutlinePrinter,
  AiOutlineShareAlt,
} from 'react-icons/ai'
import { Product } from '../../types/Product'
import { useGetProductsQuery } from '../../hooks/productHooks'
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import dayjs from 'dayjs'
import { Dayjs } from 'dayjs'
import { useGetStoksQuery } from '../../hooks/stokHooks'
import { size } from 'lodash'
import { useAddKopiPindahMutation } from '../../hooks/kopiPindahHooks'
import DateCicil from '../DateCicilan'
import TagPage from '../pos/TagPage'
import PurePanel from 'antd/es/tooltip/PurePanel'
import TextArea from 'antd/es/input/TextArea'
import PosPrintKomponent from '../printcoba/PosPrintKomponent'

const AddPindahFormKledo: React.FC = () => {
  const { id_pindah } = useParams<{ id_pindah?: string }>()

  const userContext = useContext(UserContext)

  const { user } = userContext || {}

  let native = ''

  if (user) {
    native = user.id_outlet
  }
  const AmbilData = !!id_pindah
  const { data: getPindahDetail } = useGetPindahDetailQuery(id_pindah as string)
  const onChange = (key: string | string[]) => {}
  const text = ''
  const [ket, setKet] = useState('')
  const menu = (
    <Menu key="1">
      <Menu.Item>
        <PosPrintKomponent />
      </Menu.Item>
      <Menu.Item key="2">pdf</Menu.Item>
    </Menu>
  )
  const { Panel } = Collapse

  const { data, isLoading } = useGetPindahsQuery()
  const [adding, setAdding] = useState(false)
  const [dataRows, setDataRows] = useState<Pindah[]>([])

  const { data: outlets } = useGetoutletsQuery()
  const [selectedOutletId, setSelectedOutletId] = useState('')

  const { data: stoks } = useGetStoksQuery()
  const { data: productsData, isLoading: isProductsLoading } =
    useGetProductsQuery()
  const [lekukan] = Form.useForm()
  const [selectGuess, setSelectGuess] = useState<string | undefined>(undefined)
  const [selectOut, seteSelectOut] = useState<string | undefined>(undefined)
  const [hasError, setHasError] = useState(false)

  const [selectGoods, setSelectGoods] = useState<{
    [key: string]: string | undefined
  }>({})

  const [selectStok, setSelectStok] = useState<{ [key: string]: number }>({})
  const [selectGoodsMap, setSelectGoodsMap] = useState<{
    [key: string]: string | undefined
  }>({})

  const location = useLocation()
  const { aneh } = location.state

  useEffect(() => {
    setSelectedTanggal(dayjs())
  }, [])
  const [tag, setTag] = useState('')
  const teguh = tag
  console.log('coba teg', teguh)

  const [selectedTanggal, setSelectedTanggal] = useState<Dayjs | null>()
  const handleAddRow = () => {
    const newRow: Pindah = {
      _id: Date.now().toString(),
      id_pindah: aneh,
      id_data_barang: '',
      id_outlet_dari: '',
      id_outlet_tujuan: '',
      tanggal: selectedTanggal?.format('DD-MM-YYYY') ?? '',
      qty_minta: 0,
      qty_beri: 0,
      sisa_minta: 0,
      ket: '0',
      tag: '0',
    }
    setDataRows([...dataRows, newRow])
  }
  const addPindahMutation = useAddPindahMutation()
  const addKopiPindah = useAddKopiPindahMutation()
  const handleSave = async () => {
    try {
      const newDataRows = [...dataRows]
      for (const row of newDataRows) {
        const newPindah: Pindah = {
          _id: row._id,
          id_pindah: aneh,
          qty_minta: row.qty_minta,
          qty_beri: row.qty_beri,
          sisa_minta: row.qty_minta,
          id_data_barang: row.id_data_barang,
          id_outlet_dari: user?.id_outlet ?? '',
          id_outlet_tujuan: selectOut || '',
          tanggal: selectedTanggal?.format('DD-MM-YYYY') ?? '',
          ket: row.ket,
          tag: '0',
        }
        await addPindahMutation.mutateAsync(newPindah)
        await addKopiPindah.mutateAsync(newPindah as any)
      }
      setAdding(false)
    } catch (errInfo) {}
  }

  const handleRemoveRow = (index: number) => {
    const newData = [...dataRows]
    newData.splice(index, 1)
    setDataRows(newData)
  }

  const handleProductNameChange = (index: number, value: string) => {
    const newDataRows = [...dataRows]
    newDataRows[index].id_data_barang = value
    setDataRows(newDataRows)
    setSelectGoods((prevSelectGoodsMap) => ({
      ...prevSelectGoodsMap,
      [dataRows[index]._id]: value,
    }))
  }

  const handleUnSelectcoloumn = (
    index: number,
    field: string,
    value: string
  ) => {
    const newDataRows = [...dataRows]
    newDataRows[index][field] = value
    setDataRows(newDataRows)
  }

  useEffect(() => {
    if (selectGoods && user) {
      setSelectGuess(user.id_outlet)
    }
  }, [selectGoods, user])

  useEffect(() => {
    if (selectGoods && selectGuess) {
      const newSelectStok = { ...selectStok }

      dataRows.forEach((row) => {
        const gabunganGuess = stoks?.find(
          (stok) =>
            stok.id_data_barang === selectGoods[row._id] &&
            stok.id_outlet === selectGuess
        )
        const stokValueGuess = gabunganGuess ? gabunganGuess.jumlah_stok : 0

        row.id_outlet_dari = stokValueGuess.toString()

        newSelectStok[row._id] = stokValueGuess
      })

      setSelectStok(newSelectStok)
    } else {
      setSelectStok((prevStok) => ({
        ...prevStok,
        [selectGuess || '']: 0,
      }))
    }
  }, [selectGoods, selectGuess, stoks, dataRows])

  useEffect(() => {
    if (selectGoods && selectOut) {
      const newSelectStok = { ...selectStok }

      dataRows.forEach((row) => {
        const gabunganGuess = stoks?.find(
          (stok) =>
            stok.id_data_barang === selectGoods[row._id] &&
            stok.id_outlet === selectOut
        )
        const stokValueGuess = gabunganGuess ? gabunganGuess.jumlah_stok : 0

        row.id_outlet_tujuan = stokValueGuess.toString()

        newSelectStok[row._id] = stokValueGuess
      })

      setSelectStok(newSelectStok)
    } else {
      setSelectStok((prevStok) => ({
        ...prevStok,
        [selectOut || '']: 0,
      }))
    }
  }, [selectGoods, selectOut, stoks, dataRows])

  const columns = [
    {
      title: 'Nama Barang',
      dataIndex: 'id_data_barang',
      key: 'id_data_barang',
      render: (text: string, record: Pindah, index: number) => (
        <>
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
            onChange={(value) => handleProductNameChange(index, value)}
            value={selectGoodsMap[record.id_data_barang] || undefined}
          >
            {productsData?.map((product: Product, index: number) => (
              <Select.Option key={`product_${product._id}`} value={product._id}>
                {product.nama_barang}
              </Select.Option>
            ))}
          </Select>
        </>
      ),
    },
    {
      title: 'Outlet',
      dataIndex: 'stok_terkini',
      key: 'stok_terkini',
      render: (text: string, record: Pindah, index: number) => (
        <>
          <span
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '120px',
            }}
          >
            <span>
              {outlets?.find((Itsonyou) => Itsonyou._id === selectGuess)
                ?.nama_outlet || ''}
            </span>
          </span>

          <span
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '120px',
            }}
          >
            <span>
              {outlets?.find((Itsonyou) => Itsonyou._id === selectOut)
                ?.nama_outlet || ''}
            </span>
          </span>
        </>
      ),
    },
    {
      title: 'Before',
      dataIndex: 'stok_terkini',
      key: 'stok_terkini',

      render: (text: string, record: Pindah, index: number) => {
        return (
          <>
            <span
              style={{
                width: '40px',
                display: 'inline-block',
                textAlign: 'center',
                // backgroundColor: 'lightGreen',
                borderRadius: 10,
                color: 'black',
              }}
            >
              {record.id_outlet_dari}
            </span>
            <span
              style={{
                width: '40px',
                display: 'inline-block',
                textAlign: 'center',
                // backgroundColor: 'lightGreen',
                borderRadius: 10,
                color: 'black',
              }}
            >
              {record.id_outlet_tujuan}
            </span>
          </>
        )
      },
    },

    {
      title: 'After',
      dataIndex: 'stok_terkini',
      key: 'stok_terkini',
      render: (text: string, record: Pindah, index: number) => {
        const newIdOutletDari =
          Number(record.id_outlet_dari) - Number(record.qty_minta)
        const newIdOutletTujuan =
          Number(record.id_outlet_tujuan) + Number(record.qty_minta)

        return (
          <>
            <span
              style={{
                width: '40px',

                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              {newIdOutletDari}
            </span>
            <span
              style={{
                width: '40px',

                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              {newIdOutletTujuan}
            </span>
          </>
        )
      },
    },

    {
      title: 'Minta',
      dataIndex: 'qty_minta',
      key: 'qty_minta',
      render: (text: string, record: Pindah, index: number) => {
        const cui = stoks?.find(
          (product) =>
            product.id_data_barang === record.id_data_barang &&
            product.id_outlet === native
        )
        const stokCount = cui ? cui.jumlah_stok : 0
        return (
          <Form.Item
            style={{ marginBottom: 0 }}
            name={[record._id, 'qty_minta']}
            rules={[
              {
                required: true,
                message: 'Masukkan Data!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const qtyInput = parseInt(value, 10)

                  if (!qtyInput) {
                    setHasError(true)
                    return Promise.reject(new Error('Jumlah Kosong!'))
                  }

                  if (qtyInput > stokCount) {
                    setHasError(true)
                    return Promise.reject(new Error('> stok!'))
                  }

                  setHasError(false)
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input
              defaultValue={String(record.qty_minta)}
              onChange={(e) =>
                handleUnSelectcoloumn(index, 'qty_minta', e.target.value)
              }
              style={{ width: 100 }}
            />
          </Form.Item>
        )
      },
    },
    {
      title: 'Ket',
      dataIndex: 'ket',
      key: 'ket',

      render: (text: string, record: Pindah, index: number) => (
        <Input
          value={text}
          style={{ width: 150 }}
          onChange={(e) => handleUnSelectcoloumn(index, 'ket', e.target.value)}
        />
      ),
    },
    {
      title: 'Satuan',
      dataIndex: 'satuan',
      key: 'satuan',

      render: (text: string, record: Pindah, index: number) => (
        <Input
          value={text}
          style={{ width: 100 }}
          onChange={(e) =>
            handleUnSelectcoloumn(index, 'satuan', e.target.value)
          }
        />
      ),
    },
    {
      title: 'Aksi',
      key: 'actions',
      render: (text: string, record: Pindah, index: number) => (
        <Button type="link" onClick={() => handleRemoveRow(index)}>
          Batal
        </Button>
      ),
    },
  ]

  return (
    <div
      style={{
        border: '0 #f0f0f0 solid',

        padding: '30px',
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
              <h1 style={{ fontSize: '2.5rem' }}>Tambah Mutasi</h1>
            </div>
          </div>

          <div
            style={{
              flex: '1',
              flexBasis: '40%',
              display: 'flex',
              justifyContent: 'right',
              alignItems: 'center',
            }}
          >
            <Form.Item
              className="ant-select-selector"
              style={{
                textAlign: 'right',
                flexBasis: '80%',
                alignItems: 'center',
                marginBottom: 0,
              }}
              name="id_outlet"
              rules={[
                {
                  required: true,
                  message: 'Please select the Nama Outlet!',
                },
              ]}
            >
              <div className="ant-select-show-searchr">
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
                  onChange={(value) => setSelectGuess(value)}
                  value={selectGuess}
                  defaultValue={user?.id_outlet}
                >
                  {outlets?.map((Itsonyou: Outlet) => (
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
              <h5>
                {AmbilData && getPindahDetail && getPindahDetail.length > 0
                  ? getPindahDetail[0]?.sisa_minta <= 0
                    ? 'Lunas'
                    : getPindahDetail[0]?.qty_beri > 0
                    ? 'Dibayar Sebagian'
                    : 'Belum Dibayar'
                  : undefined}
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
                textAlign: 'left',
                // marginBottom: '16px',
              }}
            >
              <div style={{ marginBottom: '8px' }}>Outlet Tujuan</div>

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
                style={{ marginRight: '10px', width: '84%' }}
                onChange={(value) => seteSelectOut(value)}
                value={selectOut}
              >
                {outlets?.map(
                  (Itsonyou: Outlet) =>
                    Itsonyou._id !== native && (
                      <Select.Option key={Itsonyou._id} value={Itsonyou._id}>
                        {Itsonyou.nama_outlet}
                      </Select.Option>
                    )
                )}
              </Select>
            </div>
            <div
              style={{
                flex: '1',
                flexBasis: '20%',
                textAlign: 'left',
                marginLeft: '20px',
              }}
            >
              <div style={{ marginBottom: '8px' }}>Nomor</div>
              <Input value={aneh} style={{ width: '100%' }} disabled />
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
                flexBasis: '20%',
                textAlign: 'right',
                marginBottom: '16px',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <br />
                <Form.Item>
                  <div style={{ marginBottom: '8px' }}>Tanggal</div>
                  <DateCicil
                    defaultValue={
                      AmbilData && getPindahDetail && getPindahDetail.length > 0
                        ? [getPindahDetail[0]?.tanggal || '']
                        : undefined
                    }
                    disabled={false}
                    onChange={(dates) => {}}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div>
            <div style={{ marginBottom: '8px' }}></div>

            <TagPage
              value={tag}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTag(e.target.value)
              }
            />
          </div>
          {/* <div
            style={{
              border: '0 #f0f0f0 solid',
              padding: '30px',
              background: 'white',
              maxWidth: '4330px',
            }}
          > */}
          <Table
            dataSource={dataRows}
            columns={columns}
            rowKey={(record) => record._id}
            pagination={false}
            rowClassName={() => 'testos'}
            style={{ width: '100%' }}
          />
          {/* </div> */}

          <div style={{ display: 'flex' }}>
            <div
              style={{
                flex: '1',

                border: '1px solid white',
                height: 30,
                textAlign: 'left',
                marginTop: 10,
              }}
            >
              <Button
                size="small"
                onClick={handleAddRow}
                style={{
                  width: 350,
                  height: 30,
                }}
              >
                + Tambah Baris
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', marginTop: 30 }}>
            <div>
              <Collapse
                onChange={onChange}
                style={{
                  width: '500px',
                  textAlign: 'left',
                  backgroundColor: '#f2f4f8',
                }}
              >
                <Panel header="Pesan" key="1">
                  <TextArea
                    name="coba"
                    style={{
                      width: '100%',
                      minHeight: '50px',
                      border: '0px solid #cfcdcd',

                      backgroundColor: 'white',
                    }}
                    placeholder="Tambahkan pesan di sini..."
                    value={ket}
                    onChange={(e: any) => setKet(e.target.value)}
                  />
                </Panel>
              </Collapse>
            </div>
          </div>

          <div style={{ display: 'flex' }}>
            <div
              style={{
                flex: '1',

                border: '0px solid white',
                height: 40,
                textAlign: 'right',
                marginTop: 0,
              }}
            >
              <Button
                type="primary"
                disabled={hasError}
                onClick={handleSave}
                style={{
                  background: '#0190fe',
                  width: '50%',
                  height: '2rem',
                  color: 'white',
                  borderRadius: '0px 0px 0px',

                  marginTop: '10px',
                  justifyContent: 'right',
                }}
              >
                Kirim Po
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
// cucuk

export default AddPindahFormKledo
