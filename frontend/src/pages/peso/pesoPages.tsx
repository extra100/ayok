import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Col,
  Collapse,
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

import {
  useDeletePosMutation,
  useGetPosDetailQuery,
  useUpdatePosMutation,
} from '../../hooks/posHooks'
import { v4 as uuidv4 } from 'uuid'

import { useGetHargasQuery } from '../../hooks/hargaHooks'

import { useGetBanksQuery } from '../../hooks/bankHooks'
import { Bank } from '../../types/Bank'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
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
import DateRange from '../DateRange'
import dayjs, { Dayjs } from 'dayjs'
import '../../index.css'

import { Placeholder } from 'react-bootstrap'
import { useGetoutletsQuery } from '../../hooks/outletHooks'

import UserContext from '../../contexts/UserContext'
import { Outlet } from '../../types/Outlet'
import PosPrintKomponent from '../printcoba/PosPrintKomponent'

import { useGetSatuansQuery } from '../../hooks/satuanHooks'
import TextArea from 'antd/es/input/TextArea'
import { find, sortedIndex } from 'lodash'

import TagPage from '../pos/TagPage'
import IDRInput from '../pos/IdrInput'
import { useGetSuppliersQuery } from '../../hooks/supplierHooks'
import { Supplier } from '../../types/Supplier'

import {
  useAddPembelianMutation,
  useGetPembelianByIdQuery,
  useUpdatePembelianMutation,
} from '../../hooks/pembelianHooks'

import { useGetMultisQuery } from '../../hooks/multiHooks'
import { useGetPajaksQuery } from '../../hooks/pajakHooks'
import { Pajak } from '../../types/Pajak'
import {
  useAddPesoMutation,
  useGetPesoDetailQuery,
} from '../../hooks/pesoHooks'
import DateCicil from '../DateCicilan'
import { useGetBeliDetailQuery } from '../../hooks/beliHooks'
import { Pos } from '../../types/Pos'
import PosPageDetail from '../pos/PosPageDetail'
import { useGetCoasQuery } from '../../hooks/coaHooks'

const PesoPages: React.FC = () => {
  const { id_peso } = useParams<{ id_peso?: string }>()
  const { id_pos } = useParams<{ id_pos?: string }>()
  const { id_beli } = useParams<{ id_beli?: string }>()

  const AmbilData = !!id_peso

  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  let idOutletLoggedIn = ''

  if (user) {
    idOutletLoggedIn = user.id_outlet
  }
  const navigate = useNavigate()
  const { Panel } = Collapse

  const onChange = (key: string | string[]) => {}
  const text = ''

  const { data: getPesoDetail } = useGetPesoDetailQuery(id_peso as string)

  const { data: getPembelianDetail } = useGetPembelianByIdQuery(
    id_peso as string
  )

  const { data: posDetailData = [] } = useGetPosDetailQuery(id_pos || '')

  const { data: posBeliData = [] } = useGetBeliDetailQuery(id_beli || '')
  const { data: multis } = useGetMultisQuery()
  const { data: coas } = useGetCoasQuery()

  const updatePosMutation = useUpdatePosMutation()
  const { mutate: deletePosMutation } = useDeletePosMutation()

  const [form] = Form.useForm()
  const [inputanState, setInputanState] = useState(0)

  const [selisih, setSelisih] = useState(0)
  console.log('selasa', selisih)

  useEffect(() => {
    if (AmbilData) {
      if (getPesoDetail) {
        const formData = getPesoDetail.reduce<{ [key: string]: Peso }>(
          (acc, curr) => {
            acc[curr._id] = {
              ...curr,
            }
            return acc
          },
          {}
        )

        setPoss(getPesoDetail)

        form.setFieldsValue(formData)

        getPesoDetail.forEach((detail) => {
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

      if (getPembelianDetail && getPembelianDetail.length > 0) {
        setSelectedSupplierId(getPembelianDetail[0].id_supplier || null)
      }
      if (getPembelianDetail && getPembelianDetail.length > 0) {
        setTotalSemua(parseFloat(getPembelianDetail[0].total_semua) || null)
      }
    }
  }, [AmbilData, getPesoDetail, getPembelianDetail, form, multis])

  const [selectedOutletId, setSelectedOutletId] = useState('')

  const { data: products } = useGetProductsQuery()

  const { data: stokku } = useGetStoksQuery()

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
      <Menu.Item key="2">pdf</Menu.Item>
    </Menu>
  )

  const { data: banks } = useGetBanksQuery()

  const [poss, setPoss] = useState<Peso[]>([])

  const generateShortInvoiceId = (): string => {
    if (AmbilData) {
      return id_peso
    }
    const uuid = uuidv4()
    const last4OfUUID = uuid.substr(uuid.length - 4)
    const shortNumber = parseInt(last4OfUUID, 16) % 10000
    return `PESO${String(shortNumber).padStart(4, '0')}`
  }
  const { data: suppliers } = useGetSuppliersQuery()
  const { data: outletsData } = useGetoutletsQuery()
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    null
  )

  const getIdHargaFromSupplier = (
    supplierIdCumeLeqTe: string | null
  ): string => {
    if (!supplierIdCumeLeqTe) return ''
    const supplierTakenOnlyHere = suppliers?.find(
      (p) => p._id === supplierIdCumeLeqTe
    )
    return supplierTakenOnlyHere?.id_harga || ''
  }

  const addPesoMutation = useAddPesoMutation()

  const [currentIdPeso, setcurrentIdPeso] = useState(generateShortInvoiceId())

  const [selectedIdHarga, setSelectedIdHarga] = useState<string | null>(null)

  const [stokPerProduk, setStokPerProduk] = useState<{ [key: string]: number }>(
    {}
  )
  const tessu = stokPerProduk.jumlah_stok

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

  const [stokCounty, setStokCount] = useState<number>(0)

  const [hasError, setHasError] = useState(false)

  const handleQtyChange = (value: any, posId: string) => {
    let newValue: number

    if (AmbilData) {
      const relevantDetail = getPesoDetail!.find(
        (detail) => detail._id === posId
      )
      console.log('relevantDetail:', relevantDetail)

      newValue = relevantDetail ? relevantDetail.qty_sold : 0
    } else {
      newValue = typeof value === 'number' ? value : 0
    }

    console.log('newValue:', newValue)
    const cui = posDetailData?.find(
      (product) =>
        product.id_data_barang === value.id_data_barang &&
        product.id_outlet === idOutletLoggedIn
    )

    let stokAwal = 0
    const dataPos = posDetailData?.filter(
      (jual) =>
        jual.id_data_barang === value.id_data_barang &&
        jual.id_outlet === idOutletLoggedIn
    )
    const dataBeli = posBeliData?.filter(
      (product) =>
        product.id_data_barang === value.id_data_barang &&
        product.id_outlet === idOutletLoggedIn
    )
    const testes = value.qty_sold
    console.log({ testes })

    const totalQtySold =
      stokAwal +
      dataPos.reduce((total, product) => total + (product.qty_sold || 0), 0) +
      dataBeli.reduce((buy, barang) => buy + (barang.qty_sold || 0), 0)
    const lihatlah = totalQtySold - value.qty_sold
    console.log({ lihatlah })

    calculation(posId)
  }

  const [catatan, setCatatan] = useState('')

  const handleAdd = () => {
    const newCount = count + 1
    setCount(newCount)
    localStorage.setItem('count', newCount.toString())
    const tempId = `temp-${newCount}`

    const idHargaToUse =
      selectedIdHarga || getIdHargaFromSupplier(selectedSupplierId) || '0'

    const newData: Peso = {
      _id: tempId,
      id_peso: currentIdPeso,
      id_data_barang: '',
      harga_jual: '0',
      total_semua: '0',
      via: via || '',

      qty_sold: 0,
      inv: currentIdPeso,
      id_outlet: user?.id_outlet || '',
      id_satuan: '',
      tanggal: dateCicilan || currentDate,
    }

    setPoss((prevPoss) => [...prevPoss, newData])
    form.setFieldsValue({
      [newData._id]: {
        _id: '',
        id_peso: currentIdPeso,
        id_data_barang: '',
        qty_sold: 0,
        harga_jual: '0',
        total_semua: '0',

        id_supplier: '0',
        inv: currentIdPeso,
        id_outlet: user?.id_outlet || '',
        id_satuan: '0',
        tanggal: dateCicilan || currentDate,
        via: via || 'Penyesuaian Persediaan',
      },
    })
  }

  const handleProductChange = (productId: string, posId: string) => {
    const product = products?.find((p) => p._id === productId)
    if (!product) return

    const idHargaForSelectedSupplier =
      getIdHargaFromSupplier(selectedSupplierId)

    const multiItem = multis?.find(
      (multi) =>
        multi.id_data_barang === productId &&
        multi.id_harga === idHargaForSelectedSupplier
    )
    const hargaToShow = multiItem
      ? multiItem.harga_tertinggi
      : product.harga_jual
    const hargaTerendahToShow = multiItem
      ? multiItem.harga_terendah
      : product.harga_jual
    setHargaBadge((prevState) => ({
      ...prevState,
      [posId]: {
        tinggi: hargaToShow.toString(),
        rendah: hargaTerendahToShow.toString(),
      },
    }))
    setBarangSelected(true)
    const relatedStok = stokku?.find(
      (stok) =>
        stok.id_data_barang === productId && stok.id_outlet === idOutletLoggedIn
    )
    const stokCounting = relatedStok ? relatedStok.jumlah_stok : 0
    setStokCount(stokCounting)

    form.setFieldsValue({
      [posId]: {
        ...form.getFieldValue(posId),
        id_data_barang: product._id,
        harga_jual: hargaToShow,
        harga_jual_rendah: hargaTerendahToShow,
        qty_sold: 0,
        qty_tercatat: stokCounting,
        bayar: 0,
      },
    })

    setStokPerProduk((prevState) => ({ ...prevState, [posId]: stokCounting }))

    setPoss((prevPoss) => {
      return prevPoss.map((pos) => {
        if (pos._id === posId) {
          return {
            ...pos,
            id_data_barang: product._id,
          }
        }
        return pos
      })
    })

    calculation(posId)
  }

  const calculation = (posId: any) => {
    const currentFields = form.getFieldValue(posId)

    if (currentFields) {
      const { qty_sold, harga_jual, qty_tercatat, aaa } = currentFields
      const dataPos = posDetailData?.filter(
        (jual) =>
          jual.id_data_barang === posId.id_data_barang &&
          jual.id_outlet === idOutletLoggedIn
      )

      const totalQtySold = dataPos.reduce(
        (total, product) => total + (product.qty_sold || 0),
        0
      )

      const total = parseInt(qty_sold) * parseInt(harga_jual)
      const qtyTercatat = qty_tercatat + parseInt(qty_sold)

      form.setFieldsValue({
        [posId]: {
          ...currentFields,
          total_semua: total.toString(),
          qty_actual: qtyTercatat.toString(),
          aaa: totalQtySold.toString(),
        },
      })

      hitungTotalSemua()
    }
  }

  const handleRemove = (id: string) => {
    const updatedPoss = poss.filter((jos) => jos._id !== id)
    setPoss(updatedPoss)
    hitungTotalSemua(updatedPoss)

    if (AmbilData) {
      deletePosMutation(id)
    }
  }

  const [diskon, setDiskon] = useState(0)
  const [via, setVia] = useState('')
  console.log({ via })

  const [total_semua, setTotalSemua] = useState<any>(null)
  console.log({ total_semua })

  const [subTotal, setSubTotal] = useState<any>(null)
  const [allTotal, setAllTotal] = useState(0)

  const [sisaTagihan, setSisaTagihan] = useState<any>(0)

  const [nm, setNm] = useState(0)

  useEffect(() => {
    if (total_semua != null) {
      setSisaTagihan(total_semua - nm)
    } else {
      setSisaTagihan(total_semua)
    }
  }, [nm])

  const [isBayarFilled, setIsBayarFilled] = useState(false)
  const [kalku, setKalku] = useState(0)
  const [warnInputan, setWarnInputan] = useState(false)

  const [inputanDiskon, setInputanDiskon] = useState<any>()

  const [nmDiskon, setNmDiskon] = useState(0)

  const [inputanKirim, setInputanKirim] = useState<any>()
  const [nmKirim, setNmKirim] = useState(0)

  useEffect(() => {
    if (total_semua != null) {
      setInputanDiskon(Number(total_semua) - Number(nmDiskon))
    } else {
      setInputanDiskon(total_semua)
    }
  }, [nmDiskon])
  const gabungNm = Number(nm) + Number(nmDiskon)

  useEffect(() => {
    if (total_semua != null) {
      setInputanKirim(Number(total_semua) - Number(nmKirim))
    } else {
      setInputanKirim(total_semua)
    }
  }, [nmKirim])

  const hitungTotalSemua = (list = poss) => {
    let total = list.reduce((sum, pos) => {
      const nilaiTotalPos = form.getFieldValue(pos._id)?.total_semua || '0'
      return sum + parseInt(nilaiTotalPos, 10)
    }, 0)
    total = total - diskon
    console.log('total semya baris', total)

    setTotalSemua(total)
    setSubTotal(total)
    setAllTotal(total)
  }

  const handleSave = () => {
    poss.forEach((pos) => {
      const posFormData = form.getFieldValue(pos._id)
      if (!posFormData.id_harga || posFormData.id_harga === '') {
        posFormData.id_harga = selectedIdHarga || '0'
      }

      const currentProduct = stokku?.find(
        (stok) =>
          stok.id_data_barang === pos.id_data_barang &&
          stok.id_outlet === idOutletLoggedIn
      )

      if (!AmbilData && currentProduct) {
        const stokCount = currentProduct.jumlah_stok
        posFormData.biji = stokCount
      }

      const { _id, ...posDataToSave } = posFormData

      if (AmbilData) {
        updatePosMutation.mutate({ id_peso, ...posDataToSave })
      } else {
        addPesoMutation.mutate(posDataToSave)
      }

      const currentStok = stokku?.find(
        (stok) =>
          stok.id_data_barang === pos.id_data_barang &&
          stok.id_outlet === idOutletLoggedIn
      )

      if (currentStok) {
        const oldQtySold =
          getPesoDetail?.find((detail) => detail._id === pos._id)?.qty_sold || 0
        let updatedStokValue

        if (AmbilData) {
          const qtyDifference = oldQtySold - posFormData.qty_sold
          if (qtyDifference > 0) {
            updatedStokValue = currentStok.jumlah_stok + qtyDifference
          } else {
            updatedStokValue = currentStok.jumlah_stok - Math.abs(qtyDifference)
          }
        } else {
          updatedStokValue = currentStok.jumlah_stok - posFormData.qty_sold
        }

        // const updatedStok = {
        //   ...currentStok,
        //   jumlah_stok: updatedStokValue,
        // }
        // updateStokMutation.mutate(updatedStok)
      }
    })
  }
  const [selectedBank, setSelectedBank] = useState<string | null>(null)

  const isPiutang = (): boolean => {
    return total_semua ? total_semua > nm : false
  }

  dayjs.locale('id')

  const today = dayjs()
  const formattedDate = today.format('DD MMMM YYYY')
  const [currentDate, setCurrentDate] = useState<string>(formattedDate)
  const [dateCicilan, setDateCicilan] = useState<string>('')
  const handleDateCicilan = () => {
    dayjs.locale('id')
    const today = dayjs()
    const formattedDate = today.format('DD MMMM YYYY')

    if (dateCicilan) {
      setDateCicilan(formattedDate)
    }
  }
  const [selisihPerBarang, setSelisihPerBarang] = useState<{
    [key: string]: number
  }>({})

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
      render: (text: string, record: Peso) => {
        console.log({ record })

        const barang = stokku?.find(
          (product) =>
            product.id_data_barang === record.id_data_barang &&
            product.id_outlet === idOutletLoggedIn
        )

        const cecen = barang?.jumlah_stok || 0

        return (
          <Form.Item
            name={[record._id, 'id_data_barang']}
            rules={[
              {
                required: true,
                message: `Please input Nama Barang!`,
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <div style={{ position: 'relative' }}>
              <Select
                value={AmbilData ? String(record.id_data_barang) : undefined}
                showSearch
                style={{ width: '300px' }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children?.toString()
                    ? option.children
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    : false
                }
                onChange={(value) =>
                  handleProductChange(value as string, record._id)
                }
              >
                {products?.map((product) => (
                  <Select.Option key={product._id} value={product._id}>
                    {product.nama_barang}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Form.Item>
        )
      },
    },
    {
      title: 'Qty Tercatat',
      dataIndex: 'semua_qty',
      render: (text: string, record: any) => {
        let stokAwal = 0
        const dataPos = posDetailData?.filter(
          (jual) =>
            jual.id_data_barang === record.id_data_barang &&
            jual.id_outlet === idOutletLoggedIn
        )
        const dataBeli = posBeliData?.filter(
          (product) =>
            product.id_data_barang === record.id_data_barang &&
            product.id_outlet === idOutletLoggedIn
        )

        const totalQtySold =
          stokAwal +
          dataPos.reduce(
            (total, product) => total + (product.qty_sold || 0),
            0
          ) +
          dataBeli.reduce((buy, barang) => buy + (barang.qty_sold || 0), 0)

        return (
          <Form.Item style={{ marginBottom: 0 }}>
            <Input
              onChange={(value) => calculation(record._id)}
              value={totalQtySold}
              style={{ width: 80, marginBottom: 0 }}
            />
          </Form.Item>
        )
      },
    },

    {
      title: 'Qty Actual',
      dataIndex: 'semua_qty',
      render: (text: string, record: any) => {
        let stokAwal = 0
        const dataPos = posDetailData?.filter(
          (jual) =>
            jual.id_data_barang === record.id_data_barang &&
            jual.id_outlet === idOutletLoggedIn
        )
        const dataBeli = posBeliData?.filter(
          (product) =>
            product.id_data_barang === record.id_data_barang &&
            product.id_outlet === idOutletLoggedIn
        )

        const totalQtySold =
          stokAwal +
          dataPos.reduce(
            (total, product) => total + (product.qty_sold || 0),
            0
          ) +
          dataBeli.reduce((buy, barang) => buy + (barang.qty_sold || 0), 0)

        return (
          <Form.Item style={{ marginBottom: 0 }}>
            <Input
              onChange={(value) => calculation(record._id)}
              value={selisihPerBarang[record.id_data_barang] || ''}
              style={{ width: 80, marginBottom: 0 }}
            />
          </Form.Item>
        )
      },
    },

    // {
    //   title: 'Qty Actual',
    //   dataIndex: 'semua_qty',
    //   render: (record: any) => {
    //     console.log({ record })

    //     return (
    //       <Form.Item style={{ marginBottom: 0 }}>
    //         <Input
    //           onChange={(value) => calculation(record._id)}
    //           // value={totalQtySold}
    //           style={{ width: 80, marginBottom: 0 }}
    //         />
    //       </Form.Item>
    //     )
    //   },
    // },

    // {
    //   title: 'Qty Actual',
    //   dataIndex: 'qty_actual',
    //   render: (text: string, record: Peso) => (
    //     <Form.Item
    //       name={[record._id, 'qty_actual']}
    //       style={{ marginBottom: 0, width: 100 }}
    //     >
    //       <Input readOnly value={text} />
    //     </Form.Item>
    //   ),
    // },

    // {
    //   title: 'Qty Tercatat',
    //   dataIndex: 'qty_tercatat',

    //   render: (text: string, record: Peso) => (
    //     <Form.Item
    //       name={[record._id, 'qty_tercatat']}
    //       style={{ marginBottom: 0, width: 100 }}
    //     >
    //       <Input
    //         onChange={(value) => {
    //           if (value !== null && value !== undefined) {
    //             calculation(record._id)
    //           }
    //         }}
    //         readOnly
    //       />
    //     </Form.Item>
    //   ),
    // },

    // {
    //   title: 'Selisih',
    //   dataIndex: 'qty_sold',
    //   render: (text: string, record: Peso) => {
    //     const cui = posDetailData?.find(
    //       (product) =>
    //         product.id_data_barang === record.id_data_barang &&
    //         product.id_outlet === idOutletLoggedIn
    //     )

    //     return (
    //       <Form.Item
    //         name={[record._id, 'qty_sold']}
    //         style={{ marginBottom: 0 }}
    //       >
    //         <Input
    //           defaultValue={AmbilData ? String(record.qty_sold) : undefined}
    //           onChange={(e) => {
    //             const userInput = e.target.value
    //             console.log('Inputan pengguna:', userInput)

    //             const stokAwal = 0
    //             const dataPos = posDetailData?.filter(
    //               (jual) =>
    //                 jual.id_data_barang === record.id_data_barang &&
    //                 jual.id_outlet === idOutletLoggedIn
    //             )
    //             const dataBeli = posBeliData?.filter(
    //               (product) =>
    //                 product.id_data_barang === record.id_data_barang &&
    //                 product.id_outlet === idOutletLoggedIn
    //             )

    //             const totalQtySold =
    //               stokAwal +
    //               dataPos.reduce(
    //                 (total, product) => total + (product.qty_sold || 0),
    //                 0
    //               ) +
    //               dataBeli.reduce(
    //                 (buy, barang) => buy + (barang.qty_sold || 0),
    //                 0
    //               )

    //             const selisih = totalQtySold - parseInt(userInput)
    //             setSelisih(selisih)

    //             handleQtyChange(userInput, record._id)
    //           }}
    //           style={{ width: 60 }}
    //         />
    //       </Form.Item>
    //     )
    //   },
    // },

    {
      title: 'Selisih',
      dataIndex: 'qty_sold',
      render: (text: string, record: Peso) => {
        const cui = posDetailData?.find(
          (product) =>
            product.id_data_barang === record.id_data_barang &&
            product.id_outlet === idOutletLoggedIn
        )

        return (
          <Form.Item
            name={[record._id, 'qty_sold']}
            style={{ marginBottom: 0 }}
          >
            <Input
              defaultValue={AmbilData ? String(record.qty_sold) : undefined}
              onChange={(e) => {
                const userInput = e.target.value

                const stokAwal = 0
                const dataPos = posDetailData?.filter(
                  (jual) =>
                    jual.id_data_barang === record.id_data_barang &&
                    jual.id_outlet === idOutletLoggedIn
                )
                const dataBeli = posBeliData?.filter(
                  (product) =>
                    product.id_data_barang === record.id_data_barang &&
                    product.id_outlet === idOutletLoggedIn
                )

                const totalQtySold =
                  stokAwal +
                  dataPos.reduce(
                    (total, product) => total + (product.qty_sold || 0),
                    0
                  ) +
                  dataBeli.reduce(
                    (buy, barang) => buy + (barang.qty_sold || 0),
                    0
                  )

                const selisih = totalQtySold - parseInt(userInput)
                console.log({ selisih })

                setSelisihPerBarang((prevState) => ({
                  ...prevState,
                  [record.id_data_barang]: selisih,
                }))

                handleQtyChange(userInput, record._id)
              }}
              style={{ width: 60 }}
            />
          </Form.Item>
        )
      },
    },

    {
      title: 'Harga Jual',
      dataIndex: 'harga_jual',

      render: (text: string, record: Peso) => (
        <Form.Item
          name={[record._id, 'harga_jual']}
          rules={[
            {
              required: true,
              message: `Please input Harga Jual!`,
            },

            ({ getFieldValue }) => ({
              validator(_, value) {
                const hargaInput = parseInt(value, 10)
                const hargaTinggi = parseInt(
                  hargaBadge[record._id]?.tinggi || '0',
                  10
                )
                const hargaRendah = parseInt(
                  hargaBadge[record._id]?.rendah || '0',
                  10
                )
                if (hargaInput >= hargaRendah && hargaInput <= hargaTinggi) {
                  return Promise.resolve()
                }
                return Promise.reject(
                  new Error(
                    `Harga harus antara ${hargaRendah} dan ${hargaTinggi}!`
                  )
                )
              },
            }),
          ]}
          style={{ marginBottom: 0, width: 100 }}
        >
          <Input
            defaultValue={AmbilData ? String(record.harga_jual) : undefined}
            onChange={(value) => {
              if (value !== null && value !== undefined) {
                calculation(record._id)
              }
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Satuan',
      dataIndex: 'satuan',

      render: (text: string, record: Peso) => (
        <Form.Item
          name={[record._id, 'satuan']}
          style={{ marginBottom: 0, width: 100 }}
        >
          <Select
            onChange={(value) => {
              if (value !== null && value !== undefined) {
                calculation(record._id)
              }
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Harga Rata-Rata',
      dataIndex: 'total_semua',
      render: (text: string, record: Peso) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Form.Item
            style={{
              flex: 1,
              marginRight: '8px',
              marginBottom: 0,
              width: 100,
            }}
            name={[record._id, 'total_semua']}
            rules={[
              {
                required: true,
                message: `Please input Jumlah!`,
              },
            ]}
          >
            <Input
              readOnly
              defaultValue={AmbilData ? String(record.total_semua) : undefined}
            />
          </Form.Item>
          <DeleteOutlined
            onClick={() => handleRemove(record._id)}
            style={{
              // marginBottom: '2px',
              color: 'red',
              border: '1px solid red',
              padding: '7px',
            }}
          />
        </div>
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
              <h1 style={{ fontSize: '2.5rem' }}>Penyesuaian Stok</h1>
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
              <div className="my-select-container">
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
                  onChange={(value) => setSelectedOutletId(value)}
                  defaultValue={user?.id_outlet}
                >
                  {outletsData?.map((Itsonyou: Outlet) => (
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
                {AmbilData &&
                getPembelianDetail &&
                getPembelianDetail.length > 0
                  ? parseFloat(getPembelianDetail[0]?.piutang) <= 0
                    ? 'Lunas'
                    : parseFloat(getPembelianDetail[0]?.bayar) > 0
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
              {/* <div style={{ marginBottom: '8px' }}>Nama Suppliers</div> */}
              {/* <Form.Item>
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
                  value={selectedSupplierId || undefined}
                  onChange={(value) => {
                    setSelectedSupplierId(value)
                    handlePelangganChange(value)
                  }}
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <Divider style={{ margin: '4px 0' }} />
                      <Col
                        span={4}
                        style={{ padding: '8px', textAlign: 'center' }}
                      >
                        <Link to="/form-supplier">
                          <Button
                            icon={<AiOutlinePlus />}
                            style={{
                              background: 'transparent',
                            }}
                          />
                        </Link>
                      </Col>
                    </div>
                  )}
                >
                  {suppliers?.map((suppleir: Supplier) => (
                    <Select.Option key={suppleir._id} value={suppleir._id}>
                      {suppleir.nama_supplier}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item> */}
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
              <Input value={currentIdPeso} style={{ width: '100%' }} disabled />
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
                Tanggal
                <br />
                <Form.Item>
                  <DateCicil
                    onChange={(dates: string) => {
                      setDateCicilan(dates)
                    }}
                    disabled={false}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div>
            <div
              style={{
                flex: '1',
                flexBasis: '40%',
                textAlign: 'right',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                Tag
                {/* <TagPage /> */}
                <br />
              </div>
            </div>
          </div>

          <br />
          <div style={{ textAlign: 'left', justifyContent: 'center' }}>
            <div>Akun:</div>
            <Form.Item
              name="via"
              rules={[
                {
                  required: true,
                  validator: (_, value) => {
                    if (!value || value === '0') {
                      return Promise.reject(new Error('Harap pilih bank!'))
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                value={via}
                defaultValue="Penyesuaian Persediaan"
                onChange={(value) => {
                  setSelectedBank(value)
                  setVia(value)
                }}
                filterOption={(input, option) =>
                  option?.children
                    ? option.children
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    : false
                }
                placeholder="Pilih bank"
              >
                {coas?.map((e) => (
                  <Select.Option key={e._id} value={e.nama_akun}>
                    {e.nama_akun}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form form={form}>
            <Table
              dataSource={poss}
              columns={columns}
              rowKey={(record) => record._id}
              pagination={false}
              rowClassName={() => 'testos'}
            />
          </Form>

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
                onClick={handleAdd}
                style={{
                  width: 350,
                  height: 30,
                }}
              >
                + Tambah Baris
              </Button>
            </div>
          </div>
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
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                  />
                </Panel>
              </Collapse>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <Form.Item>
              <Button
                size="small"
                onClick={() => {
                  handleSave()
                  navigate(`/pesoDetail/${currentIdPeso}`)
                }}
                type="primary"
                disabled={hasError}
                style={{
                  background: '#0190fe',
                  width: '50%',
                  height: '2.2rem',
                  color: 'white',

                  marginTop: '10px',
                  justifyContent: 'right',
                }}
              >
                <AiOutlineSave style={{ marginRight: 7, marginTop: -4 }} />
                Simpan
              </Button>
            </Form.Item>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PesoPages
