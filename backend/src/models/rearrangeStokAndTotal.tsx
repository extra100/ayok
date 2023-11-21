import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Select,
  Table,
  Tooltip,
} from 'antd'
import {
  useGetProductsQuery,
  useUpdateProductMutation,
} from '../../hooks/productHooks'
import { Pos } from '../../types/Pos'
import { DeleteOutlined } from '@ant-design/icons'
import { useGetStoksQuery, useUpdateStokMutation } from '../../hooks/stokHooks'
import { SaveOutlined } from '@ant-design/icons' // import icon save
import {
  useAddPosMutation,
  useDeletePosMutation,
  useGetPosDetailQuery,
  useUpdatePosMutation,
} from '../../hooks/posHooks'
import { v4 as uuidv4 } from 'uuid'
// import Iqra from '../Iqra'
import moment from 'moment'
import {
  useAddPenjualanMutation,
  useGetPenjualanByIdQuery,
  useUpdatePenjualanMutation,
} from '../../hooks/penjualanHooks'
import { Pelanggan } from '../../types/Pelanggan'
import { useGetPelanggansQuery } from '../../hooks/pelangganHooks'
import { useGetMultisQuery } from '../../hooks/multiHooks'
import { Harga } from '../../types/Harga'
import { useGetHargasQuery } from '../../hooks/hargaHooks'
import { Multi } from '../../types/Multi'
import { useGetBanksQuery } from '../../hooks/bankHooks'
import { Bank } from '../../types/Bank'
import { Link, useParams } from 'react-router-dom'
import { AiOutlinePlus, AiOutlineSave } from 'react-icons/ai'
import DateRange from '../DateRange'
import dayjs, { Dayjs } from 'dayjs'
import '../../index.css'
import IDRInput from './IdrInput'
import TanggalOdak from './TanggalOdak'
import { Placeholder } from 'react-bootstrap'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import {
  useAddCicilanMutation,
  useGetCicilanByIdQuery,
} from '../../hooks/cicilanHooks'
import { Cicilan } from '../../types/Cicilan'
import UserContext from '../../contexts/UserContext'
import { Outlet } from '../../types/Outlet'

// const isValidObjectId = (id?: string): boolean => {
//   if (!id) return false
//   const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$')
//   return checkForHexRegExp.test(id)
// }

const PosPage: React.FC = () => {
  const { id_pos } = useParams<{ id_pos?: string }>()

  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  let idOutletLoggedIn = ''

  if (user) {
    idOutletLoggedIn = user.id_outlet
  }

  // const validIdPos = isValidObjectId(id_pos)

  const { data: getPosDetail } = useGetPosDetailQuery(id_pos as string)
  const { data: cicilans } = useGetCicilanByIdQuery(id_pos as string)

  const { data: getPenjualanDetail } = useGetPenjualanByIdQuery(
    id_pos as string
  )
  const { data: multis } = useGetMultisQuery()
  const updatePosMutation = useUpdatePosMutation()
  const { mutate: deletePosMutation } = useDeletePosMutation()

  const isEditMode = !!id_pos
  const [form] = Form.useForm()

  useEffect(() => {
    if (isEditMode) {
      if (getPosDetail) {
        const formData = getPosDetail.reduce<{ [key: string]: Pos }>(
          (acc, curr) => {
            acc[curr._id] = {
              ...curr,
            }
            return acc
          },
          {}
        )

        setPoss(getPosDetail)

        form.setFieldsValue(formData)

        getPosDetail.forEach((detail) => {
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

      if (getPenjualanDetail && getPenjualanDetail.length > 0) {
        setSelectedPelanganId(getPenjualanDetail[0].id_pelanggan || null)
      }
      if (getPenjualanDetail && getPenjualanDetail.length > 0) {
        setTotalSemua(parseFloat(getPenjualanDetail[0].total_semua) || null)
      }
    }
  }, [isEditMode, getPosDetail, getPenjualanDetail, form, multis])

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

  const { data: banks } = useGetBanksQuery()

  const [poss, setPoss] = useState<Pos[]>([])

  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [selisih, setSelisih] = useState<number>(0)
  const [idOutet, setIdOutlet] = useState<String>('1')

  const generateInvoiceId = (): string => {
    if (isEditMode) {
      return id_pos
    }
    const uuid = uuidv4()
    const splitUUID = uuid.split('-')
    const lastPartOfUUID = splitUUID[splitUUID.length - 1]
    return `INV${parseInt(lastPartOfUUID, 16)}`
  }
  const [currentIdPos, setCurrentIdPos] = useState(generateInvoiceId())

  const generateShortInvoiceId = (): string => {
    const generatedId = generateInvoiceId()

    if (isEditMode) {
      return id_pos
    }
    const uuid = uuidv4()
    const last4OfUUID = uuid.substr(uuid.length - 4)
    const shortNumber = parseInt(last4OfUUID, 16) % 10000
    return `INV${String(shortNumber).padStart(4, '0')}`
  }
  const { data: pelanggans } = useGetPelanggansQuery()
  const { data: outletsData } = useGetoutletsQuery()
  const [selectedPelanganId, setSelectedPelanganId] = useState<string | null>(
    null
  )

  const getIdHargaFromPelangan = (
    pelangganIdCumeLeqTe: string | null
  ): string => {
    if (!pelangganIdCumeLeqTe) return ''
    const pelangganTakenOnlyHere = pelanggans?.find(
      (p) => p._id === pelangganIdCumeLeqTe
    )
    return pelangganTakenOnlyHere?.id_harga || ''
  }

  const addPosMutation = useAddPosMutation()
  // const [currentIdPos, setCurrentIdPos] = useState(generateInvoiceId())
  const [currentInv, setCurrentInv] = useState(generateShortInvoiceId())
  const [date, setDate] = useState<Date>(new Date())
  const addPenjualanMutation = useAddPenjualanMutation()
  const updatePenjualanMutation = useUpdatePenjualanMutation()
  const updateStokMutation = useUpdateStokMutation()
  const updatedProductMutation = useUpdateProductMutation()
  const [id_harga, setIdHarga] = useState<string | null>(null)

  const handlePelangganChange = (pelangganId: string) => {
    const selectedPelanggan = pelanggans?.find((p) => p._id === pelangganId)
    if (selectedPelanggan) {
      setIdHarga(selectedPelanggan.id_harga)
      setSelectedIdHarga(selectedPelanggan.id_harga)
    }
  }

  const [selectedIdHarga, setSelectedIdHarga] = useState<string | null>(null)

  const [stokPerProduk, setStokPerProduk] = useState<{ [key: string]: number }>(
    {}
  )

  const [stokCount, setStokCount] = useState<number>(0)
  const [hasError, setHasError] = useState(false)

  const handleQtyChange = (
    value: number | string | null | undefined,
    posId: string
  ) => {
    let newValue: number

    if (isEditMode) {
      const relevantDetail = getPosDetail!.find(
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

    calculation(posId)
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

        calculation(posId)
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

  const handleSaveCicilan = (invoiceToSave: any) => {
    const cicilanPiutang =
      isPiutang() && total_semua !== null ? total_semua - bayar : 0
    const cicilanData: Cicilan = {
      _id: '',
      id_bank: invoiceToSave.via,
      id_pos: invoiceToSave.id_pos,
      tanggal: invoiceToSave.tanggal_mulai,
      cicil: invoiceToSave.bayar,
      piutang: cicilanPiutang,
    }
    addCicilan(cicilanData)
  }

  const handleSaveInvoice = () => {
    console.log('Selected Dates:', selectedDates)
    console.log('Selected Difference:', selectedDifference)
    handleSave()

    const piutangValue =
      isPiutang() && total_semua !== null ? total_semua - bayar : 0

    const selisihKosong = bayar === total_semua ? 0 : selisih

    const invoiceToSave = {
      _id: '',
      id_pos: currentIdPos,
      inv: currentInv || undefined,
      total_semua: total_semua ? total_semua.toString() : '',
      diskon: diskon.toString(),
      bayar: bayar.toString(),
      kembalian: kembalian.toString(),
      tanggal_mulai: selectedDates[0],
      tanggal_akhir: selectedDates[1],

      via: via ? via.toString() : '',
      piutang: piutangValue.toString(),
      id_pelanggan: selectedPelanganId || undefined,
      selisih: selisihKosong,
      id_harga: id_harga || undefined,
      id_outlet: user?.id_outlet || '',
    }

    if (isEditMode) {
      updatePenjualanMutation.mutate(invoiceToSave)
    } else {
      addPenjualanMutation.mutate(invoiceToSave, {
        onSuccess: () => {
          // Panggil fungsi handleSaveCicilan di sini
          handleSaveCicilan(invoiceToSave)
        },
      })
    }
  }

  const handleAdd = () => {
    const newCount = count + 1
    setCount(newCount)
    localStorage.setItem('count', newCount.toString())
    const tempId = `temp-${newCount}`

    const idHargaToUse =
      selectedIdHarga || getIdHargaFromPelangan(selectedPelanganId) || '0'

    const newData: Pos = {
      _id: tempId,
      id_pos: currentIdPos,
      id_data_barang: '',
      harga_jual: '0',
      total: '0',
      diskon: '0',
      id_harga: idHargaToUse,
      qty_sold: 1,
      inv: currentInv,
      biji: 0,
      id_outlet: user?.id_outlet || '',
    }

    setPoss((prevPoss) => [...prevPoss, newData])
    form.setFieldsValue({
      [newData._id]: {
        _id: '',
        id_pos: currentIdPos,
        id_data_barang: '',
        qty_sold: 1,
        harga_jual: '0',
        total: '0',
        diskon: '0',
        tanggal: date,
        via: '0',
        id_pelanggan: '0',
        inv: currentInv,
        biji: 0,
        id_outlet: user?.id_outlet || '',
      },
    })
  }

  const handleProductChange = (productId: string, posId: string) => {
    const product = products?.find((p) => p._id === productId)
    if (!product) return

    const idHargaForSelectedPelangan =
      getIdHargaFromPelangan(selectedPelanganId)

    const multiItem = multis?.find(
      (multi) =>
        multi.id_data_barang === productId &&
        multi.id_harga === idHargaForSelectedPelangan
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
        qty_sold: 1,
        bayar: 0,
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

    calculation(posId)
  }

  const calculation = (posId: string) => {
    const currentFields = form.getFieldValue(posId)
    if (currentFields) {
      const { qty_sold, harga_jual, diskon } = currentFields
      const total = parseInt(qty_sold) * parseInt(harga_jual) - parseInt(diskon)
      form.setFieldsValue({
        [posId]: {
          ...currentFields,
          total: total.toString(),
        },
      })
      hitungTotalSemua()
    }
  }

  const handleRemove = (
    id: string,
    id_data_barang: string,
    qty_sold: number,
    total: string
  ) => {
    console.log('qty_sold:', qty_sold) // Menampilkan nilai qty_sold ke konsol

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

      console.log('Mengupdate stok dengan data berikut:', updatedStok)

      updateStokMutation.mutate(updatedStok)
    } else {
      console.log('Tidak memperbarui stok karena kondisi tidak memenuhi.')
    }

    const currentJumlah = getPenjualanDetail!.find(
      (jumlah) =>
        jumlah.id_pos === id_pos && jumlah.id_outlet === idOutletLoggedIn
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

      updatePenjualanMutation.mutate(updateJumlah)
    }

    const updatedPoss = poss.filter((jos) => jos._id !== id)
    setPoss(updatedPoss)
    hitungTotalSemua(updatedPoss)

    if (isEditMode) {
      deletePosMutation(id)
    }
  }

  const [total_semua, setTotalSemua] = useState<number | null>(null)

  const [diskon, setDiskon] = useState(0)

  const [via, setVia] = useState('0')

  const [bayar, setBayar] = useState(0)
  const [isBayarFilled, setIsBayarFilled] = useState(false)

  const handleBayarChange = (value: number | string | null | undefined) => {
    const numericValue =
      typeof value === 'string' ? parseInt(value.replace(/\./g, ''), 10) : value
    setBayar(numericValue as any)

    if ((numericValue as any) > 0) {
      setIsBayarFilled(true)
    } else {
      setIsBayarFilled(false)
    }
  }

  const [kembalian, setKembalian] = useState(0)
  useEffect(() => {
    if (total_semua !== null) {
      setKembalian(bayar - total_semua)
    } else {
      // Atur kembalian ke nilai default atau nilai lain yang sesuai jika total_semua adalah null.
      setKembalian(0)
    }
  }, [bayar, total_semua])

  const hitungTotalSemua = (list = poss) => {
    let total = list.reduce((sum, pos) => {
      const nilaiTotalPos = form.getFieldValue(pos._id)?.total || '0'
      return sum + parseInt(nilaiTotalPos, 10)
    }, 0)
    total = total - diskon
    setTotalSemua(total)
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

      if (!isEditMode && currentProduct) {
        const stokCount = currentProduct.jumlah_stok
        posFormData.biji = stokCount
      }

      const { _id, ...posDataToSave } = posFormData

      if (isEditMode) {
        updatePosMutation.mutate({ id_pos, ...posDataToSave })
      } else {
        addPosMutation.mutate(posDataToSave)
      }

      const currentStok = stokku?.find(
        (stok) =>
          stok.id_data_barang === pos.id_data_barang &&
          stok.id_outlet === idOutletLoggedIn
      )

      if (currentStok) {
        const oldQtySold =
          getPosDetail?.find((detail) => detail._id === pos._id)?.qty_sold || 0
        let updatedStokValue

        if (isEditMode) {
          const qtyDifference = oldQtySold - posFormData.qty_sold
          if (qtyDifference > 0) {
            updatedStokValue = currentStok.jumlah_stok + qtyDifference
          } else {
            updatedStokValue = currentStok.jumlah_stok - Math.abs(qtyDifference)
          }
        } else {
          updatedStokValue = currentStok.jumlah_stok - posFormData.qty_sold
        }

        const updatedStok = {
          ...currentStok,
          jumlah_stok: updatedStokValue,
        }
        updateStokMutation.mutate(updatedStok)
      }
    })
  }
  const [selectedBank, setSelectedBank] = useState<string | null>(null)

  const isPiutang = (): boolean => {
    return total_semua ? total_semua > bayar : false
  }

  const labelStyle = {
    width: '150px',
  }

  const wrapperStyle = {
    flex: 1,
  }
  const inputStyle = {
    textAlign: 'right' as const,
  }
  const piutangDariDatabase = getPenjualanDetail
    ? parseFloat(getPenjualanDetail[0]?.piutang || '0')
    : 0

  const piutangDariPerhitungan = isPiutang()
    ? parseFloat((total_semua - bayar).toString())
    : 0

  const totalPiutang = piutangDariDatabase + piutangDariPerhitungan

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
      render: (text: string, record: Pos) => {
        const barang = stokku?.find(
          (product) =>
            product.id_data_barang === record.id_data_barang &&
            product.id_outlet === idOutletLoggedIn
        )

        const stokCount = barang?.jumlah_stok || 0

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
          >
            <div style={{ position: 'relative' }}>
              <Badge
                count={stokCount.toLocaleString()}
                showZero
                style={{
                  backgroundColor: stokCount <= 10 ? 'red' : 'green',
                  position: 'absolute',
                  right: '-310px',
                  top: '-27px',
                  zIndex: 2,
                  // visibility: barangSelected ? 'visible' : 'hidden',
                  visibility:
                    isEditMode || barangSelected ? 'visible' : 'hidden',
                }}
                overflowCount={9999}
              />
              <Select
                value={isEditMode ? String(record.id_data_barang) : undefined}
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
      render: (text: string, record: Pos) => {
        const cui = stokku?.find(
          (product) =>
            product.id_data_barang === record.id_data_barang &&
            product.id_outlet === idOutletLoggedIn
        )
        const stokCount = cui ? cui.jumlah_stok : 0

        let bijis = stokCount // default ke stokCount

        if (isEditMode) {
          const seeds = getPosDetail?.find(
            (product) =>
              product.id_data_barang === record.id_data_barang &&
              product.id_outlet === idOutletLoggedIn
          )
          bijis = seeds ? seeds.biji : 0
        }

        return (
          <Form.Item
            name={[record._id, 'qty_sold']}
            rules={[
              {
                required: true,
                message: `Masukkan Qty!`,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const qtyInput = parseInt(value, 10)

                  // Validasi untuk stok kosong hanya berjalan ketika isEditMode adalah false
                  if (!isEditMode && stokCount <= 0) {
                    setHasError(true)
                    return Promise.reject(new Error('Stok produk kosong!'))
                  }

                  // Validasi untuk melebihi stok ketika bukan dalam isEditMode
                  if (!isEditMode && qtyInput > stokCount) {
                    setHasError(true)
                    return Promise.reject(
                      new Error('Jumlah input melebihi stok yang tersedia!')
                    )
                  }

                  if (isEditMode && (isNaN(qtyInput) || qtyInput > bijis)) {
                    setHasError(true)
                    return Promise.reject(
                      new Error('Jumlah input melebihi stok yang tersedia!')
                    )
                  }

                  setHasError(false)
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input
              defaultValue={isEditMode ? String(record.qty_sold) : undefined}
              disabled={!isEditMode && stokCount <= 0}
              onChange={(e) => handleQtyChange(e.target.value, record._id)}
              style={{ width: 60 }}
            />
          </Form.Item>
        )
      },
    },

    {
      title: 'Harga Jual',
      dataIndex: 'harga_jual',

      render: (text: string, record: Pos) => (
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
        >
          <Input
            defaultValue={isEditMode ? String(record.harga_jual) : undefined}
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
      title: 'Jenis Harga',
      dataIndex: 'jenis_harga',
      render: (text: string, record: Pos) => {
        const badgeHarga = hargaBadge[record._id]
          ? `${hargaBadge[record._id]?.rendah} - ${
              hargaBadge[record._id]?.tinggi
            }`
          : ''

        return (
          <Form.Item>
            <Input
              addonBefore={
                <div>
                  <Select
                    showSearch
                    style={{ width: 100 }}
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
                      handleJenisHargaChange(value as string, record._id)
                    }
                    defaultValue={record.id_harga || undefined}
                  >
                    {hargas?.map((harga: Harga) => (
                      <Select.Option key={harga._id} value={harga._id}>
                        {harga.jenis_harga}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              }
              value={badgeHarga}
              style={{ width: 240 }}
              readOnly
            />
          </Form.Item>
        )
      },
    },
    {
      title: 'Diskon',
      dataIndex: 'diskon',
      render: (text: string, record: Pos) => (
        <Form.Item
          name={[record._id, 'diskon']}
          rules={[
            {
              required: true,
              message: `Please input Diskon!`,
            },
          ]}
        >
          <Input
            onChange={() => calculation(record._id)}
            defaultValue={isEditMode ? String(record.diskon) : undefined}
          />
        </Form.Item>
      ),
    },

    {
      title: 'Jumlah',
      dataIndex: 'total',
      render: (text: string, record: Pos) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Form.Item
            style={{ flex: 1, marginRight: '8px' }}
            name={[record._id, 'total']}
            rules={[
              {
                required: true,
                message: `Please input Jumlah!`,
              },
            ]}
          >
            <Input
              disabled
              defaultValue={isEditMode ? String(record.total) : undefined}
            />
          </Form.Item>
          <DeleteOutlined
            onClick={() =>
              handleRemove(
                record._id,
                record.id_data_barang,
                record.qty_sold,
                record.total
              )
            }
            style={{ marginBottom: 27, color: 'red' }}
          />
        </div>
      ),
    },
  ]

  return (
    <div>
      <div style={{ position: 'relative' }}>
        {' '}
        <div
          style={{
            fontSize: '12px',
            position: 'absolute',
            right: '0',
            top: '0',
          }}
        >
          {currentInv}
        </div>{' '}
      </div>

      <div>
        <Form.Item>
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
              onChange={(value) => setSelectedOutletId(value)}
              defaultValue={user?.id_outlet}
            >
              {outletsData?.map((Itsonyou: Outlet) => (
                <Select.Option key={Itsonyou._id} value={Itsonyou._id}>
                  {Itsonyou.nama_outlet}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form.Item>
      </div>

      <Form.Item>
        <Select
          showSearch
          // style={{
          //   ...inputStyle,
          //   backgroundColor: 'lightblue',
          //   marginRight: '10px',
          //   width: '400px',
          // }}
          placeholder="Pilih Pelanggang"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option?.children?.toString()
              ? option.children
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              : false
          }
          value={selectedPelanganId || undefined}
          onChange={(value) => {
            setSelectedPelanganId(value)
            handlePelangganChange(value)
          }}
          style={{ marginRight: '10px', width: '400px' }}
          dropdownRender={(menu) => (
            <div>
              {menu}
              <Divider style={{ margin: '4px 0' }} />
              <Col span={4} style={{ padding: '8px', textAlign: 'center' }}>
                <Link to="/form-pelanggan">
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
          {pelanggans?.map((pelanggan: Pelanggan) => (
            <Select.Option key={pelanggan._id} value={pelanggan._id}>
              {pelanggan.nama_pelanggan}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* <Form.Item>
        <Select
          showSearch
          style={{
            ...inputStyle,

            width: 200,
            position: 'absolute',
            right: '0',
          }}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option?.children?.toString()
              ? option.children
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              : false
          }
        ></Select>
      </Form.Item> */}
      <Form.Item>
        <DateRange
          defaultValue={
            isEditMode && getPenjualanDetail && getPenjualanDetail.length > 0
              ? [
                  getPenjualanDetail[0]?.tanggal_mulai,
                  getPenjualanDetail[0]?.tanggal_akhir,
                ]
              : undefined
          }
          difference={
            isEditMode && getPenjualanDetail && getPenjualanDetail.length > 0
              ? getPenjualanDetail[0]?.selisih
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

      <Form form={form}>
        <Table
          dataSource={poss}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={false}
          rowClassName={() => 'testos'}
        />
      </Form>
      <Button
        size="small"
        onClick={handleAdd}
        style={{
          marginTop: 16,
          width: 350,
        }}
        disabled={!selectedPelanganId}
      >
        + Tambah Baris
      </Button>

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}></div>
        <div style={{ flex: 1 }}>
          {isEditMode && (
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
                {cicilans?.map((cicilan, index) => {
                  const bank = banks?.find(
                    (bank) => bank._id === cicilan.id_bank
                  )
                  return (
                    <tr key={cicilan.id_pos}>
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
        </div>

        <div style={{ flex: 1 }}>
          <Form.Item
            label="Total"
            labelCol={{ style: labelStyle }}
            wrapperCol={{ style: wrapperStyle }}
          >
            <IDRInput
              type="number"
              value={total_semua}
              onChange={handleBayarChange}
            />
          </Form.Item>

          <Form.Item
            label="Bayar"
            labelCol={{ style: labelStyle }}
            wrapperCol={{ style: wrapperStyle }}
          >
            <IDRInput
              value={bayar}
              onChange={handleBayarChange}
              style={inputStyle}
              addonAfter={
                <IDRInput
                  type="number"
                  value={kembalian}
                  // value={'0'}
                  style={{
                    ...inputStyle,
                    background: 'none',
                    color: 'inherit',
                    border: 'none',
                    width: '100px',
                  }}
                  disabled
                />
              }
            />
          </Form.Item>

          <Form.Item
            label="Sisa Pembayaran"
            labelCol={{ style: labelStyle }}
            wrapperCol={{ style: wrapperStyle }}
          >
            <IDRInput
              type="text"
              value={`${totalPiutang}`}
              readOnly={true}
              style={{ width: '100px' }}
              inputStyle={{ textAlign: 'right' }}
            />
          </Form.Item>

          <Form.Item
            label="via"
            name="via"
            labelCol={{ style: labelStyle }}
            wrapperCol={{ style: wrapperStyle }}
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
                  {bank.nama_bank}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              style: { ...wrapperStyle, textAlign: 'right' },
              offset: 1,
            }}
          >
            <Link to="/penjualan">
              <Button
                size="small"
                onClick={() => {
                  const cicilanPiutang =
                    isPiutang() && total_semua !== null
                      ? total_semua - bayar
                      : 0
                  const cicilanData = {
                    _id: '',
                    id_bank: via,
                    id_pos: currentIdPos,
                    tanggal: selectedDates[0],
                    cicil: bayar,
                    piutang: cicilanPiutang,
                  }

                  addCicilan(cicilanData as any)

                  handleSaveInvoice()
                }}
                type="primary"
                disabled={
                  !selectedBank ||
                  hasError ||
                  poss.some((pos) => {
                    const currentFields = form.getFieldValue(pos._id)
                    if (currentFields) {
                      const hargaJual = parseInt(currentFields.harga_jual, 10)
                      const hargaRendah = parseInt(
                        hargaBadge[pos._id]?.rendah || '0',
                        10
                      )
                      const hargaTinggi = parseInt(
                        hargaBadge[pos._id]?.tinggi || '0',
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
                  color: 'white',
                  borderRadius: '0px 0px 0px',
                }}
              >
                <AiOutlineSave style={{ marginRight: 7, marginTop: -4 }} />
                Simpan
              </Button>
            </Link>
          </Form.Item>
        </div>
      </div>
    </div>
  )
}

export default PosPage
