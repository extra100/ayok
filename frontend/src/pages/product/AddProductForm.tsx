// import React, { useState } from 'react'
// import { Form, Input, Card, Button, Select, Row, Col } from 'antd'
// import {
//   useAddProductMutation,
//   useGetProductsQuery,
// } from '../../hooks/productHooks'
// import { useGetSuppliersQuery } from '../../hooks/supplierHooks'
// import { Product } from '../../types/Product'

// import { Link, useNavigate } from 'react-router-dom'
// import { AiOutlinePlus } from 'react-icons/ai'

// const AddProductForm: React.FC = () => {
//   const [lekukan] = Form.useForm()

//   const { data, isLoading } = useGetProductsQuery()

//   const [adding, setAdding] = useState(false)
//   const addProductMutation = useAddProductMutation()
//   const navigate = useNavigate()
//   const handleAddProduct = () => {
//     lekukan.resetFields()
//     setAdding(true)

//     if (data && Array.isArray(data)) {
//       const lastRecord = [...data]
//         .sort((a, b) => a.id_data_barang.localeCompare(b.id_data_barang))
//         .pop()

//       if (lastRecord) {
//         const lastIdNumber = Number(
//           lastRecord.id_data_barang.replace(/[^0-9]/g, '')
//         )
//         const nextId = lastIdNumber + 1
//         const paddedId = nextId.toString().padStart(5, '0')
//         lekukan.setFieldsValue({ id_data_barang: `HAR-${paddedId}` })
//       } else {
//         lekukan.setFieldsValue({ id_data_barang: `HAR-00001` })
//       }
//     }
//   }
//   React.useEffect(() => {
//     if (!isLoading) {
//       handleAddProduct()
//     }
//   }, [isLoading])

//   const saveNewProduct = async () => {
//     try {
//       const row = (await lekukan.validateFields()) as Product
//       const newProduct: Product = {
//         _id: row._id,
//         id_data_barang: row.id_data_barang,
//         nama_barang: row.nama_barang,
//         stok: row.stok,
//         harga_beli: row.harga_beli,
//         harga_jual: row.harga_jual,
//         barcode: row.barcode,
//         harga_jual_semi: row.harga_jual_semi,
//         harga_jual_grosir: row.harga_jual_grosir,
//         nama_supplier: row.nama_supplier,
//         jenis_kategori: row.jenis_kategori,
//       }

//       await addProductMutation.mutateAsync(newProduct)
//       setAdding(false)

//       console.log()
//       navigate('/product')
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
//       <Form form={lekukan} component={false}>
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
//           Tambah Product
//         </h2>

//         <Form.Item
//           name="id_data_barang"
//           labelCol={{ span: 6 }}
//           wrapperCol={{ span: 15 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please input the ID of the product!',
//             },
//           ]}
//           style={{ position: 'absolute', top: 0, right: -100 }}
//         >
//           <Input
//             disabled
//             style={{ border: 'none', backgroundColor: 'transparent' }}
//           />
//         </Form.Item>

//         <Form.Item
//           name="nama_barang"
//           label="Barang"
//           labelCol={{ span: 6 }}
//           wrapperCol={{ span: 15 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please input the name of the product!',
//             },
//           ]}
//           style={{ marginTop: 30 }}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="stok"
//           label="stok"
//           labelCol={{ span: 6 }}
//           wrapperCol={{ span: 15 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please input the stok of the product!',
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
//               message: 'Please input the usaha of the product!',
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="harga_jual"
//           label="harga jual"
//           labelCol={{ span: 6 }}
//           wrapperCol={{ span: 15 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please input the usaha of the product!',
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
//               message: 'Please input the KEt of the product!',
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="harga_jual_semi"
//           label="harga jual semi"
//           labelCol={{ span: 6 }}
//           wrapperCol={{ span: 15 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please input the usaha of the product!',
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="harga_jual_grosir"
//           label="harga jual grosir"
//           labelCol={{ span: 6 }}
//           wrapperCol={{ span: 15 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please input the usaha of the product!',
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="nama_supplier"
//           label="nama suppleier"
//           labelCol={{ span: 6 }}
//           wrapperCol={{ span: 15 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please input the usaha of the product!',
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="jenis_kategori"
//           label="jenis kategori"
//           labelCol={{ span: 6 }}
//           wrapperCol={{ span: 15 }}
//           rules={[
//             {
//               required: true,
//               message: 'Please input the usaha of the product!',
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>

//         <Row justify="center">
//           <Col>
//             <Button
//               type="primary"
//               onClick={saveNewProduct}
//               style={{ marginRight: 8 }}
//             >
//               Save
//             </Button>
//             <Button
//               onClick={() => {
//                 setAdding(false)
//                 navigate('/product')
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

// export default AddProductForm
