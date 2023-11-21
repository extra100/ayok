// import React from 'react'
// import { Form, Popconfirm, Select, Table, Typography } from 'antd'
// import { Product } from '../../types/Product'
// import EditableCell from './CellProduct'
// import {
//   AiOutlineArrowLeft,
//   AiOutlineLike,
//   AiOutlineEdit,
//   AiOutlineDelete,
//   AiOutlineUp,
//   AiOutlineDown,
// } from 'react-icons/ai'

// interface ProductTableProps {
//   form2hereOneAtPage: any
//   asal: Product[]

//   isLoading: boolean
//   editingKey: string
//   isEditing: (record: Product) => boolean
//   save: (kunci: string) => void
//   cancel: () => void
//   edit: (record: Product) => void
//   handleDelete: (kunci: string) => void

//   showIdH: boolean
//   showA: boolean
// }

// const ProductTable: React.FC<ProductTableProps> = ({
//   form2hereOneAtPage,
//   asal,

//   isLoading,
//   editingKey,
//   isEditing,
//   save,
//   cancel,
//   edit,
//   handleDelete,

//   showIdH,
//   showA,
// }) => {
//   const columns = [
//     {
//       title: 'No',
//       kunci: 'index',
//       align: 'center' as 'center',
//       fixed: true,
//       width: '5%',
//       render: (_: any, __: any, index: number) => index + 1,
//     },

//     ...(showIdH
//       ? [
//           {
//             title: 'ID',
//             dataIndex: 'id_data_barang',
//             fixed: true,
//             editable: false,
//             align: 'center' as 'center',
//             render: (huruf: string) => (
//               <div style={{ textAlign: 'center' }}>{huruf}</div>
//             ),
//             //------unclear goal-----------------------------
//             // onCell: (record: Product) => ({
//             //   record,
//             //   inputType: 'text',
//             //   dataIndex: 'id_harga',
//             //   title: 'ID',
//             //   editing: isEditing(record),
//             //   penyuplay,
//             // }),
//             //------unclear goal-----------------------------
//           },
//         ]
//       : []),
//     // const kepeng = new Inl.NumberFormat('en-US')
//     {
//       title: 'Nama Barang',
//       dataIndex: 'nama_barang',
//       fixed: true,
//       align: 'left' as 'left',
//       render: (naskah: string) => (
//         <div style={{ textAlign: 'left' }}>{naskah}</div>
//       ),
//       editable: true,
//     },

//     {
//       title: 'Stok',
//       dataIndex: 'stok',
//       fixed: true,
//       align: 'center' as 'center',
//       render: (naskah: string) => (
//         <div style={{ textAlign: 'center' }}>{naskah}</div>
//       ),
//       editable: true,
//     },
//     {
//       title: 'harga beli',
//       dataIndex: 'harga_beli',
//       fixed: true,
//       align: 'center' as 'center',
//       render: (naskah: string) => (
//         <div style={{ textAlign: 'right' }}>{naskah}</div>
//       ),
//       editable: true,
//     },

//     {
//       title: 'harga jual ',
//       dataIndex: 'harga_jual',
//       fixed: true,
//       align: 'center' as 'center',
//       render: (naskah: string) => (
//         <div style={{ textAlign: 'right' }}>{naskah}</div>
//       ),
//       editable: true,
//     },

//     {
//       title: 'harga jual semi',
//       dataIndex: 'harga_jual_semi',
//       fixed: true,
//       align: 'center' as 'center',
//       render: (naskah: string) => (
//         <div style={{ textAlign: 'right' }}>{naskah}</div>
//       ),
//       editable: true,
//     },
//     {
//       title: 'Harga Jual Grosir',
//       dataIndex: 'harga_jual_grosir',
//       fixed: 'left',
//       align: 'right',
//       render: (harga_jual_grosir: number) => {
//         // Convert number to a string with comma separators
//         const formatter = new Intl.NumberFormat('id-ID')
//         return formatter.format(harga_jual_grosir)
//       },
//       editable: true,
//     },

//     {
//       title: 'Aksi',
//       dataIndex: 'operation',
//       editable: false,
//       fixed: true,
//       align: 'center' as 'center',

//       render: (_: any, record: Product) => {
//         const editable = isEditing(record)
//         return editable ? (
//           <span>
//             <Popconfirm
//               title="Apakah Anda yakin ingin menyimpan perubahan ini?"
//               onConfirm={() => save(record._id)}
//               okText="Yes"
//               cancelText="No"
//             >
//               <Typography.Link style={{ marginRight: 10 }}>
//                 <AiOutlineLike />
//               </Typography.Link>
//             </Popconfirm>

//             <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
//               <a>
//                 <AiOutlineArrowLeft /> Batal
//               </a>
//             </Popconfirm>
//           </span>
//         ) : (
//           <span>
//             <Typography.Link
//               onClick={() => edit(record)}
//               style={{
//                 background: 'none',
//                 color: 'black',
//                 border: 'none',
//                 paddingInline: 'none',
//                 margin: '15px',
//               }}
//             >
//               <AiOutlineEdit />
//             </Typography.Link>
//             <Popconfirm
//               title="Sure to delete?"
//               onConfirm={() => handleDelete(record._id)}
//               okText="Yes"
//               cancelText="No"
//             >
//               <a style={{ marginLeft: 8 }}>
//                 <AiOutlineDelete />
//               </a>
//             </Popconfirm>
//           </span>
//         )
//       },
//     },
//   ].map((col) => {
//     if (!col.editable) {
//       return col
//     }

//     return {
//       ...col,
//       onCell: (record: Product) => ({
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
//       }),
//     }
//   })

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
//       rowClassName="editable-row"
//       loading={isLoading}
//       rowKey={(record) => record._id}
//       expandable={{
//         expandedRowRender: (record) => (
//           <div>
//             {/* <p style={{ margin: 0 }}>
//               Supplier: {dapatkanSupById(record.nama_supplier)}
//             </p> */}
//             {/* <p style={{ margin: 0 }}>Id Supplier: {record.id_supplier} </p> */}
//             <p style={{ margin: 0 }}>Kategori: {record.jenis_kategori} </p>
//             <p style={{ margin: 0 }}>barcode: {record.barcode}</p>
//             <p style={{ margin: 0 }}>Supplier: {record.nama_supplier}</p>
//           </div>
//         ),
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
// export default ProductTable
