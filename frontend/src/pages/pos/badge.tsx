// import React, { useEffect, useState } from 'react'
// import { Badge, Button, Form, Input, Select, Table } from 'antd'

// import { useGetProductsQuery } from '../../hooks/productHooks'
// import { Pos } from '../../types/Pos'
// import { CloseOutlined } from '@ant-design/icons'
// import { useGetStoksQuery } from '../../hooks/stokHooks'
// import { SaveOutlined } from '@ant-design/icons' // import icon save
// import { useAddPosMutation } from '../../hooks/posHooks'
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

// const PosPage: React.FC = () => {
//   const { data: products } = useGetProductsQuery()
//   const { data: multis } = useGetMultisQuery()

//   const [count, setCount] = useState(
//     parseInt(localStorage.getItem('count') || '0', 10)
//   )
//   const [poss, setPoss] = useState<Pos[]>([])
//   const [form] = Form.useForm()
//   const [stokPerProduk, setStokPerProduk] = useState<{ [key: string]: number }>(
//     {}
//   )
//   const generateInvoiceId = (): string => {
//     const uuid = uuidv4()
//     const splitUUID = uuid.split('-')
//     const lastPartOfUUID = splitUUID[splitUUID.length - 1]
//     const invoiceId = `inv${parseInt(lastPartOfUUID, 16)}`
//     return invoiceId
//   }
//   const { data: pelanggans } = useGetPelanggansQuery()
//   const { data: hargas } = useGetHargasQuery()

//   const [selectedPelanganId, setSelectedPelanganId] = useState<string | null>(
//     null
//   )
//   const getIdHargaFromPelangan = (pelangganId: string | null): string => {
//     if (!pelangganId) return ''
//     const selectedPelanggan = pelanggans?.find((p) => p._id === pelangganId)
//     return selectedPelanggan?.id_harga || ''
//   }

//   const addPosMutation = useAddPosMutation()
//   const [currentIdPos, setCurrentIdPos] = useState(generateInvoiceId())

//   const [date, setDate] = useState<Date>(new Date())

//   const addPenjualanMutation = useAddPenjualanMutation()
//   const handleJenisHargaChange = (hargaId: string, posId: string) => {
//     const currentPos = form.getFieldValue(posId)
//     const selectedMulti = multis?.find(
//       (m) =>
//         m.id_data_barang === currentPos.id_data_barang && m.id_harga === hargaId
//     )

//     if (selectedMulti) {
//       form.setFieldsValue({
//         [posId]: {
//           ...currentPos,
//           harga_jual: selectedMulti.harga_tertinggi, //harga_jual tertinggi
//           harga_jual_rendah: selectedMulti.harga_terendah, //harga_jual terendah, tambahan baru
//         },
//       })
//       handleStokOrHargaChange(posId)
//     }
//   }

//   const handleSaveInvoice = () => {
//     const invoiceToSave = {
//       _id: '', // replace with a proper unique id
//       id_pos: currentIdPos, // replace with the pos id
//       total_semua: total_semua.toString(),
//       diskon: diskon.toString(),
//       bayar: bayar.toString(),
//       kembalian: kembalian.toString(),
//       tanggal: moment(date),
//     }
//     addPenjualanMutation.mutate(invoiceToSave)
//   }

//   const handleAdd = () => {
//     const newCount = count + 1
//     setCount(newCount)
//     localStorage.setItem('count', newCount.toString())
//     const tempId = `temp-${newCount}`
//     const newData: Pos = {
//       _id: tempId,
//       id_pos: currentIdPos,
//       id_data_barang: '',
//       id_stok: '1',
//       harga_jual_rendah_pos: '0',
//       total: '0',
//       diskon: '0',
//       tanggal: moment(date),
//     }

//     setPoss((prevPoss) => [...prevPoss, newData])
//     form.setFieldsValue({
//       [newData._id]: {
//         id: '',
//         id_pos: currentIdPos,
//         id_data_barang: '1',
//         id_stok: '1',
//         harga_jual_rendah_pos: '0',
//         total: '0',
//         diskon: '0',
//         tanggal: date, // and here
//       },
//     })
//   }

//   const { data: stoks } = useGetStoksQuery()

//   const handleProductChange = (productId: string, posId: string) => {
//     // Temukan produk berdasarkan ID produk yang diberikan
//     const product = products?.find((p) => p._id === productId)
//     if (!product) return // Jika produk tidak ditemukan, segera keluar dari fungsi

//     // Dapatkan id_harga dari pelanggan yang dipilih
//     const idHargaForSelectedPelangan =
//       getIdHargaFromPelangan(selectedPelanganId)

//     // Cari item multi berdasarkan ID produk dan ID harga dari pelanggan yang dipilih
//     const multiItem = multis?.find(
//       (multi) =>
//         multi.id_data_barang === productId &&
//         multi.id_harga === idHargaForSelectedPelangan
//     )

//     // Tentukan harga tertinggi dan harga terendah untuk ditampilkan
//     const hargaToShow = multiItem
//       ? multiItem.harga_tertinggi
//       : product.harga_jual // gunakan harga dari produk jika tidak ditemukan di multis

//     const hargaTerendahToShow = multiItem
//       ? multiItem.harga_terendah
//       : product.harga_jual // gunakan harga dari produk jika tidak ditemukan di multis

//     // Set nilai form dengan harga tertinggi dan harga terendah yang baru
//     form.setFieldsValue({
//       [posId]: {
//         ...form.getFieldValue(posId),
//         id_data_barang: product._id,
//         harga_jual: hargaToShow,
//         harga_jual_rendah: hargaTerendahToShow,
//       },
//     })

//     const relatedStok = stoks?.find((s) => s.id_data_barang === productId)
//     const stokCount = relatedStok ? parseInt(relatedStok.jumlah_stok) : 0
//     setStokPerProduk((prevState) => ({ ...prevState, [posId]: stokCount }))
//     handleStokOrHargaChange(posId)
//   }

//   const handleStokOrHargaChange = (posId: string) => {
//     const currentFields = form.getFieldValue(posId)
//     if (currentFields) {
//       const { id_stok, harga_jual, diskon } = currentFields
//       const total = parseInt(id_stok) * parseInt(harga_jual) - parseInt(diskon)
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
//     setPoss((prevPoss) => prevPoss.filter((pos) => pos._id !== id))
//   }

//   const [total_semua, setTotalSemua] = useState(0)

//   const [diskon, setDiskon] = useState(0)
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
//       // take the value from the form instead
//       const posToSave = form.getFieldValue(pos._id)
//       // don't include the temporary _id
//       const { _id, ...posDataToSave } = posToSave
//       // only add new pos, do not update existing ones
//       addPosMutation.mutate(posDataToSave)
//     })

//     // generate a new invoice ID
//     const newInvoiceId = generateInvoiceId()
//     // set currentIdPos with the new invoice ID
//     setCurrentIdPos(newInvoiceId)
//   }

//   const columns = [
//     {
//       title: 'ID POS',
//       dataIndex: 'id_pos',
//       render: (text: string, record: Pos) => (
//         <Form.Item
//           name={[record._id, 'id_pos']}
//           rules={[
//             {
//               required: true,
//               message: `Please input ID POS!`,
//             },
//           ]}
//         >
//           <Input disabled />
//         </Form.Item>
//       ),
//     },
//     {
//       title: 'Nama Barang',
//       dataIndex: 'id_data_barang',
//       render: (text: string, record: Pos) => {
//         const stokCount = stokPerProduk[record._id] || 0
//         const currentFields = form.getFieldValue(record._id)
//         const hargaJual = currentFields?.harga_jual || '0'
//         const hargaJualTerendah = currentFields?.harga_jual_rendah || '0'

//         return (
//           <Form.Item
//             name={[record._id, 'id_data_barang']}
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
//               >
//                 {products?.map((product) => (
//                   <Select.Option key={product._id} value={product._id}>
//                     {product.nama_barang}
//                   </Select.Option>
//                 ))}
//               </Select>

//               <Badge
//                 style={{
//                   backgroundColor: '#f50',
//                   position: 'absolute',
//                   right: '-10px',
//                   bottom: '30px', // Ubah dari -40px menjadi -10px
//                 }}
//                 count={`Harga: ${hargaJualTerendah} - ${hargaJual}`}
//               />
//             </div>
//           </Form.Item>
//         )
//       },
//     },

//     {
//       title: 'Jumlah',
//       dataIndex: 'id_stok',
//       render: (text: string, record: Pos) => (
//         <Form.Item
//           name={[record._id, 'id_stok']}
//           rules={[
//             {
//               required: true,
//               message: `Please input Stok!`,
//             },
//             ({ getFieldValue }) => ({
//               validator(_, value) {
//                 const jumlahInput = parseInt(value, 10)
//                 const stokCount = stokPerProduk[record._id] || 0
//                 if (isNaN(jumlahInput) || jumlahInput <= stokCount) {
//                   return Promise.resolve()
//                 }
//                 return Promise.reject(new Error('Input melebihi jumlah stok!'))
//               },
//             }),
//           ]}
//         >
//           <Input onChange={() => handleStokOrHargaChange(record._id)} />
//         </Form.Item>
//       ),
//     },
//     // {
//     //   title: 'Harga Jual Terendah',
//     //   dataIndex: 'harga_jual_rendah',
//     //   render: (text: string, record: Pos) => (
//     //     <Form.Item
//     //       name={[record._id, 'harga_jual_rendah']}
//     //       rules={[
//     //         {
//     //           required: true,
//     //           message: `Please input Harga Jual Terendah!`,
//     //         },
//     //       ]}
//     //     >
//     //       <Input onChange={() => handleStokOrHargaChange(record._id)} />
//     //     </Form.Item>
//     //   ),
//     // },

//     {
//       title: 'Harga Jual',
//       dataIndex: 'harga_jual',
//       render: (text: string, record: Pos) => (
//         <>
//           <Form.Item
//             name={[record._id, 'harga_jual']}
//             rules={[
//               {
//                 required: true,
//                 message: `Please input Harga Jual!`,
//               },
//             ]}
//           >
//             <Input onChange={() => handleStokOrHargaChange(record._id)} />
//           </Form.Item>
//           <Form.Item style={{ marginTop: '5px' }}>
//             <Select
//               size="small"
//               style={{ width: '100%' }}
//               onChange={(value) =>
//                 handleJenisHargaChange(value as string, record._id)
//               }
//             >
//               {hargas?.map((harga: Harga) => (
//                 <Select.Option key={harga._id} value={harga._id}>
//                   {harga.jenis_harga}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>
//         </>
//       ),
//     },

//     {
//       title: 'Diskon',
//       dataIndex: 'diskon',
//       render: (text: string, record: Pos) => (
//         <Form.Item
//           name={[record._id, 'diskon']}
//           rules={[
//             {
//               required: true,
//               message: `Please input Diskon!`,
//             },
//           ]}
//         >
//           <Input onChange={() => handleStokOrHargaChange(record._id)} />
//         </Form.Item>
//       ),
//     },

//     {
//       title: 'Total',
//       dataIndex: 'total',
//       render: (text: string, record: Pos) => (
//         <Form.Item
//           name={[record._id, 'total']}
//           rules={[
//             {
//               required: true,
//               message: `Please input Total!`,
//             },
//           ]}
//         >
//           <Input
//             disabled
//             suffix={<CloseOutlined onClick={() => handleRemove(record._id)} />}
//           />
//         </Form.Item>
//       ),
//     },
//   ]

//   return (
//     <div>
//       <Iqra date={date} onChange={setDate} />

//       <Form.Item>
//         <Select
//           value={selectedPelanganId}
//           onChange={(value) => setSelectedPelanganId(value)}
//           showSearch
//           optionFilterProp="children"
//           filterOption={(input, option) =>
//             option?.children
//               ? option.children
//                   .toString()
//                   .toLowerCase()
//                   .includes(input.toLowerCase())
//               : false
//           }
//           style={{ marginRight: '10px', width: '320px' }}
//         >
//           {pelanggans?.map((pelanggan: Pelanggan) => (
//             <Select.Option key={pelanggan._id} value={pelanggan._id}>
//               {pelanggan.nama_pelanggan}
//             </Select.Option>
//           ))}
//         </Select>
//       </Form.Item>

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
//       <Button onClick={handleSave} type="primary" style={{ marginTop: 16 }}>
//         <SaveOutlined /> Save
//       </Button>
//       <div>Total Semua: {total_semua}</div>
//       <Form.Item label="Potongan/invoice">
//         <Input type="number" value={diskon} onChange={handleDiskonChange} />
//       </Form.Item>
//       <Form.Item label="Bayar">
//         <Input type="number" value={bayar} onChange={handleBayarChange} />
//       </Form.Item>
//       <div>Kembalian: {kembalian}</div>
//       <Button
//         onClick={handleSaveInvoice}
//         type="primary"
//         style={{ marginTop: 16 }}
//       >
//         Bayar
//       </Button>
//     </div>
//   )
// }

// export default PosPage
