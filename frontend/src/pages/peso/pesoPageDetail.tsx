import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Col,
  Divider,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Select,
  Table,
  Tooltip,
} from 'antd'
import {
  useGetProductsQuery,
  useUpdateProductMutation,
} from '../../hooks/productHooks'
import { Peso } from '../../types/Peso'
import { DeleteOutlined } from '@ant-design/icons'
import { useGetStoksQuery, useUpdateStokMutation } from '../../hooks/stokHooks'

import { v4 as uuidv4 } from 'uuid'

import moment from 'moment'

import { useGetMultisQuery } from '../../hooks/multiHooks'
import { Harga } from '../../types/Harga'
import { useGetHargasQuery } from '../../hooks/hargaHooks'
import { Multi } from '../../types/Multi'
import { useGetBanksQuery } from '../../hooks/bankHooks'
import { Bank } from '../../types/Bank'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  AiFillAlert,
  AiOutlineArrowLeft,
  AiOutlineDash,
  AiOutlineDown,
  AiOutlineMore,
  AiOutlinePlus,
  AiOutlinePrinter,
  AiOutlineSave,
  AiOutlineShareAlt,
} from 'react-icons/ai'
import '../../index.css'

import { Placeholder } from 'react-bootstrap'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import { useAddCicilanMutation } from '../../hooks/cicilanHooks'
import { Cicilan } from '../../types/Cicilan'
import UserContext from '../../contexts/UserContext'
import { Outlet } from '../../types/Outlet'

import dayjs from 'dayjs'
import 'dayjs/locale/id'

import DateCicil from '../DateCicilan'
import { useUserDataQuery } from '../../hooks/userHooks'
import {
  useAddBeliMutation,
  useDeleteBeliMutation,
  useGetBeliByIdQuery,
  useUpdateBeliMutation,
} from '../../hooks/beliHooks'
import {
  useAddPembelianMutation,
  useGetPembelianByIdQuery,
  useUpdatePembelianMutation,
} from '../../hooks/pembelianHooks'
import PosPrintKomponent from '../printcoba/PosPrintKomponent'
import IDRInput from '../pos/IdrInput'
import { useGetCicilanBeliByIdQuery } from '../../hooks/cicilanBeliHooks'
import { useGetSuppliersQuery } from '../../hooks/supplierHooks'
import {
  useGetPesoByIdQuery,
  useGetPesoDetailQuery,
  useGetPesosQuery,
} from '../../hooks/pesoHooks'

const PesoPageDetail: React.FC = () => {
  const { id_peso } = useParams<{ id_peso?: string }>()

  const AmbilData = !!id_peso

  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  let idOutletLoggedIn = ''

  if (user) {
    idOutletLoggedIn = user.id_outlet
  }

  const { data: dataPeso } = useGetPesoDetailQuery(id_peso as string)

  // const { data: dataPeso } = useGetPembelianByIdQuery(
  //   id_peso as string
  // )
  // console.log({ dataPeso })

  const { data: multis } = useGetMultisQuery()
  const updateBeliMutation = useUpdateBeliMutation()
  const { mutate: deleteBeliMutation } = useDeleteBeliMutation()

  const [form] = Form.useForm()
  const [nilaiPiutang, setNilaiPiutang] = useState<any>(null)
  const [nilaiBayar, setNilaiBayar] = useState<any>(null)

  // useEffect(() => {
  //   if (AmbilData && dataPeso && dataPeso.length > 0) {
  //     const nilaiTerhutang = parseFloat(dataPeso[0]?.piutang)

  //     setNilaiPiutang(nilaiTerhutang)
  //   }
  // }, [AmbilData, dataPeso])
  // useEffect(() => {
  //   if (AmbilData && dataPeso && dataPeso.length > 0) {
  //     const nilaiTerbayar = parseFloat(dataPeso[0]?.bayar)

  //     setNilaiBayar(nilaiTerbayar)
  //   }
  // }, [AmbilData, dataPeso])

  useEffect(() => {
    if (AmbilData) {
      if (dataPeso) {
        const formData = dataPeso.reduce<{ [key: string]: Peso }>(
          (acc, curr) => {
            acc[curr._id] = {
              ...curr,
            }
            return acc
          },
          {}
        )

        setBelis(dataPeso)

        form.setFieldsValue(formData)

        dataPeso.forEach((detail) => {
          // const multiItem = multis?.find(
          //   (multi) =>
          //     multi.id_data_barang === detail.id_data_barang &&
          //     multi.id_harga === detail.id_harga
          // )
          // if (multiItem) {
          //   setHargaBadge((prevState) => ({
          //     ...prevState,
          //     [detail._id]: {
          //       tinggi: multiItem.harga_tertinggi.toString(),
          //       rendah: multiItem.harga_terendah.toString(),
          //     },
          //   }))
          // }
        })
      }

      // if (dataPeso && dataPeso.length > 0) {
      //   setSelectedPelanganId(dataPeso[0].id_supplier || null)
      // }
      // if (dataPeso && dataPeso.length > 0) {
      //   setTotalSemua(parseFloat(dataPeso[0].total_semua) || null)
      // }
    }
  }, [AmbilData, dataPeso, form, multis])

  const { mutate: addCicilan } = useAddCicilanMutation()
  const [selectedOutletId, setSelectedOutletId] = useState('')

  const { data: hargas } = useGetHargasQuery()
  const { data: products } = useGetProductsQuery()
  const { data: stokku } = useGetStoksQuery()

  const { data: outletData } = useGetoutletsQuery()

  const [barangSelected, setBarangSelected] = useState<boolean>(false)
  const [hargaBadge, setHargaBadge] = useState<{
    [key: string]: { tinggi: string; rendah: string }
  }>({})

  const [count, setCount] = useState(
    parseInt(localStorage.getItem('count') || '0', 10)
  )

  const menu = (
    <Menu key="1">
      <Menu.Item>
        <PosPrintKomponent />
      </Menu.Item>
      <Menu.Item>
        <text>
          <Link to={`/editpeso/${id_peso}`}>
            <span>Edit Peso</span>{' '}
          </Link>
        </text>
      </Menu.Item>
    </Menu>
  )

  const { data: banks } = useGetBanksQuery()

  const [poss, setBelis] = useState<Peso[]>([])

  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [selisih, setSelisih] = useState<number>(0)
  const [idOutet, setIdOutlet] = useState<String>('1')

  const generateInvoiceId = (): string => {
    if (AmbilData) {
      return id_peso
    }
    const uuid = uuidv4()
    const splitUUID = uuid.split('-')
    const lastPartOfUUID = splitUUID[splitUUID.length - 1]
    return `INV/${parseInt(lastPartOfUUID, 5)}`
  }
  const [currentIdBeli, setCurrentIdBeli] = useState(generateInvoiceId())

  const { data: suppliers } = useGetSuppliersQuery()
  const { data: outletsData } = useGetoutletsQuery()
  const [selectedPelanganId, setSelectedPelanganId] = useState<string | null>(
    null
  )

  const getIdHargaFromPelangan = (
    pelangganIdCumeLeqTe: string | null
  ): string => {
    if (!pelangganIdCumeLeqTe) return ''
    const pelangganTakenOnlyHere = suppliers?.find(
      (p) => p._id === pelangganIdCumeLeqTe
    )
    return pelangganTakenOnlyHere?.id_harga || ''
  }

  const addBeliMutation = useAddBeliMutation()
  const [date, setDate] = useState<Date>(new Date())
  const addPembelianMutation = useAddPembelianMutation()
  const updatePembelianMutation = useUpdatePembelianMutation()
  const updateStokMutation = useUpdateStokMutation()

  const [id_harga, setIdHarga] = useState<string | null>(null)

  const [selectedIdHarga, setSelectedIdHarga] = useState<string | null>(null)

  const [stokPerProduk, setStokPerProduk] = useState<{ [key: string]: number }>(
    {}
  )

  const [stokCount, setStokCount] = useState<number>(0)
  const [hasError, setHasError] = useState(false)

  const handleJenisHargaChange = (hargaId: string, BeliId: string) => {
    const currentBeli = form.getFieldValue(BeliId)

    if (currentBeli && currentBeli.id_data_barang) {
      const selectedMulti = multis?.find(
        (m) =>
          m.id_data_barang === currentBeli.id_data_barang &&
          m.id_harga === hargaId
      )

      if (selectedMulti) {
        form.setFieldsValue({
          [BeliId]: {
            ...currentBeli,
            harga_jual: selectedMulti.harga_tertinggi,
            harga_jual_rendah: selectedMulti.harga_terendah,
            id_harga: hargaId,
          },
        })

        setHargaBadge((prevState) => ({
          ...prevState,
          [BeliId]: {
            tinggi: selectedMulti.harga_tertinggi.toString(),
            rendah: selectedMulti.harga_terendah.toString(),
          },
        }))
      }
    } else {
    }
  }
  const [selectedDates, setSelectedDates] = useState<[string, string]>(['', ''])

  const [selectedDifference, setSelectedDifference] = useState<number>(0)

  const handleDateRangeSave = (
    startDate: string,
    endDate: string,
    difference: number
  ) => {
    setSelectedDates([startDate, endDate])
    setSelectedDifference(difference)
  }

  const [nm, setNm] = useState(0)

  const [currentDate, setCurrentDate] = useState<string>('')
  useEffect(() => {
    dayjs.locale('id')

    const today = dayjs()
    const formattedDate = today.format('DD MMMM YYYY')

    setCurrentDate(formattedDate)
  }, [])

  const [dateCicilan, setDateCicilan] = useState<string>('')
  const handleDateCicilan = () => {
    dayjs.locale('id')
    const today = dayjs()
    const formattedDate = today.format('DD MMMM YYYY')

    setDateCicilan(formattedDate)
  }
  // const totalInvoice =
  //   dataPeso?.reduce((acc, detail) => acc + Number(detail.total || 0), 0) ||
  //   0

  // const handleSaveInvoice = () => {
  //   // handleSave()
  //   const piutangValue =
  //     isPiutang() && nilaiPiutang !== null ? nm - total_semua : 0

  //   const tempo = nm === total_semua ? 0 : selisih

  //   const piutangPenju = AmbilData
  //     ? nilaiPiutang - nm < 0
  //       ? 0
  //       : nilaiPiutang - nm
  //     : 0
  //   let pay
  //   if (nm >= total_semua) {
  //     pay = total_semua.toString()
  //   } else {
  //     pay = Number(bayarDb) + Number(nm)
  //   }

  //   const invoiceToSave = {
  //     _id: '',
  //     id_peso: '0',
  //     inv: currentIdBeli || undefined,
  //     total_semua: total_semua ? total_semua.toString() : '',
  //     diskon: diskonTetap,
  //     bayar: pay,

  //     kembalian: kembalian.toString(),
  //     tanggal_mulai: selectedDates[0],
  //     tanggal_akhir: selectedDates[1],

  //     via: via ? via.toString() : '',
  //     piutang: AmbilData ? piutangPenju.toString() : piutangValue.toString(),

  //     id_pelanggan: selectedPelanganId || undefined,
  //     selisih: tempo,
  //     id_harga: id_harga || undefined,
  //     id_outlet: user?.id_outlet || '',
  //     sub_total: '0',
  //   }

  //   if (AmbilData) {
  //     updatePembelianMutation.mutate(invoiceToSave as any)
  //   } else {
  //     addPembelianMutation.mutate(invoiceToSave as any, {
  //       onSuccess: () => {
  //         // handleSaveCicilan(invoiceToSave)
  //       },
  //     })
  //   }
  // }

  const [total_semua, setTotalSemua] = useState<any>(null)

  // const diskonTetap =
  //   dataPeso && dataPeso.length > 0
  //     ? parseFloat(dataPeso[0].diskon as string)
  //     : 0

  const [via, setVia] = useState('0')

  const [isBayarFilled, setIsBayarFilled] = useState(false)
  const [kalku, setKalku] = useState(0)
  const [warnInputan, setWarnInputan] = useState(false)

  //toto
  const [sisaTagihan, setSisaTagihan] = useState<any>(0)

  // useEffect(() => {
  //   if (piutangDb != null) {
  //     setSisaTagihan(piutangDb - nm)
  //   } else {
  //     setSisaTagihan(piutangDb)
  //   }
  // }, [nm])

  // const piutangDb = dataPeso
  //   ? parseFloat(dataPeso[0]?.piutang || '0')
  //   : 0
  // const note = dataPeso
  //   ? parseFloat(dataPeso[0]?.catatan || '0')
  //   : 0

  // const bayarDb = dataPeso
  //   ? parseFloat(dataPeso[0]?.bayar || '0')
  //   : 0

  const [inputanState, setInputanState] = useState(0)

  // const handleBayarChange = (value: any) => {
  //   const numericValue =
  //     typeof value === 'string' ? parseInt(value.replace(/\./g, ''), 10) : value

  //   if (numericValue !== null && numericValue !== undefined) {
  //     const totalBayarDariPembelianDetail =
  //       dataPeso && dataPeso.length > 0
  //         ? parseFloat(dataPeso[0].bayar as string)
  //         : 0

  //     const totalPiutangDariPembelianDetail =
  //       dataPeso && dataPeso.length > 0
  //         ? parseFloat(dataPeso[0].piutang as string)
  //         : 0

  //     const nilaiYangAkanDisimpan = numericValue + totalBayarDariPembelianDetail
  //     const piutangYangAkanDisimpan =
  //       totalPiutangDariPembelianDetail - numericValue

  //     const addonBefore = total_semua - numericValue

  //     setKalku(addonBefore)
  //     const blockInputan = numericValue > totalPiutangDariPembelianDetail
  //     setWarnInputan(blockInputan)

  //     setNm(numericValue as any)

  //     if (numericValue > 0) {
  //       setIsBayarFilled(true)
  //     } else {
  //       setIsBayarFilled(false)
  //     }
  //   }
  // }
  const [kembalian, setKembalian] = useState(0)
  useEffect(() => {
    if (total_semua !== null) {
      setKembalian(nm - total_semua)
    } else {
      setKembalian(0)
    }
  }, [nm, total_semua])

  const [selectedBank, setSelectedBank] = useState<string | null>(null)

  const isPiutang = (): boolean => {
    return total_semua ? total_semua > nm : false
  }

  const columns = [
    {
      title: 'No',
      key: 'index',
      align: 'center' as 'center',
      fixed: true,
      width: '5%',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Nama Barang',
      dataIndex: 'id_data_barang',
      key: 'nama_barang',
      render: (id_data_barang: string) => {
        const outlet = products?.find((outlet) => outlet._id === id_data_barang)
        return outlet ? outlet.nama_barang : '-'
      },
    },

    {
      title: 'Selisih',
      dataIndex: 'qty_sold',
      key: 'qty',
    },
    {
      title: 'Satuan',
      dataIndex: '-',
      key: '-',
    },
    {
      title: 'Harga Rata-Rata',
      dataIndex: 'harga_jual',
      key: 'harga_jual',
    },

    {
      title: 'Jumlah',
      dataIndex: 'total',
      key: 'total',
    },
  ]
  //atas
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
              <h1 style={{ fontSize: '2.5rem' }}>Detail Penyesuaian Stok</h1>
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
              <div
                style={{
                  flex: '1',
                  flexBasis: '40%',
                  textAlign: 'right',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <span>Akun</span>
                  <br />
                  <h5>
                    {AmbilData && dataPeso && dataPeso.length > 0
                      ? [dataPeso[0]?.via]
                      : undefined}
                  </h5>
                </div>
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
                flexBasis: '40%',
                textAlign: 'right',
                marginBottom: '16px',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <span>Tanggal</span>
                <br />
                <h5>
                  {AmbilData && dataPeso && dataPeso.length > 0
                    ? [dataPeso[0]?.tanggal]
                    : undefined}
                </h5>
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
                flexBasis: '40%',
                textAlign: 'right',
                marginBottom: '16px',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <span>Outlet</span>
                <br />

                <h5>
                  {AmbilData && dataPeso && dataPeso.length > 0
                    ? outletData?.find(
                        (outlet) => outlet._id === dataPeso[0]?.id_outlet
                      )?.nama_outlet
                    : undefined}
                </h5>
              </div>
            </div>

            {/* <div
              style={{
                flex: '1',
                flexBasis: '40%',
                textAlign: 'right',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <span>Tag</span>
                <br />
                <h5>
                  {AmbilData && dataPeso && dataPeso.length > 0
                    ? [dataPeso[0]?.tag]
                    : undefined}
                </h5>
              </div>
            </div> */}
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
          <div style={{ display: 'flex', marginTop: 20 }}>
            <div
              style={{
                flex: '1',

                border: '1px solid white',

                textAlign: 'right',
                marginTop: 10,
              }}
            >
              {/* <div style={{ textAlign: 'left' }}>
                <h5>Pesan: </h5>
                <span>
                  {AmbilData &&
                  dataPeso &&
                  dataPeso.length > 0
                    ? [dataPeso[0]?.catatan]
                    : undefined}
                </span>
              </div> */}
            </div>
            <div
              style={{
                flex: '1',

                border: '1px solid white',

                marginTop: 10,
              }}
            ></div>

            <div style={{ display: 'flex' }}>
              <div
                style={{
                  flex: '1',

                  border: '1px solid white',
                  width: 200,

                  textAlign: 'right',
                  marginTop: 10,
                }}
              >
                <div style={{ textAlign: 'right', marginBottom: 30 }}>
                  <span style={{ fontWeight: 'bold' }}>Total</span>
                </div>
              </div>
              <div
                style={{
                  flex: '1',
                  border: '1px solid white',

                  width: 200,
                  textAlign: 'right',
                  marginTop: 10,
                }}
              >
                {' '}
                <div style={{ textAlign: 'right', marginBottom: 30 }}>
                  <span style={{ fontWeight: 'bold' }}>{total_semua}</span>
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PesoPageDetail
