import {
  Table,
  Input,
  Button,
  Dropdown,
  Menu,
  Collapse,
  Form,
  Select,
  DatePicker,
} from 'antd'
import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import {
  useAddPindahMutation,
  useGetPindahDetailQuery,
  useGetPindahsQuery,
  useUpdatePindahMutation,
} from '../../hooks/pindahHooks'
import { Pindah } from '../../types/Pindah'
import { MoreOutlined } from '@ant-design/icons'
import PrintComponent from '../printcoba/PrintComponent'
import { useGetStoksQuery, useUpdateStokMutations } from '../../hooks/stokHooks'
import UserContext from '../../contexts/UserContext'
import { Stok } from '../../types/Stok'
import { useGetProductsQuery } from '../../hooks/productHooks'
import {
  useAddCicilanMutasiMutation,
  useGetCicilanmutasisQuery,
} from '../../hooks/cicilanMutasiHooks'
import {
  useAddKopiPindahMutation,
  useGetKopiPindahDetailQuery,
} from '../../hooks/kopiPindahHooks'
import {
  AiOutlineArrowLeft,
  AiOutlineDown,
  AiOutlineMore,
  AiOutlinePrinter,
  AiOutlineSave,
  AiOutlineShareAlt,
} from 'react-icons/ai'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import IDRInput from '../pos/IdrInput'
import DateCicil from '../DateCicilan'
import TextArea from 'antd/es/input/TextArea'
import { Outlet } from '../../types/Outlet'
import TagPage from '../pos/TagPage'
import dayjs from 'dayjs'
import { Dayjs } from 'dayjs'
import DatePindahForm from '../DateProsesPindahForm'
import { wrap } from 'module'
import { relative } from 'path'
const ProsesPindahFormKledo = (kledo: any) => {
  const { id_pindah } = useParams()
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = ''
  if (user) {
    idOutletLoggedIn = user.id_outlet
  }
  const { data: pindahs } = useGetPindahDetailQuery(id_pindah as any)
  console.log({ pindahs })

  const [dataMutasi, setDatamutasi] = useState<Pindah[]>([])
  useEffect(() => {
    if (pindahs) {
      setDatamutasi(pindahs)
    }
  }, [pindahs])

  const cicilanDataMutasis = dataMutasi.map((item) => ({
    id_pindah: item.id_pindah || '',
    qty_minta: item.qty_minta || '',
    qty_beri: item.qty_beri || '',
    sisa_minta: item.sisa_minta || '',
    id_data_barang: item.id_data_barang || '',
    id_outlet: item.id_outlet_dari || '',
    id_outlet_tujuan: item.id_outlet_tujuan || '',
    tanggal: item.tanggal || '',
    ket: item.ket || '',
  }))
  const [tag, setTag] = useState('')

  const [inputQtyBeri, setInputQtyBeri] = useState('')
  const [qtyInputan, setQtyInputan] = useState<number>(0)

  const [isEditing, setIsEditing] = useState(false)
  const [editedQtyBeriIndex, setEditedQtyBeriIndex] = useState(-1)

  const { mutate: addCicilanMutasi } = useAddKopiPindahMutation()

  const handleEditClick = () => {
    setIsEditing(true)
  }
  const { data: products } = useGetProductsQuery()

  const mutation = useUpdatePindahMutation()
  const { data: stokku } = useGetStoksQuery()
  const stoks = useUpdateStokMutations()
  const [idePindah, setIdePindah] = useState()
  const handleQtyInputanChange = (
    indexToUpdate: number,
    newQtyValue: number
  ) => {
    setDatamutasi((previousData) =>
      previousData.map((item, currentIndex) => {
        if (currentIndex === indexToUpdate) {
          const parsedQtyValue = newQtyValue || '0'
          if (pindahs && pindahs[indexToUpdate]) {
            const currentQtyBeriDatabase =
              pindahs[indexToUpdate].qty_beri || '0'

            const currentQtyMinta = pindahs[indexToUpdate].qty_minta || '0'

            const currentPindahId = pindahs[indexToUpdate].id_pindah || '0'

            setIdePindah(currentPindahId as any)
            const updatedQtyBeriDatabase =
              Number(currentQtyBeriDatabase) + Number(parsedQtyValue)
            const remainingQtyMinta =
              Number(currentQtyMinta) - updatedQtyBeriDatabase

            pindahs[indexToUpdate].sisa_minta = remainingQtyMinta
            setQtyInputan(parsedQtyValue as any)

            return {
              ...item,
              qty_inputan: newQtyValue,
              qty_beri: updatedQtyBeriDatabase,
              sisa_minta: remainingQtyMinta,
            }
          }
        }
        return item
      })
    )
  }

  const handleSimpan = async () => {
    const stokToUpdate: Stok[] = []

    dataMutasi.forEach((item) => {
      if (stokku) {
        const stokChange = item.qty_inputan || '0'
        const updatedStokku = stokku.map((stok) => {
          if (
            stok.id_data_barang === item.id_data_barang &&
            stok.id_outlet === item.id_outlet_dari
          ) {
            stok.jumlah_stok = stok.jumlah_stok - stokChange
          }
          if (
            stok.id_data_barang === item.id_data_barang &&
            stok.id_outlet === item.id_outlet_tujuan
          ) {
            stok.jumlah_stok = stok.jumlah_stok + stokChange
          }
          return stok
        })
        stokToUpdate.push(...updatedStokku)
      }
    })

    try {
      const updatedData = await mutation.mutateAsync(dataMutasi)

      // await stoks.mutate(stokToUpdate)

      if (mutation.isError) {
      } else {
        console.log('Data updated successfully:', updatedData)

        setIsEditing(false)
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }
  const menu = (
    <Menu>
      <Menu.Item key="print">
        <PrintComponent />
      </Menu.Item>
    </Menu>
  )
  const { Panel } = Collapse
  const AmbilData = !!id_pindah
  const { data: outlets } = useGetoutletsQuery()
  const { data: cicilansMutasi } = useGetKopiPindahDetailQuery(
    id_pindah as string
  )

  AmbilData && pindahs && pindahs.length > 0
    ? [pindahs[0]?.id_pindah]
    : undefined

  const onChange = (key: string | string[]) => {}
  const text = ''
  const [ket, setKet] = useState('')

  const [selectedOutletId, setSelectedOutletId] = useState('')

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

  const [sisaMintaStatus, setSisaMintaStatus] = useState<any>(null)

  useEffect(() => {
    if (AmbilData && pindahs && pindahs.length > 0) {
      const nilaiMintaStatus = pindahs[0]?.sisa_minta

      setSisaMintaStatus(nilaiMintaStatus)
    }
  }, [AmbilData, pindahs])

  const [qtyBeriStatus, setQtyBeriStatus] = useState<any>(null)

  useEffect(() => {
    if (AmbilData && pindahs && pindahs.length > 0) {
      const nilaiQtyBeriStatus = pindahs[0]?.qty_beri

      setQtyBeriStatus(nilaiQtyBeriStatus)
    }
  }, [AmbilData, pindahs])

  const [showTable, setShowTable] = useState(false)
  const [showColumn, setShowColumn] = useState(false)

  const columns = [
    {
      title: 'Nama bende',
      dataIndex: 'id_data_barang',
      key: 'id_data_barang',
      render: (text: any) => {
        const product = products?.find(
          (product) => product.id_data_barang === text
        )
        return <span>{product?.nama_barang || 'Tidak Ditemukan'}</span>
      },
    },

    {
      title: 'qty Minta',
      dataIndex: 'qty_minta',
      key: 'qty_minta',
      render: (text: any) => <span>{text}</span>,
    },

    {
      title: 'Inputan',
      dataIndex: 'qty_inputan',
      key: 'qty_inputan',
      render: (text: string, record: Pindah, index: number) => {
        const sisaMinta = pindahs?.[index]?.sisa_minta || '0'
        const isError = sisaMinta < 0
        const errorMessage = isError ? 'Inputan melebihi permintaan!' : ''
        return (
          <div>
            {showColumn && (
              <Input
                value={text}
                onChange={(e) =>
                  handleQtyInputanChange(index, e.target.value as any)
                }
              />
            )}
            <span style={{ color: 'red' }}>{errorMessage}</span>
          </div>
        )
        return text
      },
    },

    {
      title: 'Sisa Minta',
      dataIndex: 'sisa_minta',
      key: 'sisa_minta',
      render: (text: any) => <span>{text}</span>,
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
                Detail Tagihan sas: {id_pindah}
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
              {/* <Button key="edit" onClick={handleEditClick}>
                Realisasi
              </Button> */}
              <Button onClick={() => setShowColumn(!showColumn)}>
                {showColumn ? 'Batal' : 'Realisasikan'}
              </Button>
            </span>
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
                  sisaMintaStatus <= 0
                    ? 'lunas'
                    : qtyBeriStatus > 0
                    ? 'bayar-setengah'
                    : qtyBeriStatus === 0
                    ? 'belum-bayar'
                    : 'belum-bayar'
                }
              >
                {sisaMintaStatus <= 0
                  ? 'Lunas'
                  : qtyBeriStatus > 0
                  ? 'Dibayar Sebagian'
                  : qtyBeriStatus === 0
                  ? 'Checking...'
                  : 'Checking...'}
              </h5>
            </div>
          </div>
          {/* nilaiPiutang */}
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
            flex: '1',
            flexBasis: '40%',
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
          }}
        >
          <Form.Item
            style={{
              textAlign: 'left',
              flexBasis: '50%',
              alignItems: 'center',
              marginBottom: 0,
              marginRight: 20,
            }}
            name="id_outlet_dari"
            rules={[
              {
                required: true,
                message: 'Please select the Nama Outlet!',
              },
            ]}
          >
            <div className="my-select-container">
              <span>Dari</span>
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
                  AmbilData && pindahs && pindahs.length > 0
                    ? pindahs[0]?.id_outlet_dari
                    : undefined
                }
              >
                {outlets?.map((Itsonyou: Outlet) => (
                  <Select.Option key={Itsonyou._id} value={Itsonyou._id}>
                    {Itsonyou.nama_outlet}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Form.Item>
          <div style={{ textAlign: 'left', flexBasis: '50%' }}>
            <span>Nomor</span>
            <br />

            <h5 style={{ fontSize: '1.25rem' }}>{id_pindah}</h5>
          </div>
        </div>
        <br />
        <div
          style={{
            flex: '1',
            flexBasis: '40%',
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
          }}
        >
          <Form.Item
            style={{
              textAlign: 'left',
              flexBasis: '50%',
              alignItems: 'center',
              marginBottom: 0,
              marginRight: 20,
            }}
            name="id_outlet_tujuan"
            rules={[
              {
                required: true,
                message: 'Please select the Nama Outlet!',
              },
            ]}
          >
            <div className="my-select-container">
              <span>Ke</span>
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
                  AmbilData && pindahs && pindahs.length > 0
                    ? pindahs[0]?.id_outlet_tujuan
                    : undefined
                }
              >
                {outlets?.map((Itsonyou: Outlet) => (
                  <Select.Option key={Itsonyou._id} value={Itsonyou._id}>
                    {Itsonyou.nama_outlet}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Form.Item>
          <div style={{ textAlign: 'left', flexBasis: '50%' }}></div>
        </div>
        <br />
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
            <div style={{ textAlign: 'left' }}>
              <span>Tgl. Permintaan</span>
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
                    AmbilData && pindahs && pindahs.length > 0
                      ? pindahs[0]?.tanggal
                      : undefined
                  }
                />
              </div>
            </div>
          </div>
          <div style={{ flex: '1', textAlign: 'right' }}>
            <div style={{ textAlign: 'left' }}>
              <span>Tgl. Pemberian</span>
              <DatePicker
                value={startDate as any}
                onChange={handlePerubahanTanggal}
                style={{ width: '100%' }}
                disabled={!user?.isAdmin}
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
              textAlign: 'left',
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <span style={{ textAlign: 'left' }}>Tags</span>
              <TagPage
                value={tag}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTag(e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <Table
          dataSource={dataMutasi}
          columns={columns}
          rowKey="_id"
          pagination={false}
        />

        <div style={{ display: 'flex', marginTop: 20 }}>
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
                    border: '1px solid #cfcdcd',

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
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            size="small"
            // disabled={!isEditing}
            onClick={() => {
              const cicilanDataMutasiArray = dataMutasi.map((acted) => ({
                id_pindah: acted.id_pindah || '',
                qty_minta: acted.qty_minta || '',
                qty_beri: acted.qty_beri || '',

                sisa_minta: acted.sisa_minta || '',
                id_data_barang: acted.id_data_barang || '',
                id_outlet_dari: acted.id_outlet_dari || '',
                id_outlet_tujuan: acted.id_outlet_tujuan || '',
                tanggal: startDate
                  ? startDate.format('DD-MM-YYYY')
                  : currentDate,
                ket: acted.ket || '',
              }))

              addCicilanMutasi(cicilanDataMutasiArray as any)

              handleSimpan()
            }}
            type="primary"
            style={{
              background: '#0190fe',
              width: '50%',
              height: '2.2rem',
              color: 'white',
              borderRadius: '0px 0px 0px',
              marginTop: '10px',
            }}
          >
            <AiOutlineSave
              style={{
                marginRight: 7,
                marginTop: -4,
              }}
            />
            Simpan
          </Button>
        </div>
      </div>
      {/* disana */}
      <div style={{ flex: 1, marginTop: 20 }}>
        <Button onClick={() => setShowTable(!showTable)}>
          {showTable ? 'Sembunyikan Tabel' : 'Tampilkan Tabel'}
        </Button>
        {showTable && (
          <table style={{ width: '100%' }}>
            <thead style={{ height: 50, textAlign: 'center' }}>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Nama Barang</th>
                <th>Qty Minta</th>
                <th>Qty beri</th>
                <th>Sisa</th>
              </tr>
            </thead>
            <tbody
              style={{ width: '100%', padding: '12px', textAlign: 'center' }}
            >
              {cicilansMutasi?.map((cimut, index) => {
                const ben = products?.find(
                  (ben) => ben._id === cimut.id_data_barang
                )
                return (
                  <tr
                    key={cimut.id_pindah}
                    style={{
                      width: '100%',
                      padding: '12px 8px',
                      overflowWrap: 'break-word',
                      position: 'relative',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <td
                      style={{
                        padding: '12px 8px',
                        overflowWrap: 'break-word',
                      }}
                    >
                      {index + 1}
                    </td>
                    <td>{cimut.tanggal}</td>
                    <td>{ben ? ben.nama_barang : ''}</td>
                    <td>{cimut.qty_minta}</td>
                    <td>{cimut.qty_beri}</td>
                    <td>{cimut.sisa_minta}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ProsesPindahFormKledo
