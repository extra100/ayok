// import { useParams } from 'react-router-dom'
// import { Badge, Button, Form, Input, Select, Table } from 'antd'
// import { useGetPosDetailQuery, useUpdatePosMutation } from '../hooks/posHooks'
// import { useGetPenjualanByIdQuery } from '../hooks/penjualanHooks'
// import { useState } from 'react'
// import { useGetProductsQuery } from '../hooks/productHooks'
// import { Option } from 'antd/es/mentions'
// import { useGetMultisQuery } from '../hooks/multiHooks'
// import { useGetPelanggansQuery } from '../hooks/pelangganHooks'
// import PelangganPage from './pelanggan/PelangganPage'
// import { useGetHargasQuery } from '../hooks/hargaHooks'
// import { useGetStoksQuery } from '../hooks/stokHooks'
// import { Stok } from '../types/Stok'
// import { Pos } from '../types/Pos'

// const DetailPosPage: React.FC = () => {
//   const { id_pos } = useParams<{ id_pos?: string }>()
//   const { data: getPosDetail } = useGetPosDetailQuery(id_pos as string)
//   const { data: multis } = useGetMultisQuery()
//   const { data: hargas } = useGetHargasQuery()
//   const stokData = useGetStoksQuery()

//   const { data: penjualanData } = useGetPenjualanByIdQuery(id_pos as string)
//   const inv = penjualanData?.[0]?.inv || '0'
//   const idPelanggan = penjualanData?.[0]?.id_pelanggan || '0'
//   const total = penjualanData?.[0]?.total_semua || '0'

//   const { data: pelanggans } = useGetPelanggansQuery()
//   const namaPelanggan = penjualanData?.[0]?.id_pelanggan || '0'
//   const selectedPelanggan = pelanggans?.find((p) => p._id === namaPelanggan)
//   const defaultNamaPelanggan =
//     selectedPelanggan?.nama_pelanggan || 'Unknown Pelanggan'

//   const [isEditing, setIsEditing] = useState(false)
//   const [editedData, setEditedData] = useState<any[]>([])

//   const handleInputChange = (recordKey: string, field: string, value: any) => {
//     const newData = [...(editedData || [])]
//     const itemIndex = newData.findIndex((item) => item._id === recordKey)

//     if (itemIndex !== -1) {
//       newData[itemIndex][field] = value

//       // Jika qty_sold, harga_jual, atau diskon berubah, hitung ulang total
//       if (
//         field === 'qty_sold' ||
//         field === 'harga_jual' ||
//         field === 'diskon'
//       ) {
//         newData[itemIndex].total =
//           newData[itemIndex].qty_sold * newData[itemIndex].harga_jual -
//           newData[itemIndex].diskon
//       }

//       // ... (kode lain yang ada di fungsi Anda)
//       setEditedData(newData)
//     }
//   }

//   const toggleEditing = () => {
//     if (!isEditing) {
//       setEditedData(getPosDetail || [])
//     }
//     setIsEditing((prev) => !prev)
//   }

//   const updatePosMutation = useUpdatePosMutation()
//   const saveChanges = () => {
//     editedData.forEach(async (item) => {
//       console.log('Data being sent:', item) // Tambahkan baris ini
//       await updatePosMutation.mutateAsync(item)
//     })
//   }

//   const { data: products } = useGetProductsQuery()

//   const isQtyExceedingStok = (itemId: string, qtySold: number): boolean => {
//     if (!stokData) return false

//     const correspondingStok: Stok | undefined = stokData.data?.find(
//       (stok: Stok) => stok.id_data_barang === itemId
//     )

//     const existingQty: number =
//       getPosDetail?.find((detail: Pos) => detail._id === itemId)?.qty_sold || 0

//     if (correspondingStok) {
//       if (correspondingStok.jumlah_stok <= 0) return true

//       if (existingQty + correspondingStok.jumlah_stok < qtySold) {
//         return true
//       }
//     }
//     return false
//   }

//   const isAnyItemExceedingStok = (): boolean => {
//     if (!stokData || !editedData) return false
//     for (let item of editedData) {
//       if (isQtyExceedingStok(item.id_data_barang, Number(item.qty_sold))) {
//         return true
//       }
//     }
//     return false
//   }

//   const isStockDepleted = (itemId: string): boolean => {
//     const stokKoosong: Stok | undefined = stokData.data?.find(
//       (stok: Stok) => stok.id_data_barang === itemId
//     )
//     if (stokKoosong && stokKoosong.jumlah_stok <= 0) return true
//     return false
//   }
//   const [isHargaOutOfRange, setHargaOutOfRange] = useState(false)

//   const columns = [
//     {
//       title: 'Nama Barang',
//       dataIndex: 'id_data_barang',
//       key: 'id_data_barang',
//       render: (id_data_barang: string, record: any) => {
//         const barang = products?.find((z) => z._id === id_data_barang)

//         const stokItem = stokData?.data?.find(
//           (s) => s.id_data_barang === id_data_barang
//         )
//         const stokCount = stokItem?.jumlah_stok || 0

//         return (
//           <div style={{ position: 'relative' }}>
//             {isEditing && (
//               <Badge
//                 count={stokCount}
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

//             {isEditing ? (
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
//                 }}
//               >
//                 {products?.map((product) => (
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
//         const blockInput = isStockDepleted(record.id_data_barang)
//         const exceedStock = isQtyExceedingStok(
//           record.id_data_barang,
//           Number(record.qty_sold)
//         )

//         let warningText = ''
//         if (blockInput) {
//           warningText = 'Stok Kosong'
//         } else if (exceedStock) {
//           warningText = 'Stok Tidak Mencukupi'
//         }

//         return (
//           <div style={{ position: 'relative' }}>
//             {isEditing ? (
//               <>
//                 <input
//                   defaultValue={text}
//                   onChange={(e) => {
//                     handleInputChange(record._id, 'qty_sold', e.target.value)
//                   }}
//                   readOnly={blockInput}
//                   style={
//                     blockInput || exceedStock
//                       ? { backgroundColor: '#FAFAFA', border: '1px solid red' }
//                       : {}
//                   }
//                 />
//                 {warningText && (
//                   <span
//                     style={{
//                       color: 'red',
//                       position: 'absolute',
//                       bottom: '-20px',
//                       left: '0',
//                       fontSize: '9px',
//                     }}
//                   >
//                     {warningText}
//                   </span>
//                 )}
//               </>
//             ) : (
//               `Rp. ${text}`
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
//         const multiItem = multis?.find(
//           (s) =>
//             s.id_data_barang === record.id_data_barang &&
//             s.id_harga === record.id_harga
//         )

//         const hargaTerendah = multiItem ? Number(multiItem.harga_terendah) : 0
//         const hargaTertinggiNumber = multiItem
//           ? Number(multiItem.harga_tertinggi)
//           : 0
//         const hargaRange = `${hargaTerendah} - ${hargaTertinggiNumber}`

//         let warningText = ''
//         const hargaInput = Number(text)

//         if (hargaInput < hargaTerendah || hargaInput > hargaTertinggiNumber) {
//           warningText = `Harga di luar rentang: ${hargaRange}`
//           setHargaOutOfRange(true)
//         } else {
//           setHargaOutOfRange(false)
//         }

//         return (
//           <div style={{ position: 'relative' }}>
//             {isEditing ? (
//               <>
//                 <Input
//                   value={text || hargaTertinggiNumber.toString()}
//                   onChange={(e) => {
//                     const newHargaInput = Number(e.target.value)
//                     handleInputChange(record._id, 'harga_jual', newHargaInput)
//                   }}
//                 />
//                 {warningText && (
//                   <span
//                     style={{
//                       color: 'red',
//                       position: 'absolute',
//                       bottom: '-20px',
//                       left: '0',
//                       fontSize: '9px',
//                     }}
//                   >
//                     {warningText}
//                   </span>
//                 )}
//               </>
//             ) : (
//               text
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
//         const harga = hargas?.find((z) => z._id === id_harga)
//         const multiItem = multis?.find(
//           (s) =>
//             s.id_data_barang === record.id_data_barang &&
//             s.id_harga === record.id_harga
//         )
//         const hargaRange = multiItem
//           ? `${multiItem.harga_terendah} - ${multiItem.harga_tertinggi}`
//           : '0 - 0'

//         return isEditing ? (
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
//                 {hargas?.map((product) => (
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
//             {isEditing ? (
//               <>
//                 <Input
//                   value={totalPerItem}
//                   onChange={(e) =>
//                     handleInputChange(record._id, 'total', e.target.value)
//                   }
//                 />

//                 {/* <DeleteOutlined
//                   onClick={() => handleDelete(record._id)}
//                   style={{ marginBottom: 5, color: 'red', marginLeft: '10px' }} // tambahkan marginLeft untuk memberi jarak
//                 /> */}
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
//       <Button onClick={toggleEditing}>
//         {isEditing ? 'Selesai Editing' : 'Edit Table'}{' '}
//       </Button>
//       <div>
//         <span>{`${inv}`}</span>
//         <span>{`${idPelanggan}`}</span>
//       </div>
//       <div>
//         <Select
//           defaultValue={defaultNamaPelanggan}
//           style={{ width: 200 }}
//           onChange={(value) => {
//             console.log('Pelanggan Terpilih:', value)
//           }}
//         >
//           {pelanggans?.map((pelanggan) => (
//             <Option key={pelanggan._id} value={pelanggan._id}>
//               {pelanggan.nama_pelanggan}
//             </Option>
//           ))}
//         </Select>
//       </div>

//       <Table
//         dataSource={isEditing ? editedData : getPosDetail}
//         columns={columns}
//         rowKey={(record) => record._id}
//         pagination={false}
//         style={{ marginBottom: 20 }}
//       />
//       <div>TOTAL semua: {`${total}`}</div>
//       {isEditing && (
//         <>
//           <Button
//             disabled={isHargaOutOfRange || isAnyItemExceedingStok()}
//             onClick={saveChanges}
//           >
//             Save
//           </Button>
//         </>
//       )}
//     </div>
//   )
// }

// export default DetailPosPage
