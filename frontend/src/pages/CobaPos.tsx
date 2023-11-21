import React, { useContext, useEffect, useState } from 'react'
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

import { v4 as uuidv4 } from 'uuid'
// import Iqra from '../Iqra'
import moment from 'moment'

import { Link } from 'react-router-dom'
import { AiOutlinePlus, AiOutlineSave } from 'react-icons/ai'

import dayjs, { Dayjs } from 'dayjs'
import '../../index.css'

import {
  useGetProductsQuery,
  useUpdateProductMutation,
} from '../hooks/productHooks'

import { useGetMultisQuery } from '../hooks/multiHooks'
import { useAddCicilanMutation } from '../hooks/cicilanHooks'
import { useGetBanksQuery } from '../hooks/bankHooks'
import { Pos } from '../types/Pos'
import { useGetoutletsQuery } from '../hooks/outletHooks'
import { useGetPelanggansQuery } from '../hooks/pelangganHooks'
import { useAddPenjualanMutation } from '../hooks/penjualanHooks'
import UserContext from '../contexts/UserContext'
import { useGetHargasQuery } from '../hooks/hargaHooks'
import IDRInput from './pos/IdrInput'
import { useAddPosMutation } from '../hooks/posHooks'
import { Cicilan } from '../types/Cicilan'
import { useUpdateStokMutation } from '../hooks/stokHooks'
import { Pelanggan } from '../types/Pelanggan'
import { Harga } from '../types/Harga'
import { Outlet } from '../types/Outlet'
import DateRange from './DateRange'
import { Bank } from '../types/Bank'

const CobaPage: React.FC = () => {
  const { mutate: addCicilan } = useAddCicilanMutation()
  const [selectedOutletId, setSelectedOutletId] = useState('')

  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  if (user) {
    console.log(user.id_outlet)
  }

  const { data: hargas } = useGetHargasQuery()
  const { data: products } = useGetProductsQuery()
  const { data: multis } = useGetMultisQuery()
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
  const [form] = Form.useForm()

  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [selisih, setSelisih] = useState<number>(0)
  const [idOutet, setIdOutlet] = useState<String>('1')

  const generateInvoiceId = (): string => {
    const uuid = uuidv4()
    const splitUUID = uuid.split('-')
    const lastPartOfUUID = splitUUID[splitUUID.length - 1]
    const invoiceId = `INV${parseInt(lastPartOfUUID, 16)}`
    return invoiceId
  }

  const generateShortInvoiceId = (): string => {
    const uuid = uuidv4()
    const last4OfUUID = uuid.substr(uuid.length - 4)
    const shortNumber = parseInt(last4OfUUID, 16) % 10000
    const invoiceId = `INV${String(shortNumber).padStart(4, '0')}`
    return invoiceId
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
  const [currentIdPos, setCurrentIdPos] = useState(generateInvoiceId())
  const [currentInv, setCurrentInv] = useState(generateShortInvoiceId())
  const [date, setDate] = useState<Date>(new Date())
  const addPenjualanMutation = useAddPenjualanMutation()
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

  // const { data: stoks } = useGetStoksQuery()
  const [stokPerProduk, setStokPerProduk] = useState<{ [key: string]: number }>(
    {}
  )

  const [stokCount, setStokCount] = useState<number>(0)
  const [hasError, setHasError] = useState(false)
  const handleQtyChange = (
    value: number | string | null | undefined,
    posId: string
  ) => {
    const newValue = typeof value === 'number' ? value : 0

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
    const selectedMulti = multis?.find(
      (m) =>
        m.id_data_barang === currentPos.id_data_barang && m.id_harga === hargaId
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
  }

  const handleSaveInvoice = () => {
    console.log('handleSaveInvoice is called') // Ini adalah log konsol yang saya sarankan Anda tambahkan

    handleSave() // Ini akan menyimpan pos dan mengurangi stok

    const piutangValue = isPiutang() ? total_semua - bayar : 0
    const selisihKosong = bayar === total_semua ? 0 : selisih

    const invoiceToSave = {
      _id: '', // MongoDB akan otomatis mengisi ini saat Anda membuat dokumen baru
      id_pos: currentIdPos,
      total_semua: total_semua.toString(),
      diskon: diskon.toString(),
      bayar: bayar.toString(),
      kembalian: kembalian.toString(),
      tanggal_mulai: startDate,
      tanggal_akhir: endDate,
      via: via ? via.toString() : '',
      piutang: piutangValue.toString(),
      id_pelanggan: selectedPelanganId || undefined,
      inv: currentInv || undefined,
      selisih: selisihKosong,
      id_harga: id_harga || undefined,
      id_outlet: user?.id_outlet || '',
    }
    console.log('Data invoice yang akan disimpan:', invoiceToSave)

    addPenjualanMutation.mutate(invoiceToSave, {
      onSuccess: () => {
        console.log('addPenjualanMutation berhasil')
        const cicilanData: Cicilan = {
          _id: '',
          id_bank: invoiceToSave.via,
          id_pos: invoiceToSave.id_pos,
          tanggal: invoiceToSave.tanggal_mulai,
          cicil: invoiceToSave.bayar,
        }
        addCicilan(cicilanData, {
          onSuccess: () => {},
          onError: (error) => {
            console.error('Error adding to cicilan:', error)
          },
        })
      },
      onError: (error) => {
        console.error('Error saving invoice:', error)
      },
    })
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
        id: '',
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

  // useEffect(() => {
  //   console.log('Komponen dirender ulang')
  // }, []) // Array kosong berarti useEffect ini akan berjalan sekali saja saat komponen dipasang

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

    const relatedStok = products?.find((s) => s.id_data_barang === productId)
    const stokCount = relatedStok ? relatedStok.jumlah_stok : 0

    setStokCount(stokCount)

    setStokPerProduk((prevState) => ({ ...prevState, [posId]: stokCount }))

    // const blockStok = relatedStok ? relatedStok.jumlah_stok : 0
    // const stokSiapDiBlock = blockStok === 0
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

  const handleRemove = (id: string) => {
    const updatedPoss = poss.filter((jos) => jos._id !== id)
    setPoss(updatedPoss)
    hitungTotalSemua(updatedPoss)
  }

  const [total_semua, setTotalSemua] = useState(0)

  const [diskon, setDiskon] = useState(0)

  const [via, setVia] = useState('0')

  // const handleDiskonChange = (value: number | string | null | undefined) => {
  //   const numericValue =
  //     typeof value === 'string' ? parseInt(value.replace(/\./g, ''), 10) : value
  //   setDiskon(numericValue)
  // }

  const [bayar, setBayar] = useState(0)
  const [isBayarFilled, setIsBayarFilled] = useState(false)

  const handleBayarChange = (value: number | string | null | undefined) => {
    const numericValue =
      typeof value === 'string' ? parseInt(value.replace(/\./g, ''), 10) : value
    setBayar(numericValue)

    if (numericValue > 0) {
      setIsBayarFilled(true)
    } else {
      setIsBayarFilled(false)
    }
  }

  const [kembalian, setKembalian] = useState(0)
  useEffect(() => {
    setKembalian(bayar - total_semua)
  }, [bayar, total_semua])

  // const hitungTotalSemua = () => {
  //   let total = poss.reduce((sum, pos) => {
  //     const nilaiTotalPos = form.getFieldValue(pos._id)?.total || '0'
  //     return sum + parseInt(nilaiTotalPos, 10)
  //   }, 0)
  //   total = total - diskon
  //   setTotalSemua(total)
  // }

  const hitungTotalSemua = (list = poss) => {
    let total = list.reduce((sum, pos) => {
      const nilaiTotalPos = form.getFieldValue(pos._id)?.total || '0'
      return sum + parseInt(nilaiTotalPos, 10)
    }, 0)
    total = total - diskon
    setTotalSemua(total)
  }

  // const handleSave = () => {
  //   poss.forEach((pos) => {
  //     const posToSave = form.getFieldValue(pos._id)

  //     if (!posToSave.id_harga || posToSave.id_harga === '') {
  //       posToSave.id_harga = selectedIdHarga || '0'
  //     }

  //     const { _id, ...posDataToSave } = posToSave
  //     addPosMutation.mutate(posDataToSave)

  //     const currentStok = products?.find(
  //       (stok) => stok._id === pos.id_data_barang
  //     )

  //     if (currentStok) {
  //       const updatedStokValue = currentStok.jumlah_stok - pos.qty_sold

  //       const updatedStok = {
  //         ...currentStok,
  //         jumlah_stok: updatedStokValue,
  //       }

  //       updatedProductMutation.mutate(updatedStok)
  //     }
  //   })
  // }
  const handleSave = () => {
    poss.forEach((pos) => {
      const posFormData = form.getFieldValue(pos._id)

      if (!posFormData.id_harga || posFormData.id_harga === '') {
        posFormData.id_harga = selectedIdHarga || '0'
      }

      const currentProduct = products?.find(
        (product) => product._id === pos.id_data_barang
      )

      if (currentProduct) {
        const stokCount = currentProduct.jumlah_stok
        const remainingStok = stokCount

        // Memperbarui nilai biji dengan remainingStok
        posFormData.biji = remainingStok
      }

      const { _id, ...posDataToSave } = posFormData
      addPosMutation.mutate(posDataToSave)

      const currentStok = products?.find(
        (stok) => stok._id === pos.id_data_barang
      )

      if (currentStok) {
        const updatedStokValue = currentStok.jumlah_stok - pos.qty_sold
        const updatedStok = {
          ...currentStok,
          jumlah_stok: updatedStokValue,
        }

        updatedProductMutation.mutate(updatedStok)
      }
    })
  }

  const [selectedBank, setSelectedBank] = useState<string | null>(null)

  const isPiutang = (): boolean => {
    return total_semua > bayar
  }
  const labelStyle = {
    width: '150px', // Anda dapat menyesuaikan lebar ini sesuai kebutuhan.
  }

  const wrapperStyle = {
    flex: 1,
  }
  const inputStyle = {
    textAlign: 'center',
  }

  // useEffect(() => {}, [selectedDates])
  // useEffect(() => {}, [selisih])
  // useEffect(() => {
  //   return () => {}
  // }, [])

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
        const barang = products?.find(
          (product) => product._id === record.id_data_barang
        )
        const stokCount = barang?.jumlah_stok || 0

        const currentFields = form.getFieldValue(record._id)
        const hargaJual = currentFields?.harga_jual || '0'
        const hargaJualTerendah = currentFields?.harga_jual_rendah || '0'

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
                  visibility: barangSelected ? 'visible' : 'hidden',
                }}
                overflowCount={9999}
              />
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
        const product = products!.find((p) => p._id === record.id_data_barang)
        const stokCount = product ? product.jumlah_stok : 0

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

                  if (stokCount <= 0) {
                    setHasError(true)
                    return Promise.reject(new Error('Stok produk kosong!'))
                  }

                  if (isNaN(qtyInput) || qtyInput > stokCount) {
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
            <IDRInput
              disabled={stokCount <= 0} // Ini mendisable input jika stokCount kurang dari atau sama dengan 0
              onChange={(e) => handleQtyChange(e, record._id)}
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
            // Validasi kustom
            ({ getFieldValue }) => ({
              validator(_, value) {
                const hargaInput = parseInt(value, 10) // Jika value adalah string dengan format IDR, Anda mungkin perlu mengurai formatnya terlebih dahulu
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
          <IDRInput
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
                    defaultValue={id_harga || undefined} // id_harga sebagai defaultValue
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
          <IDRInput onChange={() => calculation(record._id)} />
        </Form.Item>
      ),
    },
    // {
    //   title: 'Biji',
    //   dataIndex: 'biji',
    //   render: (text: string, record: Pos) => {
    //     const product = products!.find((p) => p._id === record.id_data_barang)
    //     const stokCount = product ? product.jumlah_stok : 0
    //     const remainingStok = stokCount - record.qty_sold

    //     console.log('remianing stok', remainingStok)
    //     console.log('StokCount', stokCount)

    //     return (
    //       <Form.Item
    //         name={[record._id, 'biji']}
    //         rules={[
    //           {
    //             required: true,
    //             message: `Please input Diskon!`,
    //           },
    //         ]}
    //       >
    //         <Input value={remainingStok.toString()} style={{ width: 100 }} />
    //       </Form.Item>
    //     )
    //   },
    // },

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
            style={{ flex: 1, marginRight: '8px' }} // margin kanan untuk memberikan jarak
            name={[record._id, 'total']}
            rules={[
              {
                required: true,
                message: `Please input Jumlah!`,
              },
            ]}
          >
            <IDRInput disabled />
          </Form.Item>
          <DeleteOutlined
            onClick={() => handleRemove(record._id)}
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
              defaultValue={user?.id_outlet} // <-- Penambahan baris ini
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
          style={{
            ...inputStyle,
            backgroundColor: 'lightblue',
            marginRight: '10px',
            width: '400px',
          }}
          placeholder="Pilih Pelanggan"
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
            handlePelangganChange(value) // Fungsi ini dipanggil di sini
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

      <Form.Item>
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
      </Form.Item>

      <Form.Item>
        <DateRange
          onChange={(dates: [string, string]) => {
            setStartDate(dates[0])
            setEndDate(dates[1])
          }}
          onDifferenceChange={(diff: number) => {
            setSelisih(diff)
          }}
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
        <div style={{ flex: 1 }}>
          {/* Bagian kiri bisa Anda isi atau biarkan kosong */}
        </div>
        <div style={{ flex: 1 }}>
          {/* Bagian kiri bisa Anda isi atau biarkan kosong */}
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
              style={{ inputStyle, width: 280 }}
            />
          </Form.Item>

          {/* <Form.Item
            label="Potongan/invoice"
            labelCol={{ style: labelStyle }}
            wrapperCol={{ style: wrapperStyle }}
          >
            <IDRInput
              type="number"
              value={diskon}
              onChange={handleDiskonChange}
              style={inputStyle}
            />
          </Form.Item> */}

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
              value={isPiutang() ? `${total_semua - bayar}` : '0'}
              readOnly={true}
              style={{ inputStyle, width: 280 }}
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
            {/* <Link to="/penjualan"> */}
            <Button
              size="small"
              onClick={handleSaveInvoice}
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
            {/* </Link> */}
          </Form.Item>
        </div>
      </div>
    </div>
  )
}

export default CobaPage
