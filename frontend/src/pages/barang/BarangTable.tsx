// // BarangTable.tsx
// import React from 'react'
// import { Form, Popconfirm, Select, Table, Typography } from 'antd'
// import { Barang } from '../../types/Barang'
// import EditableCell from './CellBarang'
// import {
//   AiOutlineArrowLeft,
//   AiOutlineLike,
//   AiOutlineEdit,
//   AiOutlineDelete,
//   AiOutlineUp,
//   AiOutlineDown,
// } from 'react-icons/ai'

// interface BarangTableProps {
//   form: any
//   data: Barang[]
//   suppliers: any[]
//   isLoading: boolean
//   editingKey: string
//   isEditing: (record: Barang) => boolean
//   save: (key: string) => void
//   cancel: () => void
//   edit: (record: Barang) => void
//   handleDelete: (key: string) => void
//   getSupplierNameById: (supplierId: string) => string
//   showIdBarang: boolean
//   showA: boolean
// }

// const BarangTable: React.FC<BarangTableProps> = ({
//   form,
//   data,
//   suppliers,
//   isLoading,
//   editingKey,
//   isEditing,
//   save,
//   cancel,
//   edit,
//   handleDelete,
//   getSupplierNameById,
//   showIdBarang,
//   showA,
// }) => {
//   const columns = [
//     {
//       title: 'No',
//       key: 'index',
//       align: 'center' as 'center',
//       fixed: true,
//       width: '5%',
//       render: (_: any, __: any, index: number) => index + 1,
//     },

//     ...(showIdBarang
//       ? [
//           {
//             title: 'ID',
//             dataIndex: 'id_usaha',

//             fixed: true,
//             editable: false,
//             align: 'center' as 'center',
//             render: (text: string) => (
//               <div style={{ textAlign: 'center' }}>{text}</div>
//             ),
//             onCell: (record: Barang) => ({
//               record,
//               inputType: 'text',
//               dataIndex: 'id_barang',
//               title: 'ID',
//               editing: isEditing(record),
//               suppliers,
//             }),
//           },
//         ]
//       : []),
//     {
//       title: 'Nama Barang',
//       dataIndex: 'nama_barang',

//       fixed: true,
//       align: 'center' as 'center',

//       render: (text: string) => (
//         <div style={{ textAlign: 'center' }}>{text}</div>
//       ),
//       editable: true,
//     },

//     ...(showA
//       ? [
//           {
//             title: 'satuan',
//             dataIndex: 'id_satuan',
//             align: 'center' as 'center',
//             fixed: true,

//             render: (text: string) => (
//               <div style={{ textAlign: 'center' }}>{text}</div>
//             ),
//             editable: true,
//           },
//         ]
//       : []),

//     {
//       title: 'Nama Suppleir',
//       dataIndex: 'id_supplier',
//       align: 'center' as 'center',

//       fixed: true,
//       editable: true,
//       render: (text: any, record: Barang) => {
//         const editable = isEditing(record)
//         return (
//           <div style={{ textAlign: 'center' }}>
//             {editable ? (
//               <Form.Item
//                 name="id_supplier"
//                 rules={[
//                   {
//                     required: true,
//                     message: 'Please select a supplier!',
//                   },
//                 ]}
//               >
//                 <Select>
//                   {suppliers.map((supplier) => (
//                     <Select.Option key={supplier._id} value={supplier._id}>
//                       {supplier.nama_supplier}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             ) : (
//               getSupplierNameById(text)
//             )}
//           </div>
//         )
//       },
//     },

//     {
//       title: 'Aksi',
//       dataIndex: 'operation',
//       editable: false,
//       fixed: true,
//       align: 'center' as 'center',

//       render: (_: any, record: Barang) => {
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
//       onCell: (record: Barang) => ({
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
//         suppliers,
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
//       dataSource={data}
//       columns={columns}
//       rowClassName="editable-row"
//       loading={isLoading}
//       rowKey={(record) => record._id}
//       expandable={{
//         expandedRowRender: (record) => (
//           <div>
//             <p style={{ margin: 0 }}>
//               Supplier: {getSupplierNameById(record.id_supplier)}
//             </p>
//             <p style={{ margin: 0 }}>Id Usaha: {record.id_usaha} </p>
//             <p style={{ margin: 0 }}>Ket: {record.status}</p>
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
// export default BarangTable
