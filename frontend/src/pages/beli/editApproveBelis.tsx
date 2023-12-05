import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  Badge,
  Button,
  Col,
  Collapse,
  Divider,
  Dropdown,
  Form,
  Input,
  InputRef,
  Menu,
  message,
  Select,
  Table,
  Tag,
  theme,
  Tooltip,
} from 'antd'
import {
  useGetProductsQuery,
  useUpdateProductMutation,
} from '../../hooks/productHooks'
import { Beli } from '../../types/Beli'
import { DeleteOutlined } from '@ant-design/icons'
import { useGetStoksQuery, useUpdateStokMutation } from '../../hooks/stokHooks'
import { SaveOutlined } from '@ant-design/icons'
import {
  useDeletePosMutation,
  useGetPosDetailQuery,
  useUpdatePosMutation,
} from '../../hooks/posHooks'
import { v4 as uuidv4 } from 'uuid'

import moment from 'moment'

import { Harga } from '../../types/Harga'
import { useGetHargasQuery } from '../../hooks/hargaHooks'
import { Multi } from '../../types/Multi'
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
import { PlusOutlined } from '@ant-design/icons'

import DateRange from '../DateRange'
import dayjs, { Dayjs } from 'dayjs'
import '../../index.css'

import { Placeholder } from 'react-bootstrap'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import {
  useAddCicilanMutation,
  useGetCicilanByIdQuery,
} from '../../hooks/cicilanHooks'
import { Cicilan } from '../../types/Cicilan'
import UserContext from '../../contexts/UserContext'
import { Outlet } from '../../types/Outlet'
import PosPrintKomponent from '../printcoba/PosPrintKomponent'
import { genRadiusStyle } from 'antd/es/input-number/style'

import DateCicil from '../DateCicilan'
import { useGetSatuansQuery } from '../../hooks/satuanHooks'
import { Satuan } from '../../types/Satuan'
import SatuanPage from '../SatuanPage'
import TextArea from 'antd/es/input/TextArea'
import { find, sortedIndex } from 'lodash'

import TagPage from '../pos/TagPage'
import IDRInput from '../pos/IdrInput'
import { useGetSuppliersQuery } from '../../hooks/supplierHooks'
import { Supplier } from '../../types/Supplier'
import {
  useAddBeliMutation,
  useUpdateBeliMutation,
} from '../../hooks/beliHooks'

import {
  useAddPembelianMutation,
  useGetPembelianByIdQuery,
  useUpdatePembelianMutation,
} from '../../hooks/pembelianHooks'
import {
  useAddCicilanBeliMutation,
  useGetCicilanBeliByIdQuery,
} from '../../hooks/cicilanBeliHooks'

import { useGetMultisQuery } from '../../hooks/multiHooks'
import { useGetPajaksQuery } from '../../hooks/pajakHooks'
import { Pajak } from '../../types/Pajak'
import { useAddTagMutation, useGetTagsQuery } from '../../hooks/tagHooks'
import { TweenOneGroup } from 'rc-tween-one'
import { useGetPelanggansQuery } from '../../hooks/pelangganHooks'
import {
  useGetApproveBeliByIdQuery,
  useGetApproveBeliDetailQuery,
  useUpdateApproveBeliMutation,
} from '../../hooks/approveBeliHooks'
import { useGetReturBeliByIdQuery } from '../../hooks/returBeliHooks'
import { useGetReturByIdQuery } from '../../hooks/returHooks'
import { useGetPesoDetailQuery } from '../../hooks/pesoHooks'
import { useGetPindahByIdQuery } from '../../hooks/pindahHooks'

const EditApproveBelis: React.FC = () => {
  const { id_beli } = useParams<{ id_beli?: string }>()

  const AmbilData = !!id_beli

  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  let idOutletLoggedIn = ''

  if (user) {
    idOutletLoggedIn = user.id_outlet
  }

  const navigate = useNavigate()
  const { Panel } = Collapse
  const { token } = theme.useToken()
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<InputRef>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const [tags, setTags] = useState<string[]>([])
  const [showAddForm, setShowAddForm] = useState(false)

  const addTagMutation = useAddTagMutation()
  const [isEditing, setIsEditing] = useState(false)
  const handleEditClick = () => {
    setIsEditing(true)
  }

  const { data: gorets } = useGetTagsQuery()

  useEffect(() => {
    if (gorets) {
      const namaTag = gorets.map((colek) => colek.nama_tag).flat()
      setTags(namaTag)
    }
  }, [gorets])

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag)
    setTags(newTags)

    if (selectedTags.includes(removedTag)) {
      const newSelectedTags = selectedTags.filter((tag) => tag !== removedTag)
      setSelectedTags(newSelectedTags)
    }
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
  }

  const handleAddTagClick = () => {
    setShowAddForm(true)
  }

  const handleSaveTag = () => {
    if (inputValue) {
      setSelectedTags([...selectedTags, inputValue])
      setInputValue('')

      setShowAddForm(false)
    }
  }

  const tagOptions = tags.map((tag) => (
    <Select.Option key={tag} value={tag}>
      {tag}
    </Select.Option>
  ))

  const onChange = (key: string | string[]) => {}
  const text = ''

  const { data: getApproveBeliDetail } = useGetApproveBeliDetailQuery(
    id_beli as string
  )
  const { data: cicilansBeli } = useGetCicilanBeliByIdQuery(id_beli as string)

  const { data: getPembelianDetail } = useGetPembelianByIdQuery(
    id_beli as string
  )
  const { data: multis } = useGetMultisQuery()

  const { data: pajaks } = useGetPajaksQuery()

  const { data: satuans } = useGetSatuansQuery()
  const updatePosMutation = useUpdateApproveBeliMutation()
  const { mutate: deletePosMutation } = useDeletePosMutation()

  const [form] = Form.useForm()
  const [inputanState, setInputanState] = useState(0)

  const [showDp, setShowDp] = useState(false)

  const handleUangMukaClick = () => {
    setShowDp(!showDp)

    if (!showDp) {
      form.setFieldsValue({ via: null })

      setVia('')
      setSelectedBank('')
    }
  }

  const [showAddDiscount, setShowAddDiscount] = useState(false)

  const handleAddDiscount = () => {
    setShowAddDiscount(!showAddDiscount)

    if (!showAddDiscount) {
      form.setFieldsValue({ via: null })

      setVia('')
      setSelectedBank('')
    }
  }
  const [showAddKirim, setShowAddKirim] = useState(false)
  const handleAddKirim = () => {
    setShowAddKirim(!showAddKirim)

    if (!showAddKirim) {
      form.setFieldsValue({ via: null })

      setVia('')
      setSelectedBank('')
    }
  }

  const [showNote, setShowNote] = useState(false)

  // useEffect(() => {
  //   if (AmbilData) {
  //     if (getApproveBeliDetail) {
  //       const formData = getApproveBeliDetail.reduce<{ [key: string]: Beli }>(
  //         (acc, curr) => {
  //           acc[curr._id] = {
  //             ...curr,
  //           }
  //           return acc
  //         },
  //         {}
  //       )

  //       setPoss(getApproveBeliDetail as any)

  //       form.setFieldsValue(formData)

  //       getApproveBeliDetail.forEach((detail) => {
  //         const multiItem = multis?.find(
  //           (multi) =>
  //             multi.id_data_barang === detail.id_data_barang &&
  //             multi.id_harga === detail.id_harga
  //         )

  //         if (multiItem) {
  //           setHargaBadge((prevState) => ({
  //             ...prevState,
  //             [detail._id]: {
  //               tinggi: multiItem.harga_tertinggi.toString(),
  //               rendah: multiItem.harga_terendah.toString(),
  //             },
  //           }))
  //         }
  //       })
  //     }

  //     if (getPembelianDetail && getPembelianDetail.length > 0) {
  //       setSelectedSupplierId(getPembelianDetail[0].id_supplier || null)
  //     }
  //     if (getPembelianDetail && getPembelianDetail.length > 0) {
  //       setTotalSemua(parseFloat(getPembelianDetail[0].total_semua) || null)
  //     }
  //   }
  // }, [AmbilData, getApproveBeliDetail, getPembelianDetail, form, multis])

  const [price, setPrice] = useState('')

  const handleHargaChanging = (value: any) => {
    setPrice(value)
  }

  const { mutate: addCicilan } = useAddCicilanBeliMutation()
  const [selectedOutletId, setSelectedOutletId] = useState('')

  const { data: hargas } = useGetHargasQuery()

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

  const [poss, setPoss] = useState<Beli[]>([])

  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [selisih, setSelisih] = useState<number>(0)
  const [idOutet, setIdOutlet] = useState<String>('1')

  const generateShortInvoiceId = (): string => {
    if (AmbilData) {
      return id_beli
    }
    const uuid = uuidv4()
    const last4OfUUID = uuid.substr(uuid.length - 4)
    const shortNumber = parseInt(last4OfUUID, 16) % 10000
    return `INV${String(shortNumber).padStart(4, '0')}`
  }
  const { data: pelanggans } = useGetPelanggansQuery()
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

  const addBeliMutation = useAddBeliMutation()

  const [currentIdBeli, setcurrentIdBeli] = useState(generateShortInvoiceId())
  const [date, setDate] = useState<Date>(new Date())
  const addPembelianMutation = useAddPembelianMutation()
  const updatePembelianMutation = useUpdatePembelianMutation()
  const updateStokMutation = useUpdateStokMutation()
  const updatedProductMutation = useUpdateProductMutation()
  const [id_harga, setIdHarga] = useState<string | null>(null)

  const handlePelangganChange = (supplierId: string) => {
    const selectedPelanggan = suppliers?.find((p) => p._id === supplierId)
    if (selectedPelanggan) {
      setIdHarga(selectedPelanggan.id_harga)
      setSelectedIdHarga(selectedPelanggan.id_harga)
    }
  }

  const [selectedIdHarga, setSelectedIdHarga] = useState<string | null>(null)

  const [stokPerProduk, setStokPerProduk] = useState<{ [key: string]: number }>(
    {}
  )

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

  const [stokCount, setStokCount] = useState<number>(0)
  const [hasError, setHasError] = useState(false)

  const handleQtyChange = (
    value: number | string | null | undefined,
    posId: string
  ) => {
    let newValue: number

    if (AmbilData) {
      const relevantDetail = getApproveBeliDetail!.find(
        (detail) => detail._id === posId
      )

      newValue = relevantDetail ? relevantDetail.qty_sold : 0
    } else {
      newValue = typeof value === 'number' ? value : 0
    }

    setPoss((prevPoss) => {
      return prevPoss.map((pos) => {
        if (pos._id === posId) {
          return {
            ...pos,
            qty_sold: newValue,
          }
        }
        return pos
      })
    })

    calculation(posId, selectedJenisPajak as string)
  }

  const handleJenisHargaChange = (hargaId: string, posId: string) => {
    const currentPos = form.getFieldValue(posId)

    if (currentPos && currentPos.id_data_barang) {
      const selectedMulti = multis?.find(
        (m) =>
          m.id_data_barang === currentPos.id_data_barang &&
          m.id_harga === hargaId
      )

      if (selectedMulti) {
        form.setFieldsValue({
          [posId]: {
            ...currentPos,
            harga_jual: selectedMulti.harga_tertinggi,
            harga_jual_rendah: selectedMulti.harga_terendah,
            id_harga: hargaId,
          },
        })

        setHargaBadge((prevState) => ({
          ...prevState,
          [posId]: {
            tinggi: selectedMulti.harga_tertinggi.toString(),
            rendah: selectedMulti.harga_terendah.toString(),
          },
        }))

        calculation(posId, selectedJenisPajak as string)
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
  const [catatan, setCatatan] = useState('')

  const handleSaveInvoice = () => {
    handleSave()
    const piutangValue =
      isPiutang() && total_semua !== null ? total_semua - gabungNm : 0

    const tempo = nm === total_semua ? 0 : selisih

    const piutangYangAkanDisimpan = nilaiPiutang - nm
    let pay
    if (nm >= total_semua) {
      pay = total_semua.toString()
    } else {
      pay = nm.toString()
    }

    const invoiceToSave = {
      _id: '',
      id_beli: currentIdBeli,
      inv: currentIdBeli || undefined,
      total_semua: total_semua ? Number(total_semua) - Number(nmDiskon) : '',
      diskon: Number(tote),
      bayar: pay,

      kembalian: kembalian.toString(),
      tanggal_mulai: selectedDates[0],
      tanggal_akhir: selectedDates[1],

      via: via ? via.toString() : '0',
      piutang: AmbilData
        ? piutangYangAkanDisimpan.toString()
        : piutangValue.toString(),

      id_supplier: selectedSupplierId || undefined,
      selisih: tempo,
      id_harga: id_harga || '0',
      id_outlet: user?.id_outlet || '',
      catatan: catatan || '-',
      sub_total: total_semua,
      jumlahPajaks: total_semua,
    }

    if (AmbilData) {
      updatePembelianMutation.mutate(invoiceToSave as any)
    } else {
      addPembelianMutation.mutate(invoiceToSave as any, {
        onSuccess: () => {},
      })
    }
  }

  const handleAdd = () => {
    const newCount = count + 1
    setCount(newCount)
    localStorage.setItem('count', newCount.toString())
    const tempId = `temp-${newCount}`

    const idHargaToUse =
      selectedIdHarga || getIdHargaFromSupplier(selectedSupplierId) || '0'

    const newData: Beli = {
      _id: tempId,
      id_beli: currentIdBeli,
      id_data_barang: '',
      harga_jual: '0',
      total: '0',
      diskon: '0',
      id_harga: idHargaToUse,
      qty_sold: 1,
      inv: currentIdBeli,
      biji: 0,
      id_outlet: user?.id_outlet || '',
      id_satuan: '',
      id_pajak: '',
      jumlah_pajak: '',
      jenis_pajak: '',
      tag: selectedTags,
      sumber: '',
    }

    setPoss((prevPoss) => [...prevPoss, newData])
    form.setFieldsValue({
      [newData._id]: {
        _id: '',
        id_beli: currentIdBeli,
        id_data_barang: '',
        qty_sold: 1,
        harga_jual: '0',
        total: '0',
        diskon: '0',
        tanggal: date,
        via: '0',
        id_supplier: '0',
        inv: currentIdBeli,
        biji: 0,
        id_outlet: user?.id_outlet || '',
        id_satuan: '0',
        id_pajak: '0',
        jumlah_pajak: '0',
        jenis_pajak: '--',
        tag: selectedTags.join(','),
        sumber: '',
      },
    })
  }

  const { id_pos } = useParams<{ id_pos?: string }>()
  const { id_peso } = useParams<{ id_peso?: string }>()
  const { id_pindah } = useParams<{ id_pindah?: string }>()

  const { data: beliDetailData = [] } = useGetApproveBeliByIdQuery(
    id_beli || ''
  )
  const { data: returBuyDetail = [] } = useGetReturBeliByIdQuery(id_beli || '')
  const { data: returJualDetailData = [] } = useGetReturByIdQuery(id_pos || '')
  const { data: pesoDetailData = [] } = useGetPesoDetailQuery(id_peso || '')
  const { data: pindahDetailData = [] } = useGetPindahByIdQuery(id_pindah || '')

  const [berubahBarang, setBerubahBarang] = useState()
  const [totalSemuaQty, setTotalSemuaQty] = useState()
  console.log({ totalSemuaQty })

  const handleProductChange = (productId: string, posId: string) => {
    let stokAwal = 0
    const product = products?.find((p) => p._id === productId)
    if (!product) return

    const idHargaForSelectedSupplier =
      getIdHargaFromSupplier(selectedSupplierId)

    const totalQtySold = posDetailData.reduce((total, product) => {
      if (
        product.id_data_barang === productId &&
        product.id_outlet === idOutletLoggedIn
      ) {
        return total + (product.qty_sold || 0)
      }
      return total
    }, 0)
    const totalQtyBeli = beliDetailData.reduce((total, product) => {
      if (
        product.id_data_barang === productId &&
        product.id_outlet === idOutletLoggedIn
      ) {
        return total + (product.qty_sold || 0)
      }
      return total
    }, 0)
    const totalReturBuy = returBuyDetail.reduce((returningBuy, backing) => {
      if (
        backing.id_data_barang === productId &&
        backing.id_outlet === idOutletLoggedIn
      ) {
        return returningBuy + (backing.qty_retur || 0)
      }
      return returningBuy
    }, 0)
    const totalReturSale = returJualDetailData.reduce(
      (returningTotalSale: any, selling: any) => {
        if (
          selling.id_data_barang === productId &&
          selling.id_outlet === idOutletLoggedIn
        ) {
          return returningTotalSale + (selling.qty_retur || 0)
        }
        return returningTotalSale
      },
      0
    )
    const pesoDetail = pesoDetailData.reduce(
      (returningTotalSale: any, selling: any) => {
        if (
          selling.id_data_barang === productId &&
          selling.id_outlet === idOutletLoggedIn
        ) {
          return returningTotalSale + (selling.qty_sold || 0)
        }
        return returningTotalSale
      },
      0
    )
    const pindahDetailDari = pindahDetailData.reduce(
      (returningTotalSale: any, selling: any) => {
        if (
          selling.id_data_barang === productId &&
          selling.id_outlet === idOutletLoggedIn
        ) {
          return returningTotalSale + (selling.qty_beri || 0)
        }
        return returningTotalSale
      },
      0
    )
    const pindahDetailTujuan = pindahDetailData.reduce(
      (returningTotalSale: any, selling: any) => {
        if (
          selling.id_data_barang === productId &&
          selling.id_outlet === idOutletLoggedIn
        ) {
          return returningTotalSale + (selling.qty_beri || 0)
        }
        return returningTotalSale
      },
      0
    )
    const totalitas =
      stokAwal +
      totalReturSale +
      totalQtyBeli +
      pindahDetailDari +
      pesoDetail -
      totalQtySold -
      totalReturBuy -
      pindahDetailTujuan

    setTotalSemuaQty(totalitas as any)
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

    form.setFieldsValue({
      [posId]: {
        ...form.getFieldValue(posId),
        id_data_barang: product._id,
        harga_jual: hargaToShow,
        harga_jual_rendah: hargaTerendahToShow,
        qty_sold: 0,
        bayar: 0,
        semua_qty: totalitas,
      },
    })

    const relatedStok = stokku?.find((s) => s.id_data_barang === productId)
    const stokCount = relatedStok ? relatedStok.jumlah_stok : 0

    setStokCount(stokCount)

    setStokPerProduk((prevState) => ({ ...prevState, [posId]: stokCount }))

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

    calculation(posId, selectedJenisPajak as string)
  }

  const [todes, setTodes] = useState()
  const [jenisPajakTotal, setJenisPajakTotal] = useState<{
    [jenisPajak: string]: number
  }>({})

  const anehdiskon = todes
  // const [totalPerbaris, setTotalPerbaris] = useState<any>()
  const [barista, setBarista] = useState<any>()

  const calculation = (posId: string, selectedJenisPajak: string) => {
    const currentFields = form.getFieldValue(posId)

    if (currentFields) {
      const { qty_sold, harga_jual, diskon } = currentFields

      const total = parseInt(qty_sold) * parseInt(harga_jual) - parseInt(diskon)

      const selectedPajak = pajaks?.find(
        (pajak) => pajak.jenis_pajak === selectedJenisPajak
      )
      const totalPajak = selectedPajak
        ? (total * parseInt(selectedPajak.jumlah_pajak)) / 100
        : 0
      //uhuh

      form.setFieldsValue({
        [posId]: {
          ...currentFields,
          total: total.toString(),
          jumlah_pajak: totalPajak.toString() || 0,
          jenis_pajak: selectedJenisPajak || '--',
        },
      })

      hitungTotalSemua()

      const allTax = form.getFieldsValue()
      const jenisPajakTotal: { [jenisPajak: string]: number } = {}

      Object.values(allTax).forEach((field: any) => {
        if (field && field.jumlah_pajak && field.jenis_pajak) {
          const taxAmount = parseInt(field.jumlah_pajak)
          const taxType = field.jenis_pajak

          if (jenisPajakTotal[taxType]) {
            jenisPajakTotal[taxType] += taxAmount
          } else {
            jenisPajakTotal[taxType] = taxAmount
          }
        }
      })
      setJenisPajakTotal(jenisPajakTotal)

      const allFields = form.getFieldsValue()
      const totalDiskon = Object.values(allFields).reduce(
        (accumulator: number, field: any) => {
          if (field && field.diskon) {
            accumulator += parseInt(field.diskon)
          }
          return accumulator
        },
        0
      )
      setTodes(totalDiskon as any)
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
  const [selectedJenisPajak, setSelectedJenisPajak] = useState('')

  const handleJenisPajakChange = (value: any) => {
    setSelectedJenisPajak(value)
  }

  const [diskon, setDiskon] = useState(0)
  const [via, setVia] = useState('0')

  const [total_semua, setTotalSemua] = useState<any>(null)
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

  const handleDiscountChange = (event: any) => {
    const disini = event.target.value

    setNmDiskon(disini)
  }

  useEffect(() => {
    if (total_semua != null) {
      setInputanDiskon(Number(total_semua) - Number(nmDiskon))
    } else {
      setInputanDiskon(total_semua)
    }
  }, [nmDiskon])
  const gabungNm = Number(nm) + Number(nmDiskon)

  const onChangeKirim = (event: any) => {
    const antar = event.target.value
    setNmKirim(antar)
  }

  useEffect(() => {
    if (total_semua != null) {
      setInputanKirim(Number(total_semua) - Number(nmKirim))
    } else {
      setInputanKirim(total_semua)
    }
  }, [nmKirim])

  const handleBayarChange = (value: any) => {
    const numericValue =
      typeof value === 'string' ? parseInt(value.replace(/\./g, ''), 10) : value

    if (numericValue !== null && numericValue !== undefined) {
      const totalBayarDariPembelianDetail =
        getPembelianDetail && getPembelianDetail.length > 0
          ? parseFloat(getPembelianDetail[0].bayar as string)
          : 0

      const totalPiutangDariPembelianDetail =
        getPembelianDetail && getPembelianDetail.length > 0
          ? parseFloat(getPembelianDetail[0].piutang as string)
          : 0

      const addonBefore = total_semua - numericValue

      setKalku(addonBefore)
      const blockInputan = numericValue > totalPiutangDariPembelianDetail
      setWarnInputan(blockInputan)

      setNm(numericValue as any)

      if (numericValue > 0) {
        setIsBayarFilled(true)
      } else {
        setIsBayarFilled(false)
      }
    }
  }
  const tote = Number(anehdiskon) + Number(nmDiskon)

  const [kembalian, setKembalian] = useState(0)
  useEffect(() => {
    if (total_semua !== null) {
      setKembalian(nm - total_semua)
    } else {
      setKembalian(0)
    }
  }, [nm, total_semua])

  const hitungTotalSemua = (list = poss) => {
    let total = list.reduce((sum, pos) => {
      const nilaiTotalPos = form.getFieldValue(pos._id)?.total || '0'
      return sum + parseInt(nilaiTotalPos, 10)
    }, 0)
    total = total - diskon

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

      const { _id, ...posDataToSave } = posFormData

      if (AmbilData) {
        updatePosMutation.mutate({ _id, ...posDataToSave })
      }
    })
  }
  const [selectedBank, setSelectedBank] = useState<string | null>(null)

  const isPiutang = (): boolean => {
    return total_semua ? total_semua > nm : false
  }

  const [abcd, setAbcd] = useState('')

  const [jumlahPajaks, setJumlahPajaks] = useState<{ [key: string]: any }>({})

  const handlePerubahanJenisPajak = (jenisPajakId: any, recordId: string) => {
    const selectedPajak = pajaks?.find((pajak) => pajak._id === jenisPajakId)

    if (selectedPajak) {
      const selectedJumlahPajak = parseFloat(selectedPajak.jumlah_pajak)
      if (!isNaN(selectedJumlahPajak) && !isNaN(barista)) {
        const hasilPerhitungan = (selectedJumlahPajak / 100) * barista
        setJumlahPajaks((prevJumlahPajaks) => ({
          ...prevJumlahPajaks,
          [recordId]: hasilPerhitungan.toString(),
        }))
      } else {
        setJumlahPajaks((prevJumlahPajaks) => ({
          ...prevJumlahPajaks,
          [recordId]: '',
        }))
      }
    } else {
      setJumlahPajaks((prevJumlahPajaks) => ({
        ...prevJumlahPajaks,
        [recordId]: '',
      }))
    }
  }

  const [pujuk, sttPujuk] = useState<any>()
  useEffect(() => {
    if (jumlahPajaks && barangSelected != null) {
      sttPujuk(jumlahPajaks)
    } else {
      sttPujuk('')
    }
  }, [abcd])

  let index = -1
  pajaks?.some((object, idx) => {
    if (object.jenis_pajak === abcd) {
      index = idx
      return true
    }
  })

  const { data: posDetailData = [] } = useGetPosDetailQuery(id_pos || '')

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
      render: (text: string, record: Beli) => {
        const barang = posDetailData?.filter(
          (product) =>
            product.id_data_barang === record.id_data_barang &&
            product.id_outlet === idOutletLoggedIn
        )

        const totalQtySold = barang.reduce(
          (total, product) => total + (product.qty_sold || 0),
          0
        )

        console.log('Total qty_sold:', totalQtySold)

        const currentFields = form.getFieldValue(record._id)

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
              <Badge
                // count={totalQtySold.toLocaleString()}
                showZero
                style={{
                  backgroundColor: totalQtySold <= 10 ? 'red' : 'green',
                  position: 'absolute',
                  right: '-310px',
                  top: '-27px',
                  zIndex: 2,

                  visibility:
                    AmbilData || barangSelected ? 'visible' : 'hidden',
                }}
                overflowCount={9999}
              />
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
      title: 'Qty',
      dataIndex: 'qty_sold',
      render: (text: string, record: Beli) => {
        const cui = stokku?.find(
          (product) =>
            product.id_data_barang === record.id_data_barang &&
            product.id_outlet === idOutletLoggedIn
        )
        const stokCount = cui ? cui.jumlah_stok : 0

        let bijis = stokCount

        if (AmbilData) {
          const seeds = getApproveBeliDetail?.find(
            (product) =>
              product.id_data_barang === record.id_data_barang &&
              product.id_outlet === idOutletLoggedIn
          )
          bijis = seeds ? seeds.biji : 0
        }

        return (
          <Form.Item
            name={[record._id, 'qty_sold']}
            // rules={[
            //   {
            //     required: true,
            //     message: `Masukkan Qty!`,
            //   },
            //   ({ getFieldValue }) => ({
            //     validator(_, value) {
            //       const qtyInput = parseInt(value, 10)

            //       if (!AmbilData && stokCount <= 0) {
            //         setHasError(true)
            //         return Promise.reject(new Error('Stok produk kosong!'))
            //       }

            //       if (!AmbilData && qtyInput > stokCount) {
            //         setHasError(true)
            //         return Promise.reject(
            //           new Error('Jumlah input melebihi stok yang tersedia!')
            //         )
            //       }

            //       if (AmbilData && (isNaN(qtyInput) || qtyInput > bijis)) {
            //         setHasError(true)
            //         return Promise.reject(
            //           new Error('Jumlah input melebihi stok yang tersedia!')
            //         )
            //       }

            //       setHasError(false)
            //       return Promise.resolve()
            //     },
            //   }),
            // ]}
            style={{ marginBottom: 0 }}
          >
            <Input
              defaultValue={AmbilData ? String(record.qty_sold) : undefined}
              disabled={!AmbilData && stokCount <= 0}
              onChange={(e) => handleQtyChange(e.target.value, record._id)}
              style={{ width: 60 }}
            />
          </Form.Item>
        )
      },
    },

    {
      title: 'Harga beli',
      dataIndex: 'harga_jual',

      render: (text: string, record: Beli) => (
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
                calculation(record._id, selectedJenisPajak as string)
              }
            }}
          />
        </Form.Item>
      ),
    },

    {
      title: 'Diskon',
      dataIndex: 'diskon',
      render: (text: string, record: Beli) => (
        <Form.Item
          name={[record._id, 'diskon']}
          rules={[
            {
              required: true,
              message: `Please input Diskon!`,
            },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Input
            onChange={() =>
              calculation(record._id, selectedJenisPajak as string)
            }
            defaultValue={AmbilData ? String(record.diskon) : undefined}
          />
        </Form.Item>
      ),
    },
    {
      title: 'pajak',
      dataIndex: 'jenis_pajak',

      render: (text: string, record: Beli) => (
        <Form.Item
          name={[record._id, 'jenis_pajak']}
          rules={[
            {
              required: true,
              message: 'Please input Diskon!',
            },
          ]}
          style={{ marginBottom: 0, width: 100 }}
        >
          <Select
            onChange={(value) => calculation(record._id, value)}
            defaultValue={AmbilData ? String(record.jenis_pajak) : undefined}
          >
            {pajaks?.map((pajak: Pajak) => (
              <Select.Option key={pajak._id} value={pajak.jenis_pajak}>
                {pajak.jenis_pajak}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Stok',
      dataIndex: 'semua_qty',

      render: (text: string, record: any) => (
        <Form.Item
          name={[record._id, 'semua_qty']}
          rules={[
            {
              required: true,
              message: 'Please input Diskon!',
            },
          ]}
          style={{ marginBottom: 0, width: 100 }}
        >
          <Input
            onChange={(value) => calculation(record._id, value as any)}
            defaultValue={AmbilData ? String(record.semua_qty) : undefined}
          ></Input>
        </Form.Item>
      ),
    },

    // anehkembek
    {
      title: 'Jumlah',
      dataIndex: 'jumlah_pajak',
      render: (text: string, record: Beli) => (
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
            name={[record._id, 'jumlah_pajak']}
            rules={[
              {
                required: true,
                message: `Please input Jumlah!`,
              },
            ]}
          >
            <Input
              readOnly
              defaultValue={AmbilData ? String(record.jumlah_pajak) : undefined}
            />
          </Form.Item>
        </div>
      ),
    },

    {
      title: 'Total',
      dataIndex: 'total',
      render: (text: string, record: Beli) => (
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
            name={[record._id, 'total']}
            rules={[
              {
                required: true,
                message: `Please input Jumlah!`,
              },
            ]}
          >
            <Input
              readOnly
              defaultValue={AmbilData ? String(record.total) : undefined}
            />
          </Form.Item>
          <DeleteOutlined
            onClick={() => handleRemove(record._id)}
            style={{ marginBottom: 0, color: 'red' }}
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
              <h1 style={{ fontSize: '2.5rem' }}>Tambah Tagihan</h1>
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
              <div style={{ marginBottom: '8px' }}>Nama Suppliers</div>
              <Form.Item>
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
                  {pelanggans
                    ? pelanggans
                        .filter((pelanggan) =>
                          pelanggan.type_kontak.includes('Supplier')
                        )
                        .map((pelanggan) => (
                          <Select.Option
                            key={pelanggan.id_pelanggan}
                            value={pelanggan.id_pelanggan}
                          >
                            {pelanggan.nama}
                          </Select.Option>
                        ))
                    : null}
                </Select>
              </Form.Item>
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
              <Input value={currentIdBeli} style={{ width: '100%' }} disabled />
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
                  <DateRange
                    defaultValue={
                      AmbilData &&
                      getPembelianDetail &&
                      getPembelianDetail.length > 0
                        ? [
                            getPembelianDetail[0]?.tanggal_mulai || '',
                            getPembelianDetail[0]?.tanggal_akhir || '',
                          ]
                        : undefined
                    }
                    difference={
                      AmbilData &&
                      getPembelianDetail &&
                      getPembelianDetail.length > 0
                        ? getPembelianDetail[0]?.selisih
                        : undefined
                    }
                    onChange={(dates) => {
                      setSelectedDates(dates)
                    }}
                    onDifferenceChange={(diff) => {
                      setSelectedDifference(diff)
                    }}
                    onSave={handleDateRangeSave}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 0, border: 'white' }}>
            <TweenOneGroup
              enter={{
                scale: 0.8,
                opacity: 0,
                type: 'from',
                duration: 100,
              }}
              onEnd={(e) => {
                if (e.type === 'appear' || e.type === 'enter') {
                  ;(e.target as any).style = 'display: inline-block'
                }
              }}
              leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
              appear={false}
            >
              {selectedTags.map((tag) => (
                <span key={tag} style={{ display: 'inline-block' }}>
                  <Tag
                    closable
                    onClose={(e) => {
                      e.preventDefault()
                      handleClose(tag)
                    }}
                  >
                    {tag}
                  </Tag>
                </span>
              ))}
            </TweenOneGroup>
          </div>

          <Select
            mode="tags"
            style={{
              width: '50%',
              marginBottom: 20,
              borderRadius: '0px 0px 0px',
              textAlign: 'left',
            }}
            placeholder="Pilih Tags"
            open={inputVisible}
            onDropdownVisibleChange={(open) => setInputVisible(open)}
            value={selectedTags}
            onChange={(newTags) => {
              if (Array.isArray(newTags)) {
                setSelectedTags(newTags)
              }
            }}
            onSearch={handleInputChange}
            onBlur={handleSaveTag}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 8,
                  }}
                >
                  <Button type="default" onClick={handleAddTagClick}>
                    <PlusOutlined />
                  </Button>
                </div>
              </div>
            )}
          >
            {tagOptions}
          </Select>

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
                disabled={!selectedSupplierId || AmbilData}
              >
                + Tambah Baris
              </Button>
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

            <div style={{ display: 'flex', width: '800px' }}>
              <div
                style={{
                  flex: '1',

                  flexBasis: '70%',

                  textAlign: 'right',
                  marginTop: 10,
                }}
              >
                <div style={{ textAlign: 'right', marginBottom: 20 }}>
                  <span style={{ fontWeight: 'bold' }}>Sub Total</span>
                </div>

                {showAddDiscount ? (
                  <div style={{ display: 'flex' }}>
                    <Form.Item
                      name="adddiscount"
                      style={{ flex: 1, marginRight: '15px' }}
                    ></Form.Item>

                    <Form.Item>
                      <Input.Group compact>
                        <Input
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            width: '100px',
                            borderRight: 0,
                          }}
                          placeholder="Diskon"
                        />
                        <Input
                          style={{
                            width: 110,
                            textAlign: 'center',
                          }}
                          type="string"
                          onChange={handleDiscountChange}
                        />
                      </Input.Group>
                    </Form.Item>
                  </div>
                ) : (
                  <div style={{ textAlign: 'right', marginBottom: 20 }}>
                    <span style={{ color: 'white' }}>Sunyi</span>
                  </div>
                )}
                {showAddKirim ? (
                  <div style={{ display: 'flex' }}>
                    <Form.Item
                      name="addKirim"
                      style={{ flex: 1, marginRight: '15px' }}
                    ></Form.Item>

                    <Form.Item>
                      <Input.Group compact>
                        <Input
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            width: '100px',
                            borderRight: 0,
                          }}
                          placeholder="Biaya Kirim"
                        />
                        <Input
                          style={{
                            width: 110,
                            textAlign: 'center',
                          }}
                          type="number"
                          onChange={onChangeKirim}
                        />
                      </Input.Group>
                    </Form.Item>
                  </div>
                ) : (
                  <div style={{ textAlign: 'right', marginBottom: 20 }}>
                    <span style={{ color: 'white' }}>sepi</span>
                  </div>
                )}

                {showDp ? (
                  <div style={{ display: 'flex' }}>
                    <Form.Item
                      name="via"
                      style={{ flex: 1, marginRight: '15px' }}
                      rules={[
                        {
                          required: true,
                          validator: (_, value) => {
                            if (!value || value === '0') {
                              return Promise.reject(
                                new Error('Harap pilih bank!')
                              )
                            }
                            return Promise.resolve()
                          },
                        },
                      ]}
                    >
                      <Input.Group compact>
                        <Input
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            width: '80px',
                          }}
                          placeholder="Dibayar ke"
                          disabled
                        />
                        <div className="my-select-container">
                          <Select
                            style={{
                              flex: 1,
                              textAlign: 'left',
                              width: 120,
                            }}
                            showSearch
                            optionFilterProp="children"
                            value={via}
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
                            {banks?.map((bank: Bank) => (
                              <Select.Option key={bank._id} value={bank._id}>
                                {bank.nama_akun}
                              </Select.Option>
                            ))}
                          </Select>
                        </div>
                      </Input.Group>
                    </Form.Item>

                    <Form.Item>
                      <Input.Group compact>
                        <Input
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            width: '100px',
                            borderRight: 0,
                          }}
                          placeholder="Jml. Bayar"
                          disabled
                        />
                        <IDRInput
                          style={{
                            width: 110,
                            textAlign: 'center',
                          }}
                          type="number"
                          onChange={handleBayarChange}
                          value={inputanState}
                        />
                      </Input.Group>
                    </Form.Item>
                  </div>
                ) : (
                  <div style={{ textAlign: 'right', marginBottom: 20 }}>
                    <span style={{ color: 'white' }}>Sunyi</span>
                  </div>
                )}

                <div style={{ textAlign: 'right', marginBottom: 30 }}>
                  <span style={{ fontWeight: 'bold' }}>Total</span>
                </div>
                <div style={{ textAlign: 'right', marginBottom: 20 }}>
                  <span style={{ fontWeight: 'bold' }}>Sisa Tagihan</span>
                </div>
              </div>

              <div
                style={{
                  flex: '1',
                  border: '1px solid white',
                  flexBasis: '30%',

                  textAlign: 'right',
                  marginTop: 10,
                }}
              >
                <div style={{ textAlign: 'right', marginBottom: 20 }}>
                  <span style={{ fontWeight: 'bold' }}>{total_semua}</span>
                </div>
                <div
                  style={{ textAlign: 'right', marginBottom: 30 }}
                  onClick={handleAddDiscount}
                >
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: 'blue',
                      cursor: 'pointer',
                    }}
                  >
                    + Tambahan Diskon
                  </span>
                </div>
                <div
                  style={{ textAlign: 'right', marginBottom: 30 }}
                  onClick={handleAddKirim}
                >
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: 'blue',
                      cursor: 'pointer',
                    }}
                  >
                    + Biaya Pengiriman
                  </span>
                </div>
                {/* dkmglkmg;rl */} {/* ndklgmld.gmd */}
                {/* s.fdger////// */}
                <div
                  style={{ textAlign: 'right', marginBottom: 20 }}
                  onClick={handleUangMukaClick}
                >
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: 'blue',
                      cursor: 'pointer',
                    }}
                  >
                    + Uang Muka
                  </span>
                </div>{' '}
                {/* nmngnjvlsd */}
                {/* dgmrkhlmer */}
                <div style={{ textAlign: 'right', marginBottom: 30 }}>
                  <span style={{ fontWeight: 'bold' }}>
                    {' '}
                    all total : {total_semua - nmDiskon - nmKirim}
                  </span>
                </div>
                <div style={{ textAlign: 'right', marginBottom: 30 }}>
                  <span style={{ fontWeight: 'bold' }}>
                    {' '}
                    all sisa : {total_semua - gabungNm - nmKirim}
                  </span>
                </div>
                <br />
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <Form.Item>
              <Button
                size="small"
                onClick={() => {
                  const piutangValue =
                    isPiutang() && total_semua !== null
                      ? total_semua - gabungNm
                      : 0
                  const piutangYangAkanDisimpan = nilaiPiutang - nm

                  let cocot
                  if (nm >= total_semua) {
                    cocot = total_semua.toString()
                  } else {
                    cocot = nm.toString()
                  }

                  const cicilanData = {
                    _id: '',
                    id_bank: via || '-',
                    id_beli: currentIdBeli,
                    tanggal: selectedDates[0],
                    cicil: Number(cocot),

                    piutang: AmbilData
                      ? piutangYangAkanDisimpan.toString()
                      : piutangValue.toString(),
                  }

                  addCicilan(cicilanData as any)

                  handleSaveInvoice()
                  navigate(`/beliDetail/${currentIdBeli}`)
                }}
                type="primary"
                // disabled={
                //   // !selectedBank ||
                //   hasError ||
                //   poss.some((pos) => {
                //     const currentFields = form.getFieldValue(pos._id)
                //     if (currentFields) {
                //       const hargaJual = parseInt(currentFields.harga_jual, 10)
                //       const hargaRendah = parseInt(
                //         hargaBadge[pos._id]?.rendah || '0',
                //         10
                //       )
                //       const hargaTinggi = parseInt(
                //         hargaBadge[pos._id]?.tinggi || '0',
                //         10
                //       )

                //       return (
                //         isNaN(hargaJual) ||
                //         hargaJual < hargaRendah ||
                //         hargaJual > hargaTinggi
                //       )
                //     }

                //     return false
                //   })
                // }
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
        <div>
          {Object.entries(jenisPajakTotal).map(([jenisPajak, jumlahPajak]) => (
            <div key={jenisPajak}>
              <span>{jumlahPajak}</span>
            </div>
          ))}
        </div>{' '}
        <div>
          {Object.entries(jenisPajakTotal).map(([jenisPajak, jumlahPajak]) => (
            <div key={jenisPajak}>
              <span>{jenisPajak}:</span>
            </div>
          ))}
        </div>
        {/* <div style={{ flex: 1 }}>
          {AmbilData && (
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tanggal</th>
                  <th>Terbayar</th>
                  <th>Sisa Bayar</th>

                  <th>Via</th>
                </tr>
              </thead>
              <tbody>
                {cicilansBeli?.map((cicilan, index) => {
                  const bank = banks?.find(
                    (bank) => bank._id === cicilan.id_bank
                  )
                  return (
                    <tr key={cicilan.id_beli}>
                      <td>{index + 1}</td>
                      <td>{cicilan.tanggal}</td>
                      <td>{cicilan.cicil}</td>
                      <td>{cicilan.piutang}</td>

                      <td>{bank ? bank.nama_bank : ''}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div> */}
      </div>
    </div>
  )
}

export default EditApproveBelis
