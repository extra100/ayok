// import React, { useEffect, useRef, useState } from 'react'
// import { Link, useParams } from 'react-router-dom'
// import {
//   Table,
//   Button,
//   Input,
//   Select,
//   Badge,
//   Form,
//   Popconfirm,
//   Menu,
//   Dropdown,
//   InputNumber,
// } from 'antd'
// import {
//   useAddPosMutation,
//   useDeletePosMutation,
//   useGetPosDetailQuery,
//   useGetPossQuery,
//   useUpdatePosMutation,
// } from '../hooks/posHooks'
// import {
//   useGetPenjualanByIdQuery,
//   useUpdatePenjualanMutation,
// } from '../hooks/penjualanHooks'
// import { useGetPelanggansQuery } from '../hooks/pelangganHooks'
// import {
//   useGetProductsQuery,
//   useUpdateProductMutation,
// } from '../hooks/productHooks'
// import { useGetStoksQuery, useUpdateStokMutation } from '../hooks/stokHooks'
// import { useGetMultisQuery } from '../hooks/multiHooks'
// import { useGetHargasQuery } from '../hooks/hargaHooks'
// import { useGetBanksQuery } from '../hooks/bankHooks'
// import { Pos } from '../types/Pos'
// import DateRange from './DateRange'
// import moment from 'moment'
// import dayjs from 'dayjs'
// import type { Dayjs } from 'dayjs'
// import { MoreOutlined } from '@ant-design/icons'
// import { DeleteOutlined } from '@ant-design/icons'
// import { debounce } from 'lodash'
// import { Product } from '../types/Product'
// import { Cicilan } from '../types/Cicilan'
// import {
//   useAddCicilanMutation,
//   useGetCicilanByIdQuery,
//   useGetCicilansQuery,
// } from '../hooks/cicilanHooks'
// import { Penjualan } from '../types/Penjualan'

// const DetailPosPage: React.FC = () => {
//   const { id_pos } = useParams<{ id_pos?: string }>()

//   const updatePosMutation = useUpdatePosMutation()
//   const { mutate: addCicilan } = useAddCicilanMutation()

//   const updatePenjualanMutation = useUpdatePenjualanMutation()
//   const updateProductMutation = useUpdateProductMutation()
//   const addPosMutation = useAddPosMutation()

//   const { data: getPosDetail } = useGetPosDetailQuery(id_pos as string)
//   const { data: ayokStok } = useGetPosDetailQuery(id_pos as string)
//   // const { data: cicilanDetail } = useGetCicilansQuery()

//   const { data: penjualanDetail } = useGetPenjualanByIdQuery(id_pos as string)
//   console.log('Checking ID POS:', id_pos)

//   const { data: cicilanDetail } = useGetCicilanByIdQuery(id_pos as string)
//   console.log('data cicilan query', cicilanDetail)

//   if (cicilanDetail) {
//     const allIdBanks = cicilanDetail.map((detail) => detail.id_bank)
//     console.log('All ID Banks:', allIdBanks)
//   } else {
//     console.log('No data found for the given ID POS.')
//   }

//   const id_pelanggan = penjualanDetail?.[0]?.id_pelanggan
//   const id_harga = penjualanDetail?.[0]?.id_harga
//   const total_semua = penjualanDetail?.[0]?.total_semua
//   const id_bank = penjualanDetail?.[0]?.via
//   const diskon = penjualanDetail?.[0]?.diskon
//   const kembalian = penjualanDetail?.[0]?.kembalian
//   const selisih = penjualanDetail?.[0]?.selisih

//   const tanggal_mulai = penjualanDetail?.[0]?.tanggal_mulai
//     ? moment(penjualanDetail?.[0]?.tanggal_mulai)
//     : null
//   const tanggal_akhir = penjualanDetail?.[0]?.tanggal_akhir
//     ? moment(penjualanDetail?.[0]?.tanggal_akhir)
//     : null

//   const bayar = penjualanDetail?.[0]?.bayar
//   const piutang = penjualanDetail?.[0]?.piutang
//   const inv = penjualanDetail?.[0]?.inv

//   const [disableButton, setDisableButton] = useState(false)
//   const [inputError, setInputError] = useState(false)

//   const { data: pelanggans } = useGetPelanggansQuery()
//   const pelanggan = pelanggans?.find((p) => p._id === id_pelanggan)

//   const { data: barangs } = useGetProductsQuery()
//   const idBarangYangDicari = 'id_data_barang_yang_anda_cari' // Ganti dengan ID yang sesuai
//   const barang = barangs?.find((p) => p.id_data_barang === idBarangYangDicari)

//   const jumlahStok = barang?.jumlah_stok || 0 //

//   const { data: banks } = useGetBanksQuery()
//   const bank = banks?.find((p) => p._id === id_bank)

//   const productsQuery = useGetProductsQuery()

//   const HargasQuery = useGetHargasQuery()

//   const [editMode, setEditMode] = useState(false)
//   const [editedData, setEditedData] = useState<any | null>(null)

//   const multiData = useGetMultisQuery()

//   const [selectedBarang, setSelectedBarang] = useState<string | null>(null)
//   const [selectedHarga, setSelectedHarga] = useState<string | null>(null)
//   const [selectedHargaTertinggi, setSelectedHargaTertinggi] = useState<
//     string | null
//   >(null)
//   const [bayarInputValue, setBayarInputValue] = useState('0')
//   const [kembalianInputValue, setKembalianInputValue] = useState('0')

//   // const stokData = useGetStoksQuery()
//   const stokPerProduk = useRef<{ [key: string]: number }>({})
//   const [isOverStock, setIsOverStock] = useState<boolean>(false)
//   const [isStokZero, setIsStokZero] = useState<boolean>(false)
//   const [originalQtySold, setOriginalQtySold] = useState<number>(0)
//   // Gantikan state dengan objek
//   const [originalTransactionQty, setOriginalTransactionQty] = useState<
//     Record<string, number>
//   >({})

//   useEffect(() => {
//     const updatedOriginalQty: Record<string, number> = {}

//     getPosDetail?.forEach((item) => {
//       updatedOriginalQty[item._id] = item.qty_sold
//     })

//     setOriginalTransactionQty(updatedOriginalQty)
//   }, [getPosDetail])

//   const addNewRow = () => {
//     const defaultHargaId = pelanggan?.id_harga || ''

//     const tempId = `temp-${Date.now()}`

//     // const newRow = {
//     //   _id: tempId,
//     //   inv: inv || '',
//     //   id_pos: id_pos || '',
//     //   qty_sold: 1,
//     //   harga_jual: '0',
//     //   total: '0', // Inisialisasi dengan 0 atau Anda dapat menghitung berdasarkan qty_sold dan harga_jual jika perlu
//     //   id_data_barang: '',
//     //   diskon: '0',
//     //   id_harga: defaultHargaId,
//     //   biji: jumlahStok,
//     //   isNew: true, // Tandai bahwa ini adalah baris baru
//     // }
//     // console.log(newRow)
//     // const updatedData = [...(editedData || []), newRow]
//     // setEditedData(updatedData)
//     // hitungTotalSemua() // Memanggil fungsi ini setelah menambahkan baris baru
//     // hitungPiutangDenganBaru()

//     if (!editMode) {
//       handleEditModeToggle()
//     }
//     // console.log('Baris baru ditambahkan:', updatedData)
//   }

//   useEffect(() => {
//     if (selectedBarang) {
//       const multiItem = multiData?.data?.find(
//         (s) =>
//           s.id_data_barang === selectedBarang && s.id_harga === selectedHarga
//       )
//       if (multiItem) {
//         const hargaTertinggi = multiItem.harga_tertinggi
//         setEditedData((prevEditedData: any[]) => {
//           const updatedData = [...prevEditedData]
//           updatedData[updatedData.length - 1].harga_jual = hargaTertinggi
//           return updatedData
//         })
//       }
//     }
//   }, [selectedBarang, multiData.data, selectedHarga])

//   const handleEditModeToggle = () => {
//     setEditMode(!editMode)
//     if (!editMode) {
//       setEditedData(getPosDetail)
//     } else {
//       setEditedData(null)
//     }
//   }

//   const hitungTotalSemua = (data: any[] = editedData) => {
//     let total =
//       data?.reduce((sum: number, item: any) => {
//         const nilaiTotalItem =
//           item.qty_sold * item.harga_jual - (parseInt(item.diskon, 10) || 0)
//         return sum + nilaiTotalItem
//       }, 0) || 0

//     const bayarValue = parseFloat(penjualanForm.bayar || '0')
//     let sisaPiutang = total - bayarValue
//     if (sisaPiutang < 0) sisaPiutang = 0
//     setPenjualanForm((prev) => ({
//       ...prev,
//       total_semua: total.toString(),
//       piutang: sisaPiutang.toString(),
//     }))
//     console.log('New piutang after change:', sisaPiutang.toString())
//   }

//   const hitungPiutangDenganBaru = () => {
//     let totalPiutangBaru =
//       editedData?.reduce((sum: number, item: any) => {
//         const nilaiItem =
//           item.qty_sold * item.harga_jual - (parseInt(item.diskon, 10) || 0)
//         return sum + nilaiItem
//       }, 0) || 0

//     const piutangAwal = penjualanForm.piutang
//       ? parseInt(penjualanForm.piutang, 10)
//       : 0

//     const piutangAkhir =
//       piutangAwal +
//       totalPiutangBaru -
//       (parseInt(penjualanForm.total_semua, 10) || 0)

//     setPenjualanForm((prev) => ({
//       ...prev,
//       piutang: piutangAkhir.toString(),
//     }))

//     console.log(
//       'Selesai hitungPiutangDenganBaru dengan penjualanForm:',
//       penjualanForm
//     )
//   }

//   const handleInputChange = (recordKey: string, field: string, value: any) => {
//     console.log(
//       `Memulai handleInputChange untuk recordKey: ${recordKey}, field: ${field}, value: ${value}`
//     )

//     const newData = [...(editedData || [])]
//     const itemIndex = newData.findIndex((item) => item._id === recordKey)

//     if (itemIndex !== -1) {
//       newData[itemIndex][field] = value

//       if (field === 'id_data_barang' || field === 'id_harga') {
//         const multiItem = multiData?.data?.find(
//           (s) =>
//             s.id_data_barang === newData[itemIndex].id_data_barang &&
//             s.id_harga === newData[itemIndex].id_harga
//         )
//         if (multiItem) {
//           newData[itemIndex].harga_jual = multiItem.harga_tertinggi
//           const barang = productsQuery.data?.find(
//             (z) => z._id === newData[itemIndex].id_data_barang
//           )
//           newData[itemIndex].jumlah_stok = barang?.jumlah_stok || 0
//         }
//       }

//       if (['qty_sold', 'harga_jual', 'diskon'].includes(field)) {
//         newData[itemIndex].total =
//           newData[itemIndex].qty_sold * newData[itemIndex].harga_jual -
//           newData[itemIndex].diskon
//       }

//       setEditedData(newData)

//       hitungTotalSemua()
//       hitungPiutangDenganBaru()
//     }

//     console.log(
//       'Selesai handleInputChange dengan editedData:',
//       editedData,
//       'dan penjualanForm:',
//       penjualanForm
//     )
//   }
//   const isStockAvailable =
//     editedData && !editedData.some((item: any) => item.jumlah_stok <= 0)

//   const deletePosMutation = useDeletePosMutation()
//   const handleBayarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const bayarValue = parseFloat(e.target.value || '0')
//     setPenjualanForm((prev) => {
//       const kembalian = bayarValue - initialPiutang

//       let newPiutang = initialPiutang - bayarValue
//       console.log('New piutang after handleBayarChange:', newPiutang.toString())

//       if (newPiutang < 0) newPiutang = 0

//       return {
//         ...prev,
//         bayar: bayarValue.toString(),
//         piutang: newPiutang.toString(),
//         kembalian: kembalian > 0 ? kembalian.toString() : '0',
//       }
//     })
//   }

//   const updateStokBasedOnTransaction = (item: Pos) => {
//     const originalQty = originalTransactionQty[item._id] || 0

//     const newQtySold = item.qty_sold || 0
//     const qtyDifference = newQtySold - originalQty
//     const stokItem = productsQuery.data?.find(
//       (s) => s._id === item.id_data_barang
//     )
//     if (stokItem) {
//       let updatedStokCount = stokItem.jumlah_stok
//       if (qtyDifference > 0) {
//         updatedStokCount -= qtyDifference
//       } else if (qtyDifference < 0) {
//         updatedStokCount += Math.abs(qtyDifference)
//       }
//       const updatedStok = { ...stokItem, jumlah_stok: updatedStokCount }
//       updateProductMutation.mutate(updatedStok)
//     }
//   }

//   const handleSave = () => {
//     if (editedData && editedData.length > 0) {
//       editedData.forEach((item: any) => {
//         if (item._id.startsWith('temp-')) {
//           addPosMutation.mutate(item)
//         } else {
//           updatePosMutation.mutate(item)
//         }

//         updateStokBasedOnTransaction(item)
//       })
//     }

//     setEditMode(false)
//   }

//   const [penjualanForm, setPenjualanForm] = useState({
//     _id: penjualanDetail?.[0]?._id || '',
//     id_pos: id_pos || '',
//     total_semua: total_semua || '',
//     diskon: diskon || '',
//     bayar: bayar || '',
//     kembalian: kembalian || '',
//     tanggal_mulai:
//       penjualanDetail?.[0]?.tanggal_mulai || dayjs().format('DD-MM-YYYY'),
//     tanggal_akhir:
//       penjualanDetail?.[0]?.tanggal_akhir ||
//       dayjs().add(30, 'days').format('DD-MM-YYYY'),

//     via: id_bank || '',
//     piutang: piutang || '',
//     id_pelanggan: id_pelanggan || '',
//     inv: inv || '',
//     selisih: selisih,
//     id_harga: id_harga || '',
//   })
//   const [initialPiutang, setInitialPiutang] = useState<number>(0)
//   useEffect(() => {
//     console.log('useEffect triggered', penjualanDetail)

//     if (penjualanDetail && penjualanDetail[0]) {
//       const detail = penjualanDetail[0]
//       setInitialPiutang(parseFloat(detail.piutang || '0'))
//     }
//   }, [penjualanDetail])
//   const sisaPiutang =
//     parseFloat(penjualanForm.piutang) - parseFloat(penjualanForm.bayar || '0')

//   const handlePenjualanInputChange = (field: string, value: any) => {
//     setPenjualanForm((prevForm) => {
//       const newForm = { ...prevForm, [field]: value }

//       if (field === 'bayar') {
//         const bayarValue = parseFloat(value)
//         const kembalian = bayarValue - parseFloat(prevForm.piutang || '0')

//         if (kembalian > 0) {
//           newForm.kembalian = kembalian.toString()
//           setKembalianInputValue(kembalian.toString())
//         } else {
//           newForm.kembalian = '0'
//           setKembalianInputValue('0')
//         }
//       }

//       return newForm
//     })
//   }

//   const handleSavePenjualan = () => {
//     if (penjualanDetail) {
//       penjualanDetail.forEach((detail) => {
//         const updatedPenjualan = {
//           ...detail,
//           ...penjualanForm,
//         }
//         updatePenjualanMutation.mutate(updatedPenjualan)
//       })
//     }
//   }

//   useEffect(() => {
//     if (penjualanDetail && penjualanDetail[0]) {
//       const detail = penjualanDetail[0]
//       setPenjualanForm({
//         _id: detail._id || '',
//         id_pos: id_pos || '',
//         total_semua: detail.total_semua || '',
//         diskon: detail.diskon || '',
//         bayar: detail.bayar || '',
//         kembalian: detail.kembalian || '',
//         tanggal_mulai: detail.tanggal_mulai || dayjs().format('DD-MM-YYYY'),
//         tanggal_akhir:
//           detail.tanggal_akhir || dayjs().add(30, 'days').format('DD-MM-YYYY'),
//         via: detail.via || '',
//         piutang: detail.piutang || '',
//         id_pelanggan: detail.id_pelanggan || '',
//         inv: detail.inv || '',
//         selisih: selisih,
//         id_harga: detail.id_harga || '',
//       })
//     }
//   }, [penjualanDetail, id_pos])

//   const editMenu = (
//     <Menu>
//       <Menu.Item>
//         <Button onClick={handleEditModeToggle}>
//           {editMode ? 'Keluar Edit' : 'Edit '}
//         </Button>
//       </Menu.Item>
//     </Menu>
//   )

//   const labelStyle = {
//     width: '150px',
//   }

//   const wrapperStyle = {
//     flex: 1,
//   }
//   const inputStyle = {
//     textAlign: 'right',
//   }

//   const [temporaryBiji, setTemporaryBiji] = useState<number | null>(null)
//   const updateBiji = (value: string) => {
//     const selectedProduct = productsQuery.data?.find(
//       (s) => s.id_data_barang === value
//     )
//     const selectedStokCount = selectedProduct?.jumlah_stok || 0

//     setTemporaryBiji(selectedStokCount)
//   }

//   const [isValidInput, setIsValidInput] = useState(true)

//   const validateInput = (text: any, range: any) => {
//     const [min, max] = range.split(' - ')
//     const valid =
//       parseInt(text) >= parseInt(min) && parseInt(text) <= parseInt(max)
//     setIsValidInput(valid)
//   }

//   const [itemsToDelete, setItemsToDelete] = useState<string[]>([])
//   // const handleDelete = (recordId: string) => {
//   //   setItemsToDelete((prevItems) => [...prevItems, recordId])
//   // }
//   const handleDelete = (recordId: string) => {
//     // Cari item yang ingin dihapus berdasarkan recordId
//     const itemToDelete = editedData.find((item: any) => item._id === recordId)

//     if (itemToDelete) {
//       const qtyToReturn = itemToDelete.qty_sold

//       // Update jumlah stok untuk item tersebut
//       const stokItem = productsQuery.data?.find(
//         (s) => s.id_data_barang === itemToDelete.id_data_barang
//       )
//       if (stokItem) {
//         stokItem.jumlah_stok += qtyToReturn
//       }

//       // Hapus item dari editedData
//       const updatedData = editedData.filter(
//         (item: any) => item._id !== recordId
//       )
//       setEditedData(updatedData)

//       // Lakukan mutasi untuk menghapus item
//       deletePosMutation.mutate(recordId)
//     }
//   }
//   const handlePayment = () => {
//     if (itemsToDelete && itemsToDelete.length > 0) {
//       itemsToDelete.forEach((itemId) => {
//         const itemToDelete = editedData.find((item: any) => item._id === itemId)

//         if (itemToDelete) {
//           const qtyToReturn = itemToDelete.qty_sold

//           const stokItem = productsQuery.data?.find(
//             (s) => s.id_data_barang === itemToDelete.id_data_barang
//           )
//           if (stokItem) {
//             stokItem.jumlah_stok += qtyToReturn
//           }

//           const updatedData = editedData.filter(
//             (item: any) => item._id !== itemId
//           )
//           setEditedData(updatedData)
//           deletePosMutation.mutate(itemId)
//         }
//       })
//       setItemsToDelete([])
//     }

//     handleSave()
//     handleSavePenjualan()
//   }
//   const isPriceWithinRange =
//     editedData &&
//     editedData.every((item: any) => {
//       const multiItem = multiData?.data?.find(
//         (s) =>
//           s.id_data_barang === item.id_data_barang &&
//           s.id_harga === item.id_harga
//       )
//       const hargaTertinggi = multiItem ? multiItem.harga_tertinggi : Infinity
//       const hargaTerendah = multiItem ? multiItem.harga_terendah : 0

//       return (
//         item.harga_jual <= hargaTertinggi && item.harga_jual >= hargaTerendah
//       )
//     })

//   const columns = [
//     {
//       title: 'Nama Barang',
//       dataIndex: 'id_data_barang',
//       key: 'id_data_barang',
//       render: (id_data_barang: string, record: any) => {
//         const barang = productsQuery.data?.find(
//           (z) => z.id_data_barang === id_data_barang
//         )

//         const stokCount = barang?.jumlah_stok || 0

//         const multiItem = multiData?.data?.find(
//           (s) =>
//             s.id_data_barang === record.id_data_barang &&
//             s.id_harga === record.id_harga
//         )
//         const hargaTertinggi = multiItem ? multiItem.harga_tertinggi : null
//         const hargaRange = multiItem
//           ? `${multiItem.harga_terendah} - ${multiItem.harga_tertinggi}`
//           : '0 - 0'

//         const updateBiji = (value: string) => {
//           const selectedProduct = productsQuery.data?.find(
//             (s) => s.id_data_barang === value
//           )
//           const selectedStokCount = selectedProduct?.jumlah_stok || 0

//           handleInputChange(record._id, 'biji', selectedStokCount)

//           setTemporaryBiji(selectedStokCount)
//         }

//         return (
//           <div style={{ borderRadius: 0, position: 'relative' }}>
//             {editMode && (
//               <Badge
//                 count={stokCount.toString()}
//                 overflowCount={99999999}
//                 showZero
//                 style={{
//                   backgroundColor: stokCount <= 10 ? 'red' : 'green',
//                   position: 'absolute',
//                   right: '-310px',
//                   top: '-27px',
//                   zIndex: 2,
//                 }}
//               />
//             )}

//             {editMode ? (
//               <Select
//                 showSearch
//                 style={{ width: 300 }}
//                 optionFilterProp="children"
//                 filterOption={(input, option) =>
//                   option?.children?.toString()
//                     ? option.children
//                         .toString()
//                         .toLowerCase()
//                         .includes(input.toLowerCase())
//                     : false
//                 }
//                 value={id_data_barang}
//                 onChange={(value: string) => {
//                   handleInputChange(record._id, 'id_data_barang', value)

//                   const selectedStokItem = productsQuery.data?.find(
//                     (s) => s.id_data_barang === value
//                   )
//                   const selectedStokCount = selectedStokItem?.jumlah_stok || 0
//                   setIsOverStock(selectedStokCount <= 0)
//                   updateBiji(value) // Memanggil fungsi updateBiji setelah barang dipilih
//                 }}
//               >
//                 {productsQuery.data?.map((product) => (
//                   <Select.Option key={product._id} value={product._id}>
//                     {product.nama_barang}
//                   </Select.Option>
//                 ))}
//               </Select>
//             ) : barang ? (
//               barang.nama_barang
//             ) : (
//               'Unknown'
//             )}
//           </div>
//         )
//       },
//     },

//     {
//       title: 'Qty',
//       dataIndex: 'qty_sold',
//       key: 'qty_sold',
//       render: (text: string, record: any) => {
//         const formattedNumber = Number(text).toLocaleString('id-ID')

//         const stokItem = getPosDetail!.find(
//           (p) => p.id_data_barang === record.id_data_barang
//         )
//         const stokdiproduct = productsQuery.data?.find(
//           (p) => p.id_data_barang === record.id_data_barang
//         )
//         const bijireal = stokItem?.biji || 0
//         const barisBaru = stokdiproduct?.jumlah_stok || 0
//         const isNewRow = record.isNew
//         const biji = isNewRow ? barisBaru : bijireal

//         const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//           const newQtySold = parseInt(e.target.value, 10)
//           if (biji < newQtySold) {
//             e.target.setCustomValidity('Melebihi jumlah stok!')
//             setDisableButton(true)
//           } else {
//             setDisableButton(false)
//             e.target.setCustomValidity('') // clear any previous message
//             handleInputChange(record._id, 'qty_sold', newQtySold)
//           }
//         }

//         return (
//           <div>
//             {editMode ? (
//               <>
//                 <Input
//                   style={{ borderRadius: 0 }}
//                   type="number"
//                   value={text}
//                   onChange={handleQtyChange}
//                   onInvalid={(e) => e.preventDefault()} // prevent the browser default
//                 />
//                 {biji < parseInt(text, 10) && (
//                   <span style={{ color: 'red' }}>Melebihi stok!</span>
//                 )}
//               </>
//             ) : (
//               <span>{text}</span>
//             )}
//           </div>
//         )
//       },
//     },

//     {
//       title: 'Harga Jual',
//       dataIndex: 'harga_jual',
//       key: 'harga_jual',
//       render: (text: string, record: any) => {
//         const multiItem = multiData?.data?.find(
//           (s) =>
//             s.id_data_barang === record.id_data_barang &&
//             s.id_harga === record.id_harga
//         )
//         const hargaTertinggi = multiItem ? multiItem.harga_tertinggi : null
//         const hargaTerendah = multiItem ? multiItem.harga_terendah : null

//         return (
//           <div style={{ position: 'relative' }}>
//             {editMode ? (
//               <Input
//                 value={text || (hargaTertinggi as string)}
//                 onChange={(e) =>
//                   handleInputChange(record._id, 'harga_jual', e.target.value)
//                 }
//               />
//             ) : (
//               text
//             )}
//             {(parseInt(text) > Number(hargaTertinggi) ||
//               parseInt(text) < Number(hargaTerendah)) && (
//               <span
//                 style={{
//                   color: 'red',
//                   position: 'absolute',
//                   top: 32,
//                   right: 10,
//                   fontSize: 11,
//                 }}
//               >
//                 Di Luar harga Range!
//               </span>
//             )}
//           </div>
//         )
//       },
//     },

//     {
//       title: 'Jenis Harga',
//       dataIndex: 'id_harga',
//       key: 'id_harga',
//       render: (id_harga: string, record: any) => {
//         const harga = HargasQuery.data?.find((z) => z._id === id_harga)
//         const multiItem = multiData?.data?.find(
//           (s) =>
//             s.id_data_barang === record.id_data_barang &&
//             s.id_harga === record.id_harga
//         )
//         const hargaRange = multiItem
//           ? `${multiItem.harga_terendah} - ${multiItem.harga_tertinggi}`
//           : '0 - 0'

//         return editMode ? (
//           <Input
//             addonBefore={
//               <Select
//                 showSearch
//                 style={{ width: 120 }}
//                 optionFilterProp="children"
//                 filterOption={(input, option) =>
//                   option?.children?.toString()
//                     ? option.children
//                         .toString()
//                         .toLowerCase()
//                         .includes(input.toLowerCase())
//                     : false
//                 }
//                 value={id_harga}
//                 onChange={(value: string) =>
//                   handleInputChange(record._id, 'id_harga', value)
//                 }
//               >
//                 {HargasQuery.data?.map((product) => (
//                   <Select.Option key={product._id} value={product._id}>
//                     {product.jenis_harga}
//                   </Select.Option>
//                 ))}
//               </Select>
//             }
//             value={hargaRange}
//             readOnly
//           />
//         ) : (
//           <>{harga ? harga.jenis_harga : 'Unknown'}</>
//         )
//       },
//     },

//     {
//       title: 'Jumlah',
//       dataIndex: 'total',
//       key: 'total',
//       render: (text: string, record: any) => {
//         const totalPerItem = record.qty_sold * record.harga_jual - record.diskon

//         return (
//           <div
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//             }}
//           >
//             {editMode ? (
//               <>
//                 <Input
//                   value={totalPerItem}
//                   onChange={(e) =>
//                     handleInputChange(record._id, 'total', e.target.value)
//                   }
//                 />
//                 <DeleteOutlined
//                   onClick={() => handleDelete(record._id)}
//                   style={{ marginBottom: 5, color: 'red', marginLeft: '10px' }}
//                 />
//               </>
//             ) : (
//               totalPerItem
//             )}
//           </div>
//         )
//       },
//     },
//   ]

//   return (
//     <div>
//       <div style={{ flex: 1, display: 'flex', marginBottom: 20 }}>
//         <div
//           style={{
//             flex: 1,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'left',
//           }}
//         >
//           {pelanggan?.nama_pelanggan}
//         </div>
//         <div></div>
//         <div
//           style={{
//             flex: 1,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'right',
//           }}
//         >
//           {penjualanDetail?.[0]?.inv}
//         </div>
//       </div>
//       <DateRange
//         difference={penjualanDetail?.[0]?.selisih}
//         value={[
//           penjualanDetail?.[0]?.tanggal_mulai || '',
//           penjualanDetail?.[0]?.tanggal_akhir || '',
//         ]}
//         onDifferenceChange={(newSelisih) => {
//           setPenjualanForm((prev) => ({
//             ...prev,
//             selisih: newSelisih,
//           }))
//         }}
//         onChange={(newDates) => {
//           setPenjualanForm((prev) => ({
//             ...prev,
//             tanggal_mulai: newDates[0],
//             tanggal_akhir: newDates[1],
//           }))
//         }}
//       />

//       <div style={{ flex: 1, display: 'flex' }}>
//         <div style={{ flex: 1 }}></div>
//         <div style={{ flex: 1, marginBottom: 20 }}>
//           <div
//             style={{
//               flex: 1,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'right',
//             }}
//           >
//             <Dropdown overlay={editMenu} trigger={['click']}>
//               <MoreOutlined style={{ cursor: 'pointer' }} />
//             </Dropdown>
//           </div>
//         </div>
//       </div>
//       <Table
//         dataSource={editedData || getPosDetail}
//         columns={columns}
//         rowKey={(record) => record._id}
//         pagination={false}
//         style={{ marginBottom: 20 }}
//       />
//       {editMode && <Button onClick={addNewRow}>+ Add Row</Button>}
//       <div style={{ display: 'flex' }}>
//         <div style={{ flex: 1 }}></div>

//         <div style={{ flex: 1 }}>
//           <div style={{ flex: 1 }}>
//             <Form.Item
//               label="Total"
//               labelCol={{ style: labelStyle }}
//               wrapperCol={{
//                 style: { ...wrapperStyle, textAlign: 'right' },
//                 offset: 1,
//               }}
//             >
//               <Input
//                 value={penjualanForm.total_semua}
//                 onChange={(e) =>
//                   handlePenjualanInputChange('total_semua', e.target.value)
//                 }
//               />
//             </Form.Item>
//             <Form.Item
//               label="Diskon"
//               labelCol={{ style: labelStyle }}
//               wrapperCol={{
//                 style: { ...wrapperStyle, textAlign: 'right' },
//                 offset: 1,
//               }}
//             >
//               <Input
//                 value={penjualanDetail?.[0]?.diskon}
//                 onChange={(e) =>
//                   handlePenjualanInputChange('diskon', e.target.value)
//                 }
//               />
//             </Form.Item>
//             <Form.Item
//               label="Sisa Bayar"
//               labelCol={{ style: labelStyle }}
//               wrapperCol={{
//                 style: { ...wrapperStyle, textAlign: 'right' },
//                 offset: 1,
//               }}
//             >
//               <Input value={penjualanForm.piutang} />
//             </Form.Item>

//             <Form.Item
//               label="bayar"
//               labelCol={{ style: labelStyle }}
//               wrapperCol={{
//                 style: { ...wrapperStyle, textAlign: 'right' },
//                 offset: 1,
//               }}
//             >
//               <Input
//                 type="number"
//                 value={penjualanForm.bayar}
//                 onChange={handleBayarChange}
//                 // style={{ display: 'none' }} // menyembunyikan input
//               />
//             </Form.Item>

//             {/* <Form.Item
//               label="inputan bayar"
//               labelCol={{ style: labelStyle }}
//               wrapperCol={{
//                 style: { ...wrapperStyle, textAlign: 'right' },
//                 offset: 1,
//               }}
//             >
//               <Input type="number" value={0} onChange={handleBayarChange} />
//             </Form.Item> */}
//             <Form.Item
//               label="kembalian"
//               labelCol={{ style: labelStyle }}
//               wrapperCol={{
//                 style: { ...wrapperStyle, textAlign: 'right' },
//                 offset: 1,
//               }}
//             >
//               <Input
//                 value={kembalianInputValue}
//                 onChange={(e) => {
//                   setKembalianInputValue(e.target.value)
//                   handlePenjualanInputChange('kembalian', e.target.value)
//                 }}
//               />
//             </Form.Item>
//             <Form.Item
//               label="Bank"
//               labelCol={{ style: labelStyle }}
//               wrapperCol={{
//                 style: { ...wrapperStyle, textAlign: 'right' },
//                 offset: 1,
//               }}
//             >
//               <Select
//                 showSearch
//                 optionFilterProp="children"
//                 filterOption={(input, option) =>
//                   option?.children?.toString()
//                     ? option.children
//                         .toString()
//                         .toLowerCase()
//                         .includes(input.toLowerCase())
//                     : false
//                 }
//                 placeholder="Pilih bank"
//                 value={bank?.nama_bank} // Set the selected value to the bank's name
//               >
//                 {banks?.map((bank) => (
//                   <Select.Option key={bank._id} value={bank.nama_bank}>
//                     {bank.nama_bank}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//             <Form.Item
//               wrapperCol={{
//                 style: { ...wrapperStyle, textAlign: 'right' },
//                 offset: 1,
//               }}
//             >
//               <Link to="/penjualan">
//                 <Button
//                   onClick={handlePayment}
//                   type="primary"
//                   disabled={
//                     !isValidInput ||
//                     disableButton ||
//                     inputError ||
//                     !isStockAvailable ||
//                     !isPriceWithinRange // Tambahkan kondisi ini
//                   }
//                 >
//                   Bayar
//                 </Button>
//               </Link>
//             </Form.Item>
//             <div></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DetailPosPage
