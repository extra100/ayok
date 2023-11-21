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
import { Beli } from '../../types/Beli'
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
  useGetBeliDetailQuery,
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
import { useGetPelanggansQuery } from '../../hooks/pelangganHooks'
import { useGetCoasQuery } from '../../hooks/coaHooks'

const BeliPageDetail: React.FC = () => {
  const { id_beli } = useParams<{ id_beli?: string }>()

  const AmbilData = !!id_beli

  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  let idOutletLoggedIn = ''

  if (user) {
    idOutletLoggedIn = user.id_outlet
  }
  const navigate = useNavigate()
  const { data: pengguna } = useUserDataQuery()

  const { data: getBeliDetail } = useGetBeliDetailQuery(id_beli as string)

  const { data: cicilansBeli } = useGetCicilanBeliByIdQuery(id_beli as string)

  const { data: getPembelianDetail } = useGetPembelianByIdQuery(
    id_beli as string
  )
  const { data: multis } = useGetMultisQuery()
  const updateBeliMutation = useUpdateBeliMutation()
  const { mutate: deleteBeliMutation } = useDeleteBeliMutation()

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
      if (getBeliDetail) {
        const formData = getBeliDetail.reduce<{ [key: string]: Beli }>(
          (acc, curr) => {
            acc[curr._id] = {
              ...curr,
            }
            return acc
          },
          {}
        )

        setBelis(getBeliDetail)

        form.setFieldsValue(formData)

        getBeliDetail.forEach((detail) => {
          const multiItem = multis?.find(
            (multi) =>
              multi.id_data_barang === detail.id_data_barang &&
              multi.id_harga === detail.id_harga
          )

          if (multiItem) {
            setHargaBadge((prevState) => ({
              ...prevState,
              [detail._id]: {
                tinggi: multiItem.harga_tertinggi.toString(),
                rendah: multiItem.harga_terendah.toString(),
              },
            }))
          }
        })
      }

      if (getPembelianDetail && getPembelianDetail.length > 0) {
        setSelectedPelanganId(getPembelianDetail[0].id_supplier || null)
      }
      if (getPembelianDetail && getPembelianDetail.length > 0) {
        setTotalSemua(parseFloat(getPembelianDetail[0].total_semua) || null)
      }
    }
  }, [AmbilData, getBeliDetail, getPembelianDetail, form, multis])

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
          <Link to={`/returbeli/${id_beli}`}>
            <span>Retur Beli</span>{' '}
          </Link>
        </text>
      </Menu.Item>

      <Menu.Item>
        <text>
          <Link to={`/approvebelis/${id_beli}`}>
            <span>Approve Beli</span>{' '}
          </Link>
        </text>
      </Menu.Item>
      <Menu.Item>
        <text>
          <Link to={`/editbeli/${id_beli}`}>
            <span>Edit Beli</span>{' '}
          </Link>
        </text>
      </Menu.Item>
      <Menu.Item>
        <text>
          <Link to={`/editapprovebelis/${id_beli}`}>
            <span>Edit approve beli</span>{' '}
          </Link>
        </text>
      </Menu.Item>

      <Menu.Item key="2">pdf</Menu.Item>
    </Menu>
  )

  const { data: banks } = useGetBanksQuery()
  const { data: coas } = useGetCoasQuery()

  const [Belis, setBelis] = useState<Beli[]>([])

  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [selisih, setSelisih] = useState<number>(0)
  const [idOutet, setIdOutlet] = useState<String>('1')

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
  const { data: pelanggans } = useGetPelanggansQuery()
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

  // const handleSupplierChange = (pelangganId: string) => {
  //   const selectedSupplier = suppliers?.find((p) => p._id === pelangganId)
  //   if (selectedSupplier) {
  //     setIdHarga(selectedSupplier.id_harga)
  //     setSelectedIdHarga(selectedSupplier.id_harga)
  //   }
  // }

  const [selectedIdHarga, setSelectedIdHarga] = useState<string | null>(null)

  const [stokPerProduk, setStokPerProduk] = useState<{ [key: string]: number }>(
    {}
  )

  const [stokCount, setStokCount] = useState<number>(0)
  const [hasError, setHasError] = useState(false)

  // const handleQtyChange = (
  //   value: number | string | null | undefined,
  //   BeliId: string
  // ) => {
  //   let newValue: number

  //   if (AmbilData) {
  //     const relevantDetail = getBeliDetail!.find(
  //       (detail) => detail._id === BeliId
  //     )

  //     newValue = relevantDetail ? relevantDetail.qty_sold : 0
  //   } else {
  //     newValue = typeof value === 'number' ? value : 0
  //   }

  //   setBelis((prevBelis) => {
  //     return prevBelis.map((Beli) => {
  //       if (Beli._id === BeliId) {
  //         return {
  //           ...Beli,
  //           qty_sold: newValue,
  //         }
  //       }
  //       return Beli
  //     })
  //   })

  //   calculation(BeliId)
  // }

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

        // calculation(BeliId)
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
  // cucuk
  // const handleSaveCicilan = (invoiceToSave: any) => {
  //   const nilaiYangAkanDisimpan = nm + bayarDb

  //   const piutangYangAkanDisimpan = piutangDb - nm

  //   const cicilanData: Cicilan = {
  //     _id: '',
  //     id_bank: invoiceToSave.via,
  //     id_beli: invoiceToSave.id_beli,
  //     tanggal: '',
  //     cicil: nilaiYangAkanDisimpan.toString(),
  //     piutang: piutangYangAkanDisimpan,
  //   }
  //   addCicilan(cicilanData)
  // }
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
  //   getBeliDetail?.reduce((acc, detail) => acc + Number(detail.total || 0), 0) ||
  //   0

  const handleSaveInvoice = () => {
    // handleSave()
    const piutangValue =
      isPiutang() && nilaiPiutang !== null ? nm - total_semua : 0

    const tempo = nm === total_semua ? 0 : selisih

    const piutangPenju = AmbilData
      ? nilaiPiutang - nm < 0
        ? 0
        : nilaiPiutang - nm
      : 0
    let pay
    if (nm >= total_semua) {
      pay = total_semua.toString()
    } else {
      pay = Number(bayarDb) + Number(nm)
    }

    const invoiceToSave = {
      _id: '',
      id_beli: currentIdBeli,
      inv: currentIdBeli || undefined,
      total_semua: total_semua ? total_semua.toString() : '',
      diskon: diskonTetap,
      bayar: pay,

      kembalian: kembalian.toString(),
      tanggal_mulai: selectedDates[0],
      tanggal_akhir: selectedDates[1],

      via: via ? via.toString() : '',
      piutang: AmbilData ? piutangPenju.toString() : piutangValue.toString(),

      id_pelanggan: selectedPelanganId || undefined,
      selisih: tempo,
      id_harga: id_harga || undefined,
      id_outlet: user?.id_outlet || '',
      sub_total: '0',
    }

    if (AmbilData) {
      updatePembelianMutation.mutate(invoiceToSave as any)
    } else {
      addPembelianMutation.mutate(invoiceToSave as any, {
        onSuccess: () => {
          // handleSaveCicilan(invoiceToSave)
        },
      })
    }
  }

  // const handleAdd = () => {
  //   const newCount = count + 1
  //   setCount(newCount)
  //   localStorage.setItem('count', newCount.toString())
  //   const tempId = `temp-${newCount}`

  //   const idHargaToUse =
  //     selectedIdHarga || getIdHargaFromPelangan(selectedPelanganId) || '0'

  //   const newData: Beli = {
  //     _id: tempId,
  //     id_beli: currentIdBeli,
  //     id_data_barang: '',
  //     harga_jual: '0',
  //     total: '0',
  //     diskon: '0',
  //     id_harga: idHargaToUse,
  //     qty_sold: 1,
  //     inv: currentIdBeli,
  //     biji: 0,
  //     id_outlet: user?.id_outlet || '',
  //   }

  //   setBelis((prevBelis) => [...prevBelis, newData])
  //   form.setFieldsValue({
  //     [newData._id]: {
  //       _id: '',
  //       id_beli: currentIdBeli,
  //       id_data_barang: '',
  //       qty_sold: 1,
  //       harga_jual: '0',
  //       total: '0',
  //       diskon: '0',
  //       tanggal: date,
  //       via: '0',
  //       id_pelanggan: '0',
  //       inv: currentIdBeli,
  //       biji: 0,
  //       id_outlet: user?.id_outlet || '',
  //     },
  //   })
  // }

  // const handleProductChange = (productId: string, BeliId: string) => {
  //   const product = products?.find((p) => p._id === productId)
  //   if (!product) return

  //   const idHargaForSelectedPelangan =
  //     getIdHargaFromPelangan(selectedPelanganId)

  //   const multiItem = multis?.find(
  //     (multi) =>
  //       multi.id_data_barang === productId &&
  //       multi.id_harga === idHargaForSelectedPelangan
  //   )

  //   const hargaToShow = multiItem
  //     ? multiItem.harga_tertinggi
  //     : product.harga_jual
  //   const hargaTerendahToShow = multiItem
  //     ? multiItem.harga_terendah
  //     : product.harga_jual
  //   setHargaBadge((prevState) => ({
  //     ...prevState,
  //     [BeliId]: {
  //       tinggi: hargaToShow.toString(),
  //       rendah: hargaTerendahToShow.toString(),
  //     },
  //   }))
  //   setBarangSelected(true)

  //   form.setFieldsValue({
  //     [BeliId]: {
  //       ...form.getFieldValue(BeliId),
  //       id_data_barang: product._id,
  //       harga_jual: hargaToShow,
  //       harga_jual_rendah: hargaTerendahToShow,
  //       qty_sold: 1,
  //       bayar: 0,
  //     },
  //   })
  //   const relatedStok = stokku?.find((s) => s.id_data_barang === productId)
  //   const stokCount = relatedStok ? relatedStok.jumlah_stok : 0

  //   setStokCount(stokCount)

  //   setStokPerProduk((prevState) => ({ ...prevState, [BeliId]: stokCount }))

  //   setBelis((prevBelis) => {
  //     return prevBelis.map((Beli) => {
  //       if (Beli._id === BeliId) {
  //         return {
  //           ...Beli,
  //           id_data_barang: product._id,
  //         }
  //       }
  //       return Beli
  //     })
  //   })

  //   // calculation(BeliId)
  // }

  // const calculation = (BeliId: string) => {
  //   const currentFields = form.getFieldValue(BeliId)
  //   if (currentFields) {
  //     const { qty_sold, harga_jual, diskon } = currentFields
  //     const total = parseInt(qty_sold) * parseInt(harga_jual) - parseInt(diskon)
  //     form.setFieldsValue({
  //       [BeliId]: {
  //         ...currentFields,
  //         total: total.toString(),
  //       },
  //     })
  //     hitungTotalSemua()
  //   }
  // }
  const cobaBeli = Belis

  const handleRemove = (
    id: string,
    id_data_barang: string,
    qty_sold: number,
    total: string
  ) => {
    const currentStok = stokku!.find(
      (stok) =>
        stok.id_data_barang === id_data_barang &&
        stok.id_outlet === idOutletLoggedIn
    )

    if (currentStok) {
      const updatedStok = {
        ...currentStok,
        jumlah_stok: currentStok.jumlah_stok + qty_sold,
      }

      updateStokMutation.mutate(updatedStok)
    } else {
    }

    const currentJumlah = getPembelianDetail!.find(
      (jumlah) =>
        jumlah.id_beli === id_beli && jumlah.id_outlet === idOutletLoggedIn
    )

    if (currentJumlah) {
      const totalSemuaNumeric = parseInt(currentJumlah.total_semua, 10)
      const updatedTotalSemua = (
        totalSemuaNumeric - parseInt(total, 10)
      ).toString()

      const updateJumlah = {
        ...currentJumlah,
        total_semua: updatedTotalSemua,
      }

      updatePembelianMutation.mutate(updateJumlah)
    }

    const updatedBelis = Belis.filter((jos) => jos._id !== id)
    setBelis(updatedBelis)
    console.log('table isi fdhgndnddfhtdht6545555555555555555555', updatedBelis)

    if (AmbilData) {
      deleteBeliMutation(id)
    }
  }

  const [total_semua, setTotalSemua] = useState<any>(null)

  // const [diskon, setDiskon] = useState(0)
  const diskonTetap =
    getPembelianDetail && getPembelianDetail.length > 0
      ? parseFloat(getPembelianDetail[0].diskon as string)
      : 0

  const [via, setVia] = useState('0')

  const [isBayarFilled, setIsBayarFilled] = useState(false)
  const [kalku, setKalku] = useState(0)
  const [warnInputan, setWarnInputan] = useState(false)

  //toto
  const [sisaTagihan, setSisaTagihan] = useState<any>(0)

  useEffect(() => {
    if (piutangDb != null) {
      setSisaTagihan(piutangDb - nm)
    } else {
      setSisaTagihan(piutangDb)
    }
  }, [nm])

  const piutangDb = getPembelianDetail
    ? parseFloat(getPembelianDetail[0]?.piutang || '0')
    : 0
  const note = getPembelianDetail
    ? parseFloat(getPembelianDetail[0]?.catatan || '0')
    : 0

  const bayarDb = getPembelianDetail
    ? parseFloat(getPembelianDetail[0]?.bayar || '0')
    : 0

  const [inputanState, setInputanState] = useState(0)

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

      const nilaiYangAkanDisimpan = numericValue + totalBayarDariPembelianDetail
      const piutangYangAkanDisimpan =
        totalPiutangDariPembelianDetail - numericValue

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
  const [kembalian, setKembalian] = useState(0)
  useEffect(() => {
    if (total_semua !== null) {
      setKembalian(nm - total_semua)
    } else {
      setKembalian(0)
    }
  }, [nm, total_semua])

  // const hitungTotalSemua = (list = Belis) => {
  //   let total = list.reduce((sum, Beli) => {
  //     const nilaiTotalBeli = form.getFieldValue(Beli._id)?.total || '0'
  //     return sum + parseInt(nilaiTotalBeli, 10)
  //   }, 0)
  //   total = total - diskon
  //   setTotalSemua(total)
  // }
  // const handleSave = () => {
  //   Belis.forEach((Beli) => {
  //     const BeliFormData = form.getFieldValue(Beli._id)
  //     if (!BeliFormData.id_harga || BeliFormData.id_harga === '') {
  //       BeliFormData.id_harga = selectedIdHarga || '0'
  //     }

  //     const currentProduct = stokku?.find(
  //       (stok) =>
  //         stok.id_data_barang === Beli.id_data_barang &&
  //         stok.id_outlet === idOutletLoggedIn
  //     )

  //     if (!AmbilData && currentProduct) {
  //       const stokCount = currentProduct.jumlah_stok
  //       BeliFormData.biji = stokCount
  //     }

  //     const { _id, ...BeliDataToSave } = BeliFormData

  //     if (AmbilData) {
  //       updateBeliMutation.mutate({ id_beli, ...BeliDataToSave })
  //     } else {
  //       addBeliMutation.mutate(BeliDataToSave)
  //     }

  //     const currentStok = stokku?.find(
  //       (stok) =>
  //         stok.id_data_barang === Beli.id_data_barang &&
  //         stok.id_outlet === idOutletLoggedIn
  //     )

  //     if (currentStok) {
  //       const oldQtySold =
  //         getBeliDetail?.find((detail) => detail._id === Beli._id)?.qty_sold || 0
  //       let updatedStokValue

  //       if (AmbilData) {
  //         const qtyDifference = oldQtySold - BeliFormData.qty_sold
  //         if (qtyDifference > 0) {
  //           updatedStokValue = currentStok.jumlah_stok + qtyDifference
  //         } else {
  //           updatedStokValue = currentStok.jumlah_stok - Math.abs(qtyDifference)
  //         }
  //       } else {
  //         updatedStokValue = currentStok.jumlah_stok - BeliFormData.qty_sold
  //       }

  //       const updatedStok = {
  //         ...currentStok,
  //         jumlah_stok: updatedStokValue,
  //       }
  //       updateStokMutation.mutate(updatedStok)
  //     }
  //   })
  // }
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
      title: 'qty',
      dataIndex: 'qty_sold',
      key: 'qty',
    },
    {
      title: 'Harga Beli',
      dataIndex: 'harga_jual',
      key: 'harga_jual',
    },

    {
      title: 'diskon',
      dataIndex: 'diskon',
      key: 'diskon',
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
              <h1 style={{ fontSize: '2.5rem' }}>
                Detail Tagihan: {currentIdBeli}
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
                <text>
                  <Link to={`/approvebelis/${id_beli}`}>
                    <span>Tambah Tagihan</span>{' '}
                  </Link>
                </text>
              </div>
            </div>
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
                        pelanggans?.find(
                          (outlet: any) =>
                            outlet.nama === getPembelianDetail[0]?.nama
                        )?.nama
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
                flexBasis: '40%',
                textAlign: 'right',
                marginBottom: '16px',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <span>Tgl. Transaksi</span>
                <br />
                <h5>
                  {AmbilData &&
                  getPembelianDetail &&
                  getPembelianDetail.length > 0
                    ? [getPembelianDetail[0]?.tanggal_mulai]
                    : undefined}
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
                <span>Tgl. Jatuh Tempo</span>
                <br />
                <h5>
                  {AmbilData &&
                  getPembelianDetail &&
                  getPembelianDetail.length > 0
                    ? [getPembelianDetail[0]?.tanggal_akhir]
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
                {/* hu */}
                <h5>
                  {AmbilData &&
                  getPembelianDetail &&
                  getPembelianDetail.length > 0
                    ? outletData?.find(
                        (outlet) =>
                          outlet._id === getPembelianDetail[0]?.id_outlet
                      )?.nama_outlet
                    : undefined}
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
                <span>Tag</span>
                <br />
                <h5>
                  {AmbilData && getBeliDetail && getBeliDetail.length > 0
                    ? [getBeliDetail[0]?.tag]
                    : undefined}
                </h5>
              </div>
            </div>
          </div>

          <Form form={form}>
            <Table
              style={{ borderRadius: '0 0 0 ' }}
              dataSource={Belis}
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
              <div style={{ textAlign: 'left' }}>
                <h5>Pesan: </h5>
                <span>
                  {AmbilData &&
                  getPembelianDetail &&
                  getPembelianDetail.length > 0
                    ? [getPembelianDetail[0]?.catatan]
                    : undefined}
                </span>
              </div>
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
                <div style={{ textAlign: 'right', marginBottom: 20 }}>
                  <span style={{ fontWeight: 'bold' }}>Sub Total</span>
                </div>
                <div style={{ textAlign: 'right', marginBottom: 20 }}>
                  <span style={{ fontWeight: 'bold' }}>Diskon</span>
                </div>
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

                  width: 200,
                  textAlign: 'right',
                  marginTop: 10,
                }}
              >
                {' '}
                <div style={{ textAlign: 'right', marginBottom: 20 }}>
                  <span style={{ fontWeight: 'bold' }}>
                    {' '}
                    {getPembelianDetail && getPembelianDetail.length > 0
                      ? parseFloat(getPembelianDetail[0].sub_total as string)
                      : 0}
                  </span>
                </div>
                <div style={{ textAlign: 'right', marginBottom: 20 }}>
                  <span style={{ fontWeight: 'bold' }}>
                    {' '}
                    {getPembelianDetail && getPembelianDetail.length > 0
                      ? parseFloat(getPembelianDetail[0].diskon as string)
                      : 0}
                  </span>
                </div>
                <div style={{ textAlign: 'right', marginBottom: 30 }}>
                  <span style={{ fontWeight: 'bold' }}>{total_semua}</span>
                </div>
                <div style={{ textAlign: 'right', marginBottom: 20 }}>
                  <span style={{ fontWeight: 'bold' }}>
                    {' '}
                    {getPembelianDetail && getPembelianDetail.length > 0
                      ? parseFloat(getPembelianDetail[0].piutang as string)
                      : 0}
                  </span>
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
        <div style={{ border: '1px' }}>
          <div style={{ display: 'flex', marginTop: 20 }}>
            <div
              style={{
                flex: '1',
                flexBasis: '10px',
                textAlign: 'right',
                marginBottom: '0',
              }}
            >
              {getPembelianDetail?.find((user) => user.piutang !== '0') ? (
                <div style={{ textAlign: 'left' }}>
                  <h1 style={{ fontSize: '1.5rem' }}>Terima Pembayaran:</h1>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {getPembelianDetail?.find((user) => user.piutang !== '0') ? (
          <div style={{ border: '1px' }}>
            <div style={{ display: 'flex', padding: '20px' }}>
              <div
                style={{
                  flex: '1',
                  borderTop: '1px solid #f0f0f0',
                  borderLeft: '1px solid #f0f0f0',
                  borderBottom: '1px solid #f0f0f0',
                  padding: '20px',
                  textAlign: 'right',
                  width: '100',
                }}
              >
                {/* lssdd */}

                <div style={{ textAlign: 'left', justifyContent: 'center' }}>
                  <div>Jumlah Bayar:</div>

                  <IDRInput
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      borderRadius: '0 0 0 ',
                    }}
                    type="number"
                    onChange={handleBayarChange}
                    value={inputanState}
                  />
                </div>

                <br />
                {/* kdmvdk; */}
                <div style={{ textAlign: 'left', justifyContent: 'center' }}>
                  <div>Dibayar Ke:</div>
                  <Form.Item
                    name="via"
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
                    <Select
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
                      {coas
                        ?.filter((e) => e.kategori === 'Kas & Bank')
                        .map((e) => (
                          <Select.Option key={e._id} value={e.nama_akun}>
                            {e.nama_akun}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>

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
                <div style={{ textAlign: 'left' }}>Tgl. Transaksi:</div>

                <div style={{ textAlign: 'left' }}>
                  <DateCicil
                    defaultValue={
                      AmbilData &&
                      getPembelianDetail &&
                      getPembelianDetail.length > 0
                        ? [getPembelianDetail[0]?.tanggal_mulai || '']
                        : undefined
                    }
                    disabled={false}
                    onChange={(dates: string) => {
                      setDateCicilan(dates)
                    }}
                    onClick={handleDateCicilan}
                  />
                </div>

                <br />
                <div
                  style={{
                    flex: '1',
                    textAlign: 'right',
                  }}
                >
                  <div style={{ textAlign: 'left' }}>Catatan</div>

                  <div style={{ textAlign: 'left' }}>
                    <Input></Input>
                  </div>
                </div>
                <div
                  style={{
                    flex: '1',
                    flexBasis: '10px',
                    textAlign: 'right',
                  }}
                >
                  <div>
                    <Form.Item>
                      {/* <Link to="/Pembelian"> */}
                      <Button
                        size="small"
                        onClick={() => {
                          const bayara = bayarDb > 0 ? 0 : 0

                          const piutanga = piutangDb

                          const SaveBayar = AmbilData
                            ? nm > piutanga
                              ? piutanga
                              : bayara + nm
                            : 0

                          const savePiutang = AmbilData
                            ? piutanga - nm < 0
                              ? 0
                              : piutanga - nm
                            : 0

                          const cicilanData = {
                            _id: '',
                            id_bank: via,
                            id_beli: currentIdBeli,
                            tanggal: dateCicilan || currentDate,
                            cicil: SaveBayar,
                            piutang: savePiutang,
                          }

                          addCicilan(cicilanData as any)
                          navigate(`/beliDetail/${id_beli}`)
                          handleSaveInvoice()
                        }}
                        type="primary"
                        disabled={
                          !selectedBank ||
                          hasError ||
                          !Belis.some((Beli) => {
                            const currentFields = form.getFieldValue(Beli._id)
                            if (currentFields) {
                              const hargaJual = parseInt(
                                currentFields.harga_jual,
                                10
                              )
                              const hargaRendah = parseInt(
                                hargaBadge[Beli._id]?.rendah || '0',
                                10
                              )
                              const hargaTinggi = parseInt(
                                hargaBadge[Beli._id]?.tinggi || '0',
                                10
                              )

                              return (
                                isNaN(hargaJual) ||
                                hargaJual < hargaRendah ||
                                hargaJual > hargaTinggi
                              )
                            }

                            return false
                          })
                        }
                        style={{
                          background: '#0190fe',
                          width: '100%',
                          height: '2.2rem',
                          color: 'white',
                          borderRadius: '0px 0px 0px',
                          marginTop: '10px',
                        }}
                      >
                        <AiOutlinePlus
                          style={{ marginRight: 7, marginTop: -4 }}
                        />
                        Tambah Pembayaran
                      </Button>
                      {/* </Link> */}
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div style={{ flex: 1 }}>
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

                      <td>{bank ? bank.nama_akun : ''}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default BeliPageDetail
