// import React, { useContext } from 'react'
// import { Form, Popconfirm, Select, Table, Typography } from 'antd'
// import { Penjualan } from '../../types/Penjualan'
// import EditableCell from './CellPenjualan'
// import {
//   AiOutlineArrowLeft,
//   AiOutlineLike,
//   AiOutlineEdit,
//   AiOutlineDelete,
//   AiOutlineUp,
//   AiOutlineDown,
// } from 'react-icons/ai'
// import { useGetPossQuery } from '../../hooks/posHooks'
// import moment from 'moment'
// import { useGetBanksQuery } from '../../hooks/bankHooks'
// import { useGetPelanggansQuery } from '../../hooks/pelangganHooks'
// import { useGetProductsQuery } from '../../hooks/productHooks'
// import { useGetHargasQuery } from '../../hooks/hargaHooks'
// import { Link, useParams } from 'react-router-dom'
// import { useGetoutletsQuery } from '../../hooks/outletHooks'
// import UserContext from '../../contexts/UserContext'

// // const { id_pos } = useParams<{ id_pos?: string }>()

// // const userContext = useContext(UserContext)
// // const { user } = userContext || {}

// // let idOutletLoggedIn = ''

// // if (user) {
// //   idOutletLoggedIn = user.id_outlet
// //   console.log('user', idOutletLoggedIn)
// // }

// interface PenjualanTableProps {
//   form2hereOneAtPage: any
//   asal: Penjualan[]
//   penyuplay: any[]
//   isLoading: boolean
//   editingKey: string
//   isEditing: (record: Penjualan) => boolean
//   save: (key: string) => void
//   cancel: () => void
//   edit: (record: Penjualan) => void
//   handleDelete: (key: string) => void
//   dapatkanSupById: (onlyOneHere: string) => string
//   showIdH: boolean
//   showA: boolean
//   showTiga: boolean
// }
// const banks = [{ _id: 'cash', nama_bank: 'Cash' }]

// const PenjualanTable: React.FC<PenjualanTableProps> = ({
//   form2hereOneAtPage,
//   asal,
//   penyuplay,
//   isLoading,
//   editingKey,
//   isEditing,
//   save,
//   cancel,
//   edit,
//   handleDelete,
//   dapatkanSupById,
//   showIdH,
//   showA,
//   showTiga,
// }) => {
//   // const filteredData = asal.filter(
//   //   (item) => item.id_outlet === idOutletLoggedIn
//   // )

//   const { data: banks } = useGetBanksQuery()
//   const getBankNameById = (bankId: string): string => {
//     const bank = banks?.find((b) => b._id === bankId)
//     return bank?.nama_bank || 'Unknown Bank' // Gantikan "Unknown Bank" dengan pesan default apa pun jika bank tidak ditemukan
//   }

//   const { data: pelanggans } = useGetPelanggansQuery()
//   const getPelangganNameById = (pelangganId: string): string => {
//     const pelanggan = pelanggans?.find((b) => b._id === pelangganId)
//     return pelanggan?.nama_pelanggan || 'Unknown pelanggan'
//   }
//   const { data: outlets } = useGetoutletsQuery()
//   const getOutletsById = (pelangganId: string): string => {
//     const pelanggan = outlets?.find((b) => b._id === pelangganId)
//     return pelanggan?.nama_outlet || 'Unknown pelanggan'
//   }
//   const { data: poss } = useGetPossQuery()
//   const getPosDataById = (id_pos: string) => {
//     return poss?.filter((pos) => pos.id_pos === id_pos)
//   }
//   const { data: products } = useGetProductsQuery()
//   const getProductNameById = (productId: string) => {
//     const product = products?.find((p) => p._id === productId)
//     return product?.nama_barang || 'Unknown Product' // Mengembalikan 'Unknown Product' jika produk tidak ditemukan
//   }
//   const { data: hargas } = useGetHargasQuery()
//   const getHargaNameById = (hargaId: string) => {
//     const product = hargas?.find((p) => p._id === hargaId)
//     return product?.jenis_harga || 'Default' // Mengembalikan 'Unknown Product' jika produk tidak ditemukan
//   }

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
//       title: 'Inv',
//       dataIndex: 'inv',
//       fixed: true,
//       editable: false,
//       align: 'center' as 'center',
//       render: (inv: string, record: Penjualan) => (
//         <Link to={`/pos/${record.id_pos}`}>Klik untuk Lihat Detail</Link>
//       ),
//     },
//     {
//       title: 'tanggal',
//       dataIndex: 'tanggal_mulai',
//       fixed: true,
//       align: 'center' as 'center',
//       render: (naskah: string) => (
//         <div style={{ textAlign: 'center' }}>{naskah}</div>
//       ),
//       editable: true,
//     },
//     {
//       title: 'Nama Outlet',
//       dataIndex: 'id_outlet',
//       fixed: true,
//       align: 'center' as 'center',
//       render: (pelangganId: string) => (
//         <div style={{ textAlign: 'center' }}>{getOutletsById(pelangganId)}</div>
//       ),
//       editable: true,
//     },
//     {
//       title: 'pelanggan',
//       dataIndex: 'id_pelanggan',
//       fixed: true,
//       align: 'center' as 'center',
//       render: (pelangganId: string) => (
//         <div style={{ textAlign: 'center' }}>
//           {getPelangganNameById(pelangganId)}
//         </div>
//       ),
//       editable: true,
//     },
//     {
//       title: 'Total',
//       dataIndex: 'total_semua',
//       fixed: true,
//       align: 'center' as 'center',
//       render: (naskah: string) => (
//         <div style={{ textAlign: 'center' }}>{naskah}</div>
//       ),
//       editable: true,
//     },
//     ...(showA
//       ? [
//           {
//             title: 'Pembayaran',
//             dataIndex: 'bayar',
//             align: 'center' as 'center',
//             fixed: true,

//             render: (abjad: string) => (
//               <div style={{ textAlign: 'center' }}>{abjad}</div>
//             ),
//             editable: true,
//           },
//         ]
//       : []),

//     {
//       title: 'Sisa Tagihan',
//       dataIndex: 'piutang',
//       fixed: true,
//       align: 'center' as 'center',
//       render: (genki: string, record: Penjualan) => {
//         let bgColor = 'inherit' // default background color
//         if (parseFloat(record.bayar) === 0) {
//           bgColor = 'red'
//         } else if (parseFloat(record.bayar) < parseFloat(record.total_semua)) {
//           bgColor = 'yellow'
//         } else if (parseFloat(genki) === 0) {
//           bgColor = 'blue'
//         }
//         return (
//           <div
//             style={{
//               textAlign: 'center',
//               color: 'black',

//               backgroundColor: bgColor,
//             }}
//           >
//             {genki}
//           </div>
//         )
//       },
//       editable: true,
//     },

//     {
//       title: 'Status',
//       dataIndex: 'piutang',
//       fixed: true,
//       align: 'center' as 'center',
//       render: (piutang: string, record: Penjualan) => {
//         let statusText
//         let textColor = 'inherit' // default text color

//         if (parseFloat(piutang) === 0) {
//           statusText = 'Lunas'
//         } else if (
//           parseFloat(record.bayar) > 0 &&
//           parseFloat(record.bayar) < parseFloat(record.total_semua)
//         ) {
//           statusText = 'Bayar Sebagian'
//         } else if (parseFloat(record.bayar) === 0) {
//           statusText = 'Bon Full'
//         }

//         return (
//           <div
//             style={{
//               textAlign: 'center',
//               color: textColor,
//             }}
//           >
//             {statusText}
//           </div>
//         )
//       },
//       editable: true,
//     },
//   ].map((col) => {
//     if (!col.editable) {
//       return col
//     }

//     return {
//       ...col,
//       onCell: (record: Penjualan) => ({
//         record,
//         inputType:
//           col.dataIndex === 'id_usaha'
//             ? 'number'
//             : col.dataIndex === 'id_supplier'
//             ? 'select'
//             : 'text',
//         dataIndex: col.dataIndex,
//         title: col.title,
//         editing: isEditing(record),
//         penyuplay,
//       }),
//     }
//   })

//   const { data: possData } = useGetPossQuery()

//   return (
//     <Table
//       className="table no-vertical-lines"
//       components={{
//         body: {
//           cell: EditableCell,
//         },
//       }}
//       dataSource={asal}
//       columns={columns}
//       loading={isLoading}
//       rowKey={(record) => record._id}
//       expandable={{
//         expandedRowRender: (record) => {
//           const posItems = getPosDataById(record.id_pos)
//           if (!posItems || posItems.length === 0)
//             return <div>Data POS tidak ditemukan</div>

//           const columns = [
//             {
//               title: 'No',
//               key: 'index',
//               align: 'center' as 'center',
//               fixed: true,
//               width: '5%',
//               render: (_: any, __: any, index: number) => index + 1,
//             },
//             {
//               title: 'Nama Barang',
//               dataIndex: 'id_data_barang',
//               key: 'nama_barang',
//               render: (text: string) => getProductNameById(text),
//             },
//             {
//               title: 'Jenis Harga',
//               dataIndex: 'id_harga',
//               key: 'jenis_harga',
//               render: (text: string) => getHargaNameById(text),
//             },
//             {
//               title: 'Harga Jual',
//               dataIndex: 'harga_jual',
//               key: 'harga_jual',
//             },
//             {
//               title: 'Qty',
//               dataIndex: 'qty_sold',
//               key: 'qty_sold',
//             },
//             {
//               title: 'Diskon',
//               dataIndex: 'diskon',
//               key: 'diskon',
//             },
//             {
//               title: 'Total',
//               dataIndex: 'total',
//               key: 'total',
//             },
//           ]

//           return (
//             <Table
//               rowKey={(item) => item._id}
//               columns={columns}
//               dataSource={posItems}
//               pagination={false}
//               size="small"
//             />
//           )
//         },
//         expandIcon: ({ expanded, onExpand, record }) =>
//           expanded ? (
//             <AiOutlineUp onClick={(e) => onExpand(record, e as any)} />
//           ) : (
//             <AiOutlineDown onClick={(e) => onExpand(record, e as any)} />
//           ),
//       }}
//     />
//   )
// }
// export default PenjualanTable
