// import React, { useEffect, useState } from 'react'
// import {
//   Badge,
//   Button,
//   Col,
//   Divider,
//   Form,
//   Input,
//   message,
//   Select,
//   Table,
// } from 'antd'
// import { useGetProductsQuery } from '../../hooks/productHooks'
// import { Pos } from '../../types/Pos'
// import { CloseOutlined } from '@ant-design/icons'
// import { useGetStoksQuery, useUpdateStokMutation } from '../../hooks/stokHooks'
// import { SaveOutlined } from '@ant-design/icons' // import icon save
// import { useAddPosMutation, useGetPosByIdQuery } from '../../hooks/posHooks'
// import { v4 as uuidv4 } from 'uuid'
// import Iqra from '../Iqra'
// import moment from 'moment'
// import { useAddPenjualanMutation } from '../../hooks/penjualanHooks'
// import { Pelanggan } from '../../types/Pelanggan'
// import { useGetPelanggansQuery } from '../../hooks/pelangganHooks'
// import { useGetMultisQuery } from '../../hooks/multiHooks'
// import { Harga } from '../../types/Harga'
// import { useGetHargasQuery } from '../../hooks/hargaHooks'
// import { Multi } from '../../types/Multi'
// import { useGetBanksQuery } from '../../hooks/bankHooks'
// import { Bank } from '../../types/Bank'
// import { Link, useParams } from 'react-router-dom'
// import { AiOutlinePlus } from 'react-icons/ai'
// import DateRange from '../DateRange'

// const PosDetailPage: React.FC = () => {
//   const { data: hargas } = useGetHargasQuery()
//   const { data: products } = useGetProductsQuery()
//   const { data: multis } = useGetMultisQuery()
//   const [hasError, setHasError] = useState(false)

//   const [hargaBadge, setHargaBadge] = useState<{
//     [key: string]: { tinggi: string; rendah: string }
//   }>({})

//   const [count, setCount] = useState(
//     parseInt(localStorage.getItem('count') || '0', 10)
//   )

//   const { data: banks } = useGetBanksQuery()

//   const [poss, setPoss] = useState<Pos[]>([])
//   const [form] = Form.useForm()

//   const { data: stoks } = useGetStoksQuery()
//   const [stokPerProduk, setStokPerProduk] = useState<{ [key: string]: number }>(
//     {}
//   )
//   const [selectedDates, setSelectedDates] = useState<[string, string] | null>(
//     null
//   )
//   const handleDateRangeChange = (dates: [string, string] | null) => {
//     setSelectedDates(dates)
//   }

//   const generateInvoiceId = (): string => {
//     const uuid = uuidv4()
//     const splitUUID = uuid.split('-')
//     const lastPartOfUUID = splitUUID[splitUUID.length - 1]
//     const invoiceId = `INV${parseInt(lastPartOfUUID, 16)}`
//     return invoiceId
//   }

//   const { data: pelanggans } = useGetPelanggansQuery()
//   const [selectedPelanganId, setSelectedPelanganId] = useState<string | null>(
//     null
//   )
//   const getIdHargaFromPelangan = (
//     pelangganIdCumeLeqTe: string | null
//   ): string => {
//     if (!pelangganIdCumeLeqTe) return ''
//     const pelangganTakenOnlyHere = pelanggans?.find(
//       (p) => p._id === pelangganIdCumeLeqTe
//     )
//     return pelangganTakenOnlyHere?.id_harga || ''
//   }

//   const addPosMutation = useAddPosMutation()
//   const [currentIdPos, setCurrentIdPos] = useState(generateInvoiceId())
//   const [date, setDate] = useState<Date>(new Date())
//   const addPenjualanMutation = useAddPenjualanMutation()
//   const updateStokMutation = useUpdateStokMutation()

//   const [selectedIdHarga, setSelectedIdHarga] = useState<string | null>(null)
//   const handleQtyChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     posId: string
//   ) => {
//     const newValue = parseInt(e.target.value, 10) || 0

//     setPoss((prevPoss) => {
//       return prevPoss.map((pos) => {
//         if (pos._id === posId) {
//           return {
//             ...pos,
//             qty_sold: newValue,
//           }
//         }
//         return pos
//       })
//     })

//     calculation(posId)
//   }

//   const handleJenisHargaChange = (hargaId: string, posId: string) => {
//     setSelectedIdHarga(hargaId)

//     const currentPos = form.getFieldValue(posId)
//     const selectedMulti = multis?.find(
//       (m) =>
//         m.id_data_barang === currentPos.id_data_barang && m.id_harga === hargaId
//     )
//     if (selectedMulti) {
//       form.setFieldsValue({
//         [posId]: {
//           ...currentPos,
//           harga_jual: selectedMulti.harga_tertinggi,
//           harga_jual_rendah: selectedMulti.harga_terendah,
//           id_harga: hargaId,
//         },
//       })
//       setHargaBadge((prevState) => ({
//         ...prevState,
//         [posId]: {
//           tinggi: selectedMulti.harga_tertinggi.toString(),
//           rendah: selectedMulti.harga_terendah.toString(),
//         },
//       }))
//       calculation(posId)
//     }
//   }
//   const handleSaveInvoice = () => {
//     const allValid = poss.every((pos) => !!pos.id_data_barang)
//     if (!allValid) {
//       message.error('Pastikan semua barang telah dipilih.')
//       return
//     }

//     const isValid = poss.every((pos) => pos.id_data_barang !== '')
//     if (!isValid) {
//       message.error(
//         'Ada item yang belum memiliki barang yang dipilih. Silahkan pilih barang terlebih dahulu.'
//       )
//       return
//     }

//     handleSave()
//     const piutangValue = isPiutang() ? total_semua - bayar : 0

//     const invoiceToSave = {
//       _id: '',
//       id_pos: currentIdPos,
//       total_semua: total_semua.toString(),
//       diskon: diskon.toString(),
//       bayar: bayar.toString(),
//       kembalian: kembalian.toString(),
//       tanggal_mulai: selectedDates ? selectedDates[0] : null,
//       tanggal_akhir: selectedDates ? selectedDates[1] : null,
//       via: via ? via.toString() : '',
//       piutang: piutangValue.toString(),
//       id_pelanggan: selectedPelanganId || undefined,
//     }

//     addPenjualanMutation.mutate(invoiceToSave)
//     poss.forEach((pos) => {
//       const currentStok = stoks?.find(
//         (stok) => stok.id_data_barang === pos.id_data_barang
//       )
//       if (currentStok) {
//         const updatedStokValue = currentStok.jumlah_stok - pos.qty_sold
//         const updatedStok = {
//           ...currentStok,
//           jumlah_stok: updatedStokValue,
//         }
//         updateStokMutation.mutate(updatedStok)
//       } else if (pos.id_data_barang === '') {
//       } else {
//       }
//     })
//   }

//   const handleAdd = () => {
//     const newCount = count + 1
//     setCount(newCount)
//     localStorage.setItem('count', newCount.toString())
//     const tempId = `temp-${newCount}`

//     const idHargaToUse =
//       selectedIdHarga || getIdHargaFromPelangan(selectedPelanganId) || '0'

//     const newData: Pos = {
//       _id: tempId,
//       id_pos: currentIdPos,
//       id_data_barang: '',
//       harga_jual: '0',
//       total: '0',
//       diskon: '0',
//       id_harga: idHargaToUse,
//       qty_sold: 1,
//     }

//     setPoss((prevPoss) => [...prevPoss, newData])
//     form.setFieldsValue({
//       [newData._id]: {
//         id: '',
//         id_pos: currentIdPos,
//         id_data_barang: '',
//         qty_sold: '1',
//         harga_jual: '0',
//         total: '0',
//         diskon: '0',
//         tanggal: date,
//         via: '0',
//         id_pelanggan: '0',
//       },
//     })
//   }

//   const handleProductChange = (productId: string, posId: string) => {
//     const product = products?.find((p) => p._id === productId)
//     if (!product) return

//     const idHargaForSelectedPelangan =
//       getIdHargaFromPelangan(selectedPelanganId)

//     const multiItem = multis?.find(
//       (multi) =>
//         multi.id_data_barang === productId &&
//         multi.id_harga === idHargaForSelectedPelangan
//     )

//     const hargaToShow = multiItem
//       ? multiItem.harga_tertinggi
//       : product.harga_jual
//     const hargaTerendahToShow = multiItem
//       ? multiItem.harga_terendah
//       : product.harga_jual
//     setHargaBadge((prevState) => ({
//       ...prevState,
//       [posId]: {
//         tinggi: hargaToShow.toString(),
//         rendah: hargaTerendahToShow.toString(),
//       },
//     }))

//     form.setFieldsValue({
//       [posId]: {
//         ...form.getFieldValue(posId),
//         id_data_barang: product._id,
//         harga_jual: hargaToShow,
//         harga_jual_rendah: hargaTerendahToShow,
//       },
//     })

//     const relatedStok = stoks?.find((s) => s.id_data_barang === productId)
//     const stokCount = relatedStok ? relatedStok.jumlah_stok : 0

//     setStokPerProduk((prevState) => ({ ...prevState, [posId]: stokCount }))

//     setPoss((prevPoss) => {
//       return prevPoss.map((pos) => {
//         if (pos._id === posId) {
//           return {
//             ...pos,
//             id_data_barang: product._id,
//           }
//         }
//         return pos
//       })
//     })

//     calculation(posId)
//   }

//   const calculation = (posId: string) => {
//     const currentFields = form.getFieldValue(posId)
//     if (currentFields) {
//       const { qty_sold, harga_jual, diskon } = currentFields
//       const total = parseInt(qty_sold) * parseInt(harga_jual) - parseInt(diskon)
//       form.setFieldsValue({
//         [posId]: {
//           ...currentFields,
//           total: total.toString(),
//         },
//       })
//       hitungTotalSemua()
//     }
//   }

//   const handleRemove = (id: string) => {
//     setPoss((prevPoss) => prevPoss.filter((jos) => jos._id !== id))
//   }

//   const [total_semua, setTotalSemua] = useState(0)

//   const [diskon, setDiskon] = useState(0)

//   const [via, setVia] = useState('0')

//   const handleDiskonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setDiskon(parseInt(e.target.value, 10) || 0)
//   }
//   useEffect(() => {
//     hitungTotalSemua()
//   }, [diskon])

//   const [bayar, setBayar] = useState(0)
//   const handleBayarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setBayar(parseInt(e.target.value, 10) || 0)
//   }

//   const [kembalian, setKembalian] = useState(0)
//   useEffect(() => {
//     setKembalian(bayar - total_semua)
//   }, [bayar, total_semua])

//   const hitungTotalSemua = () => {
//     let total = poss.reduce((sum, pos) => {
//       const nilaiTotalPos = form.getFieldValue(pos._id)?.total || '0'
//       return sum + parseInt(nilaiTotalPos, 10)
//     }, 0)
//     total = total - diskon
//     setTotalSemua(total)
//   }

//   const handleSave = () => {
//     poss.forEach((pos) => {
//       const posToSave = form.getFieldValue(pos._id)
//       if (!posToSave.id_harga || posToSave.id_harga === '') {
//         posToSave.id_harga = '0'
//       }
//       const { _id, ...posDataToSave } = posToSave
//       addPosMutation.mutate(posDataToSave)
//     })
//   }

//   const [selectedBank, setSelectedBank] = useState<string | null>(null)

//   const isPiutang = (): boolean => {
//     return total_semua > bayar
//   }

//   const { id_pos } = useParams<{ id_pos: string }>()

//   if (!id_pos) {
//     return <p>Id Pos tidak ditemukan</p>
//   }

//   const { data: posDetail, isLoading } = useGetPosByIdQuery(id_pos)

//   if (posDetail) {
//   }

//   useEffect(() => {
//     if (posDetail) {
//       if (Array.isArray(posDetail)) {
//         setPoss(posDetail)
//       } else {
//         setPoss([posDetail])
//       }
//     }
//   }, [posDetail])

//   const columns = [
//     {
//       title: 'No',
//       key: 'index',
//       align: 'center' as 'center',
//       fixed: true,
//       width: '5%',
//       render: (_: any, __: any, index: number) => index + 1,
//     },

//     {
//       title: 'Nama Barang',
//       dataIndex: 'id_data_barang',
//       render: (text: string, record: Pos) => {
//         const stokCount = stokPerProduk[record._id] || 0
//         const currentFields = form.getFieldValue(record._id)
//         const hargaJual = currentFields?.harga_jual || '0'
//         const hargaJualTerendah = currentFields?.harga_jual_rendah || '0'

//         // Inisialisasi nilai awal berdasarkan posDetail atau text.
//         const initialValue = posDetail?.id_data_barang || text

//         return (
//           <Form.Item
//             name={[record._id, 'id_data_barang']}
//             initialValue={initialValue} // <-- Ini perubahan yang dilakukan
//             rules={[
//               {
//                 required: true,
//                 message: `Please input Nama Barang!`,
//               },
//             ]}
//           >
//             <div style={{ position: 'relative' }}>
//               <Badge
//                 count={stokCount}
//                 style={{
//                   backgroundColor: stokCount <= 10 ? 'red' : 'green',
//                   position: 'absolute',
//                   right: '-10px',
//                   top: '-35px',
//                 }}
//                 overflowCount={999}
//               />

//               <Select
//                 showSearch
//                 style={{ width: '100%' }}
//                 optionFilterProp="children"
//                 filterOption={(input, option) =>
//                   option?.children?.toString()
//                     ? option.children
//                         .toString()
//                         .toLowerCase()
//                         .includes(input.toLowerCase())
//                     : false
//                 }
//                 onChange={(value) =>
//                   handleProductChange(value as string, record._id)
//                 }
//                 // Inisialisasi nilai awal untuk komponen Select
//                 value={initialValue}
//               >
//                 {products?.map((product) => (
//                   <Select.Option key={product._id} value={product._id}>
//                     {product.nama_barang}
//                   </Select.Option>
//                 ))}
//               </Select>

//               {hargaBadge[record._id] && (
//                 <Badge
//                   style={{
//                     backgroundColor: '#f50',
//                     position: 'absolute',
//                     right: '-10px',
//                     bottom: '30px',
//                   }}
//                   count={`Harga: ${hargaBadge[record._id]?.rendah} - ${
//                     hargaBadge[record._id]?.tinggi
//                   }`}
//                 />
//               )}
//             </div>
//           </Form.Item>
//         )
//       },
//     },

//     {
//       title: 'Qty',
//       dataIndex: 'qty_sold',
//       render: (text: string, record: Pos) => {
//         const qtyToDisplay = text || posDetail?.qty_sold?.toString() || '0'

//         return (
//           <Form.Item
//             name={[record._id, 'qty_sold']}
//             initialValue={qtyToDisplay}
//             rules={[
//               {
//                 required: true,
//                 message: `Masukkan Qty!`,
//               },
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   const qtyInput = parseInt(value, 10)
//                   const stokCount = stokPerProduk[record._id] || 0

//                   if (isNaN(qtyInput) || qtyInput <= stokCount) {
//                     setHasError(false)
//                     return Promise.resolve()
//                   }

//                   setHasError(true)
//                   return Promise.reject(
//                     new Error('Order melebihi jumlah stok!')
//                   )
//                 },
//               }),
//             ]}
//           >
//             <Input onChange={(e) => handleQtyChange(e, record._id)} />
//           </Form.Item>
//         )
//       },
//     },

//     {
//       title: 'Harga Jual',
//       dataIndex: 'harga_jual',
//       render: (text: string, record: Pos) => {
//         const hargaToDisplay = text || posDetail?.harga_jual || '0'
//         const jenisHargaToDisplay = record.id_harga // Perbaikan di sini

//         return (
//           <>
//             <Form.Item
//               name={[record._id, 'harga_jual']}
//               initialValue={hargaToDisplay}
//               rules={[
//                 {
//                   required: true,
//                   message: `Please input Harga Jual!`,
//                 },
//                 // Validasi kustom
//                 ({ getFieldValue }) => ({
//                   validator(_, value) {
//                     const hargaInput = parseInt(value, 10)
//                     const hargaTinggi = parseInt(
//                       hargaBadge[record._id]?.tinggi || '0'
//                     )
//                     const hargaRendah = parseInt(
//                       hargaBadge[record._id]?.rendah || '0'
//                     )
//                     if (
//                       hargaInput >= hargaRendah &&
//                       hargaInput <= hargaTinggi
//                     ) {
//                       return Promise.resolve()
//                     }
//                     return Promise.reject(
//                       new Error(
//                         `Harga harus antara ${hargaRendah} dan ${hargaTinggi}!`
//                       )
//                     )
//                   },
//                 }),
//               ]}
//             >
//               <Input onChange={() => calculation(record._id)} />
//             </Form.Item>
//             <Form.Item
//               style={{ marginTop: '5px' }}
//               name={[record._id, 'id_harga']}
//               initialValue={jenisHargaToDisplay}
//             >
//               <Select
//                 size="small"
//                 style={{ width: '100%' }}
//                 onChange={(value) =>
//                   handleJenisHargaChange(value as string, record._id)
//                 }
//               >
//                 {hargas?.map((harga: Harga) => (
//                   <Select.Option key={harga._id} value={harga._id}>
//                     {harga.jenis_harga}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </>
//         )
//       },
//     },

//     {
//       title: 'Diskon',
//       dataIndex: 'diskon',
//       render: (text: string, record: Pos) => {
//         const diskonToDisplay = text || posDetail?.diskon || '0'

//         return (
//           <Form.Item
//             name={[record._id, 'diskon']}
//             initialValue={diskonToDisplay}
//             rules={[
//               {
//                 required: true,
//                 message: `Please input Diskon!`,
//               },
//             ]}
//           >
//             <Input onChange={() => calculation(record._id)} />
//           </Form.Item>
//         )
//       },
//     },

//     {
//       title: 'Jumlah',
//       dataIndex: 'total',
//       render: (text: string, record: Pos) => {
//         const totalToDisplay = text || posDetail?.total || '0'

//         return (
//           <Form.Item
//             name={[record._id, 'total']}
//             initialValue={totalToDisplay}
//             rules={[
//               {
//                 required: true,
//                 message: `Please input Jumlah!`,
//               },
//             ]}
//           >
//             <Input
//               disabled
//               suffix={
//                 <CloseOutlined onClick={() => handleRemove(record._id)} />
//               }
//             />
//           </Form.Item>
//         )
//       },
//     },
//   ]

//   return (
//     <div>
//       <div style={{ fontSize: '12px', position: 'static' }}>{currentIdPos}</div>
//       <div style={{ fontSize: '12px', position: 'static' }}>
//         Harga Jual: {posDetail?.harga_jual}
//       </div>

//       <Form>
//         <Form.Item>
//           <Select
//             size="small"
//             value={selectedPelanganId || posDetail?.id_harga || undefined} // <-- Inisialisasi nilai awal berdasarkan posDetail
//             onChange={(value) => setSelectedPelanganId(value)}
//             showSearch
//             optionFilterProp="children"
//             filterOption={(input, option) =>
//               option?.children
//                 ? option.children
//                     .toString()
//                     .toLowerCase()
//                     .includes(input.toLowerCase())
//                 : false
//             }
//             style={{ marginRight: '10px', width: '285px' }}
//             dropdownRender={(menu) => (
//               <div>
//                 {menu}
//                 <Divider style={{ margin: '4px 0' }} />
//                 <Col span={4} style={{ padding: '8px', textAlign: 'center' }}>
//                   <Link to="/form-pelanggan">
//                     <Button
//                       icon={<AiOutlinePlus />}
//                       style={{
//                         background: 'transparent',
//                       }}
//                     />
//                   </Link>
//                 </Col>
//               </div>
//             )}
//           >
//             {pelanggans?.map((pelanggan: Pelanggan) => (
//               <Select.Option key={pelanggan._id} value={pelanggan._id}>
//                 {pelanggan.nama_pelanggan}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item>
//           <DateRange onChange={handleDateRangeChange} />
//         </Form.Item>
//       </Form>

//       <Form form={form}>
//         <Table
//           dataSource={poss}
//           columns={columns}
//           rowKey={(record) => record._id}
//           pagination={false}
//           rowClassName={() => 'row-style'}
//         />
//       </Form>
//       <Button onClick={handleAdd} type="primary" style={{ marginTop: 16 }}>
//         + item
//       </Button>
//       <div>Total Semua: {total_semua}</div>
//       <Form>
//         <Form.Item label="Potongan/invoice">
//           <Input type="number" value={diskon} onChange={handleDiskonChange} />
//         </Form.Item>
//         <Form.Item label="Bayar">
//           <Input type="number" value={bayar} onChange={handleBayarChange} />
//         </Form.Item>
//         <Form.Item
//           name="via"
//           rules={[
//             {
//               required: true,
//               validator: (_, value) => {
//                 if (!value || value === '0') {
//                   return Promise.reject(new Error('Harap pilih bank!'))
//                 }
//                 return Promise.resolve()
//               },
//             },
//           ]}
//         >
//           <Select
//             showSearch
//             optionFilterProp="children"
//             value={via}
//             onChange={(value) => {
//               setSelectedBank(value)
//               setVia(value)
//             }}
//             filterOption={(input, option) =>
//               option?.children
//                 ? option.children
//                     .toString()
//                     .toLowerCase()
//                     .includes(input.toLowerCase())
//                 : false
//             }
//             placeholder="Pilih bank"
//           >
//             {banks?.map((bank: Bank) => (
//               <Select.Option key={bank._id} value={bank._id}>
//                 {bank.nama_bank}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>
//       </Form>

//       <div>Kembalian: {kembalian}</div>
//       <div>
//         {isPiutang() && (
//           <span style={{ color: 'red' }}>
//             Ada Piutang: {total_semua - bayar}
//           </span>
//         )}
//       </div>

//       <Link to="/penjualan">
//         <Button
//           onClick={handleSaveInvoice}
//           type="primary"
//           style={{ marginTop: 16 }}
//           disabled={!selectedBank || hasError}
//         >
//           <AiOutlinePlus> Tambah Pembayaran </AiOutlinePlus>
//         </Button>
//       </Link>
//     </div>
//   )
// }

// export default PosDetailPage
