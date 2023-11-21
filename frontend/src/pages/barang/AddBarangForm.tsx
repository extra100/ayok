// import React, { useState } from 'react'
// import { Form, Input, Card, Button, Select, Row, Col } from 'antd'
// import {
//   useAddBarangMutation,
//   useGetBarangsQuery,
// } from '../../hooks/barangHooks'
// import { useGetSuppliersQuery } from '../../hooks/supplierHooks'
// import { Satuan } from '../../types/Satuan'
// import { useGetSatuansQuery } from '../../hooks/satuanHooks'
// import { Barang } from '../../types/Barang'
// import { Supplier } from '../../types/Supplier'
// import { Link, useNavigate } from 'react-router-dom'
// import { AiOutlinePlus } from 'react-icons/ai'

// const AddBarangForm: React.FC = () => {
//   const [form] = Form.useForm()
//   const { data: suppliersData, isLoading: isSuppliersLoading } =
//     useGetSuppliersQuery()
//   const { data: satuansData, isLoading: isSatuansLoading } =
//     useGetSatuansQuery()
//   const { data, isLoading } = useGetBarangsQuery()

//   const [adding, setAdding] = useState(false)
//   const addBarangMutation = useAddBarangMutation()
//   const navigate = useNavigate()
//   const handleAddBarang = () => {
//     form.resetFields()
//     setAdding(true)

//     if (data && Array.isArray(data)) {
//       if (data.length === 0) {
//         form.setFieldsValue({ id_barang: `BAR-00001` })
//       } else {
//         const lastRecord = [...data]
//           .sort((a, b) => a.id_barang.localeCompare(b.id_barang))
//           .pop()

//         if (lastRecord) {
//           const lastIdNumber = Number(
//             lastRecord.id_barang.replace(/[^0-9]/g, '')
//           )
//           const nextId = lastIdNumber + 1
//           const paddedId = nextId.toString().padStart(5, '0')
//           form.setFieldsValue({ id_barang: `BAR-${paddedId}` })
//         }
//       }
//     } else {
//       form.setFieldsValue({ id_barang: `BAR-00001` })
//     }
//   }

//   React.useEffect(() => {
//     if (!isLoading) {
//       handleAddBarang()
//     }
//   }, [isLoading, data])

//   const saveNewBarang = async () => {
//     try {
//       const row = (await form.validateFields()) as Barang
//       const newBarang: Barang = {
//         _id: row._id,
//         id_barang: row.id_barang,
//         nama_barang: row.nama_barang,
//         id_satuan: row.id_satuan,
//         harga_beli: row.harga_beli,
//         hpp: row.hpp,
//         id_supplier: row.id_supplier,
//         status: row.status,
//         barcode: row.barcode,
//         id_usaha: row.id_usaha,
//         id_outlet: row.id_outlet,
//         id_kategori: row.id_kategori,
//         harga_jual: row.harga_jual,
//       }

//       await addBarangMutation.mutateAsync(newBarang)
//       setAdding(false)

//       console.log()
//       navigate('/barang')
//     } catch (errInfo) {}
//   }
//   return (
//     <Card
//       style={{
//         marginTop: '160px',
//         width: '600px',
//         marginLeft: '400px',
//         position: 'relative',
//       }}
//     >
//       <Form form={form} component={false}>
//         <h2
//           style={{
//             position: 'absolute',
//             top: -10,
//             left: -60,
//             transform: 'rotate(-20deg)',
//             marginBottom: '40px',
//             fontSize: 30,
//             color: '',
//           }}
//         >
//           Tambah Barang
//         </h2>

//         <Form.Item
//           name="nama_barang"
//           label="Nama Barang"
//           labelCol={{ span: 6 }}
//           wrapperCol={{ span: 15 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please input the name of the barang!',
//             },
//           ]}
//           style={{ marginTop: 30 }}
//         >
//           <Input />
//         </Form.Item>
//         <Row>
//           <Col>
//             <Form.Item
//               name="id_satuan"
//               label="Nama satuan"
//               labelCol={{ span: 7 }}
//               wrapperCol={{ span: 16 }}
//               rules={[
//                 {
//                   required: true,
//                   message: 'Please select the Satuan!',
//                 },
//               ]}
//             >
//               <Select
//                 showSearch
//                 optionFilterProp="children"
//                 filterOption={(input, option) =>
//                   option?.children
//                     ? option.children
//                         .toString()
//                         .toLowerCase()
//                         .includes(input.toLowerCase())
//                     : false
//                 }
//                 style={{ marginRight: '10px', width: '320px' }}
//               >
//                 {satuansData?.map((satuan: Satuan) => (
//                   <Select.Option key={satuan._id} value={satuan._id}>
//                     {satuan.nama_satuan}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={4}>
//             <Link to="/form-satuan">
//               <Button
//                 icon={<AiOutlinePlus />}
//                 style={{
//                   background: 'transparent',
//                   marginLeft: 6,
//                 }}
//               />
//             </Link>
//           </Col>
//         </Row>
//         <Form.Item
//           name="hpp"
//           label="Hpp"
//           labelCol={{ span: 6 }}
//           wrapperCol={{ span: 15 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please input the HPP of the barang!',
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           name="harga_beli"
//           label="harga beli"
//           labelCol={{ span: 6 }}
//           wrapperCol={{ span: 15 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please input the harga beli of the barang!',
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="id_barang"
//           labelCol={{ span: 6 }}
//           wrapperCol={{ span: 15 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please input the ID of the barang!',
//             },
//           ]}
//           style={{ position: 'absolute', top: 0, right: -100 }}
//         >
//           <Input
//             disabled
//             style={{ border: 'none', backgroundColor: 'transparent' }}
//           />
//         </Form.Item>

//         <Row>
//           <Col>
//             <Form.Item
//               name="id_supplier"
//               label="Nama Supplier"
//               labelCol={{ span: 7 }}
//               wrapperCol={{ span: 16 }}
//               rules={[
//                 {
//                   required: true,
//                   message: 'Please select the supplier!',
//                 },
//               ]}
//             >
//               <Select
//                 showSearch
//                 optionFilterProp="children"
//                 filterOption={(input, option) =>
//                   option?.children
//                     ? option.children
//                         .toString()
//                         .toLowerCase()
//                         .includes(input.toLowerCase())
//                     : false
//                 }
//                 style={{ marginRight: '10px', width: '320px' }}
//               >
//                 {suppliersData?.map((dnbsfb: Supplier) => (
//                   <Select.Option key={dnbsfb._id} value={dnbsfb._id}>
//                     {dnbsfb.nama_supplier}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={4}>
//             <Link to="/form-supplier">
//               <Button
//                 icon={<AiOutlinePlus />}
//                 style={{
//                   background: 'transparent',
//                   marginLeft: 6,
//                 }}
//               />
//             </Link>
//           </Col>
//         </Row>
//         <Form.Item
//           name="status"
//           label="Status"
//           labelCol={{ span: 6 }}
//           wrapperCol={{ span: 15 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please input the Status of the barang!',
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           name="barcode"
//           label="barcode"
//           labelCol={{ span: 6 }}
//           wrapperCol={{ span: 15 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please input the name of the barang!',
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="id_usaha"
//           label="Jenis Usaha"
//           labelCol={{ span: 7 }}
//           wrapperCol={{ span: 16 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please select the Usaha!',
//             },
//           ]}
//         >
//           <Select
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
//             style={{ marginRight: '10px', width: '320px' }}
//           >
//             {suppliersData?.map((supplier: Supplier) => (
//               <Select.Option key={supplier._id} value={supplier._id}>
//                 {supplier.nama_supplier}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>
//         <Form.Item
//           name="id_outlet"
//           label="Nama Outlet"
//           labelCol={{ span: 7 }}
//           wrapperCol={{ span: 16 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please select the Outlet!',
//             },
//           ]}
//         >
//           <Select
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
//             style={{ marginRight: '10px', width: '320px' }}
//           >
//             {suppliersData?.map((twttwttst: Supplier) => (
//               <Select.Option key={twttwttst._id} value={twttwttst._id}>
//                 {twttwttst.nama_supplier}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>
//         <Form.Item
//           name="id_kategori"
//           label="Kategori Barang"
//           labelCol={{ span: 7 }}
//           wrapperCol={{ span: 16 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please select the Kategori Barang!',
//             },
//           ]}
//         >
//           <Select
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
//             style={{ marginRight: '10px', width: '320px' }}
//           >
//             {suppliersData?.map((katkatkat: Supplier) => (
//               <Select.Option key={katkatkat._id} value={katkatkat._id}>
//                 {katkatkat.nama_supplier}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item
//           name="harga_jual"
//           label="harga jual"
//           labelCol={{ span: 6 }}
//           wrapperCol={{ span: 15 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please input the KEt of the barang!',
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Row justify="center">
//           <Col>
//             <Button
//               type="primary"
//               onClick={saveNewBarang}
//               style={{ marginRight: 8 }}
//             >
//               Save
//             </Button>
//             <Button
//               onClick={() => {
//                 setAdding(false)
//                 navigate('/barang')
//               }}
//             >
//               Cancel
//             </Button>
//           </Col>
//         </Row>
//       </Form>
//     </Card>
//   )
// }

// export default AddBarangForm
