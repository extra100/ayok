// import { useQueryClient } from '@tanstack/react-query'
// import React, { useState, useEffect } from 'react'
// import { Button, Col, Form, NavLink, Row, Table } from 'react-bootstrap'
// import { Helmet } from 'react-helmet-async'
// import { Link } from 'react-router-dom'
// import LoadingBox from '../components/LoadingBox'
// import MessageBox from '../components/MessageBox'
// import Pagination from '../components/Pagination'
// import {
//   AiOutlineEdit,
//   AiOutlineDelete,
//   AiOutlinePlusCircle,
// } from 'react-icons/ai'
// import { useAddKindMutation, useGetKindsQuery } from '../hooks/kindHooks'
// import {
//   useGetProductsQuery,
//   useAddProductMutation,
//   useUpdateProductMutation,
//   useDeleteProductMutation,
// } from '../hooks/productHooks'
// import {
//   useGetSuppliersQuery,
//   useAddSupplierMutation,
// } from '../hooks/supplierHooks'
// import { ApiError } from '../types/ApiError'
// import { Kind } from '../types/Kind'
// import { Product } from '../types/Product'
// import { Supplier } from '../types/Supplier'
// import { convertProductToCartItem, getError } from '../utils'

// export default function HomePage() {
//   const { data: products = [], isLoading, error } = useGetProductsQuery()
//   const addProductMutation = useAddProductMutation()
//   const updateProductMutation = useUpdateProductMutation()
//   const deleteProductMutation = useDeleteProductMutation()
//   const queryClient = useQueryClient()
//   const { data: suppliers = [] } = useGetSuppliersQuery()
//   const addSupplierMutation = useAddSupplierMutation()
//   const { data: kategoris = [] } = useGetKindsQuery()
//   const addKategoriMutation = useAddKindMutation()
//   const [searchName, setSearchName] = useState('')
//   const [searchPrice, setSearchPrice] = useState('')
//   const [showOverlay, setShowOverlay] = useState(false)
//   const [showAddSupplierForm, setShowAddSupplierForm] = useState(false)
//   const [showAddKategoriForm, setShowAddKategoriForm] = useState(false)
//   const [newProduct, setNewProduct] = useState<Product>({
//     _id: '',
//     id_data_barang: '',
//     nama_barang: '',
//     stok: '',
//     harga_beli: 0,
//     harga_jual: 0,
//     barcode: '',
//     harga_jual_semi: 0,
//     harga_jual_grosir: 0,
//     nama_supplier: '',
//     jenis_kategori: '',
//   })
//   const [newSupplier, setNewSupplier] = useState<Supplier>({
//     _id: '',
//     id_supplier: '',
//     nama_supplier: '',
//     alamat_supplier: '',
//     kontak_supplier: '',
//   })
//   const [newKategori, setNewKategori] = useState<Kind>({
//     _id: '',
//     id_kategori: '',
//     jenis_kategori: '',
//   })
//   const [editProduct, setEditProduct] = useState<Product | null>(null)
//   const [isAddingProduct, setIsAddingProduct] = useState(true)
//   const [deleteSuccess, setDeleteSuccess] = useState(false)

//   const handleCancel = () => {
//     setShowOverlay(false)
//     setShowAddSupplierForm(false)
//     setShowAddKategoriForm(false)
//     setNewProduct({
//       _id: '',
//       id_data_barang: '',
//       nama_barang: '',
//       stok: '',
//       harga_beli: 0,
//       harga_jual: 0,
//       barcode: '',
//       harga_jual_semi: 0,
//       harga_jual_grosir: 0,
//       nama_supplier: '',
//       jenis_kategori: '',
//     })
//     setEditProduct(null)
//     setIsAddingProduct(true)
//   }
//   const [currentPage, setCurrentPage] = useState(1)
//   const productsPerPage = 10

//   useEffect(() => {
//     if (editProduct) {
//       setNewProduct(editProduct)
//     }
//   }, [editProduct])

//   useEffect(() => {
//     if (deleteProductMutation.isSuccess) {
//       setDeleteSuccess(true)
//       queryClient.invalidateQueries(['products'])
//     }
//   }, [deleteProductMutation.isSuccess, queryClient])
//   if (isLoading) {
//     return <LoadingBox />
//   }
//   if (error) {
//     return (
//       <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
//     )
//   }
//   const filteredProducts = products.filter((product) => {
//     const nameMatch = product.nama_barang
//       .toLowerCase()
//       .includes(searchName.toLowerCase())
//     const priceMatch =
//       product.harga_beli && product.harga_beli.toString().includes(searchPrice)
//     return nameMatch && priceMatch
//   })
//   const indexOfLastProduct = currentPage * productsPerPage
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage
//   const currentProducts = filteredProducts.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   )
//   const handlePageChange = (page: number) => {
//     setCurrentPage(page)
//   }
//   const handleTambahBarang = (product: Product | null = null) => {
//     if (product) {
//       setIsAddingProduct(false)
//       setEditProduct(product)
//     } else {
//       setIsAddingProduct(true)
//       setEditProduct(null)
//       const lastProductId =
//         products.length > 0 ? products[products.length - 1].id_data_barang : ''
//       const nextProductId = generateNextProductId(lastProductId)
//       setNewProduct((prevProduct) => ({
//         ...prevProduct,
//         id_data_barang: nextProductId,
//       }))
//     }
//     setShowOverlay(true)
//   }
//   const generateNextProductId = (lastProductId: string) => {
//     const lastIdParts = lastProductId.split('-')
//     const lastNumber = parseInt(lastIdParts[1], 10)
//     const nextNumber = lastNumber + 1
//     const paddedNextNumber = nextNumber.toString().padStart(4, '0')
//     return `Bar-${paddedNextNumber}`
//   }
//   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setNewProduct((prevProduct) => ({
//       ...prevProduct,
//       [name]: value,
//     }))
//   }
//   // const handleSubmitForm = () => {
//   //   setShowOverlay(false)
//   //   if (isAddingProduct) {
//   //     const productWithSupplierAndCategory: Product = {
//   //       ...newProduct,
//   //       nama_supplier:
//   //         newProduct.nama_supplier ||
//   //         suppliers.find(
//   //           (supplier) => supplier._id === newProduct.nama_supplier
//   //         )?._id ||
//   //         '',
//   //       jenis_kategori:
//   //         newProduct.jenis_kategori ||
//   //         kategoris.find(
//   //           (kategori) => kategori._id === newProduct.jenis_kategori
//   //         )?._id ||
//   //         '',
//   //     }
//   //     addProductMutation.mutate(productWithSupplierAndCategory)
//   //   } else {
//   //     const updatedProduct: Product = { ...newProduct, _id: editProduct?._id }
//   //     updateProductMutation.mutate(updatedProduct)
//   //   }
//   //   setNewProduct({
//   //     _id: '',
//   //     id_data_barang: '',
//   //     nama_barang: '',
//   //     stok: '',
//   //     harga_beli: 0,
//   //     harga_jual: 0,
//   //     barcode: '',
//   //     harga_jual_semi: 0,
//   //     harga_jual_grosir: 0,
//   //     nama_supplier: '',
//   //     jenis_kategori: '',
//   //   })
//   //   setEditProduct(null)
//   //   setIsAddingProduct(true)
//   // }

//   const handleDeleteBarang = (productId: string) => {
//     if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
//       deleteProductMutation.mutate(productId)
//     }
//   }
//   const handleTambahSupplier = () => {
//     setShowAddSupplierForm(true)
//   }
//   const handleTambahKategori = () => {
//     setShowAddKategoriForm(true)
//   }
//   const handleFormChangeSupplier = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setNewSupplier((prevSupplier) => ({
//       ...prevSupplier,
//       [name]: value,
//     }))
//   }
//   const handleFormChangeKategori = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setNewKategori((prevKategori) => ({
//       ...prevKategori,
//       [name]: value,
//     }))
//   }
//   // const handleSubmitFormSupplier = () => {
//   //   setShowAddSupplierForm(false)
//   //   addSupplierMutation.mutate(newSupplier)
//   //   setNewSupplier({
//   //     _id: '',
//   //     id_supplier: '',
//   //     nama_supplier: '',
//   //     alamat_supplier: '',
//   //     kontak_supplier: '',
//   //   })
//   // }
//   const handleSubmitFormKategori = () => {
//     setShowAddKategoriForm(false)
//     addKategoriMutation.mutate(newKategori)
//     setNewKategori({
//       _id: '',
//       id_kategori: '',
//       jenis_kategori: '',
//     })
//   }
//   return (
//     <div>
//       <Helmet>
//         <title>SemangatJet</title>
//       </Helmet>
//       <Row>
//         <Col md={6} className="mb-2">
//           <div className="search-container">
//             <input
//               type="text"
//               placeholder="Cari nama barang..."
//               value={searchName}
//               onChange={(e) => setSearchName(e.target.value)}
//               className="search-input"
//             />
//           </div>
//         </Col>
//         <Col md={6} className="mb-2 text-md-end">
//           <Button variant="primary" onClick={() => handleTambahBarang()}>
//             Tambah Barang
//           </Button>
//         </Col>
//       </Row>
//       {/* <Table className="table">
//         <thead>
//           <tr className="text-center">
//             <th>No</th>
//             <th>Nama</th>
//             <th>Stok</th>
//             <th>Harga Beli</th>
//             <th>Harga Jual</th>
//             <th>Barcode</th>
//             <th>Harga Jual Semi</th>
//             <th>Harga Jual Grosir</th>
//             <th>Nama Supplier</th>
//             <th>Jenis Kategori</th> {/* Tambahkan kolom "Nama Supplier" */}
//             <th>Aksi</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentProducts.map((product) => (
//             <tr key={product.id_data_barang}>
//               <td className="text-left">{product.id_data_barang}</td>
//               <td className="text-left">{product.nama_barang}</td>
//               <td className="text-center">{product.stok}</td>
//               <td className="text-end">
//                 {' '}
//                 {new Intl.NumberFormat('id-ID', {
//                   style: 'currency',
//                   currency: 'IDR',
//                   minimumFractionDigits: 0,
//                 }).format(product.harga_beli)}
//               </td>
//               <td className="text-end">
//                 {' '}
//                 {new Intl.NumberFormat('id-ID', {
//                   style: 'currency',
//                   currency: 'IDR',
//                   minimumFractionDigits: 0,
//                 }).format(product.harga_jual)}
//               </td>
//               <td className="text-center">{product.barcode}</td>
//               <td className="text-end">
//                 {' '}
//                 {new Intl.NumberFormat('id-ID', {
//                   style: 'currency',
//                   currency: 'IDR',
//                   minimumFractionDigits: 0,
//                 }).format(product.harga_jual_semi)}
//               </td>
//               <td className="text-end">
//                 {' '}
//                 {new Intl.NumberFormat('id-ID', {
//                   style: 'currency',
//                   currency: 'IDR',
//                   minimumFractionDigits: 0,
//                 }).format(product.harga_jual_grosir)}
//               </td>
//               <td className="text-left">
//                 {
//                   suppliers.find(
//                     (supplier) => supplier._id === product.nama_supplier
//                   )?.nama_supplier
//                 }
//               </td>
//               <td className="text-left">
//                 {
//                   kategoris.find(
//                     (kategori) => kategori._id === product.jenis_kategori
//                   )?.jenis_kategori
//                 }
//               </td>
//               <td>
//                 <Button
//                   variant="primary"
//                   onClick={() => handleTambahBarang(product)}
//                 >
//                   <AiOutlineEdit />
//                 </Button>

//                 <Button
//                   variant="danger"
//                   onClick={() => handleDeleteBarang(product?._id || '')}
//                 >
//                   <AiOutlineDelete />
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table> */}
//       {showOverlay && (
//         <div className="overlay">
//           <div className="overlay-content">
//             {isAddingProduct ? <h2>Tambah Barang</h2> : <h2>Edit Barang</h2>}
//             <Form className="add-form">
//               <Row className="mb-3">
//                 <Col md={6}>
//                   <Form.Group controlId="idBarang">
//                     <Form.Control
//                       type="text"
//                       name="id_data_barang"
//                       value={newProduct.id_data_barang}
//                       onChange={handleFormChange}
//                       placeholder="ID Barang"
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group controlId="namaBarang">
//                     <Form.Control
//                       type="text"
//                       name="nama_barang"
//                       value={newProduct.nama_barang}
//                       onChange={handleFormChange}
//                       placeholder="Nama Barang"
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//               <Row className="mb-3">
//                 <Col md={6}>
//                   <Form.Group controlId="stok">
//                     <Form.Control
//                       type="number"
//                       name="stok"
//                       value={newProduct.stok}
//                       onChange={handleFormChange}
//                       placeholder="Stok"
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group controlId="hargaBeli">
//                     <Form.Control
//                       type="number"
//                       name="harga_beli"
//                       value={newProduct.harga_beli}
//                       onChange={handleFormChange}
//                       placeholder="Harga Beli"
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//               <Row className="mb-3">
//                 <Col md={6}>
//                   <Form.Group controlId="hargaJual">
//                     <Form.Control
//                       type="number"
//                       name="harga_jual"
//                       value={newProduct.harga_jual}
//                       onChange={handleFormChange}
//                       placeholder="Harga Jual"
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group controlId="barcode">
//                     <Form.Control
//                       type="number"
//                       name="barcode"
//                       value={newProduct.barcode}
//                       onChange={handleFormChange}
//                       placeholder="Barcode"
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//               <Row className="mb-3">
//                 <Col md={6}>
//                   <Form.Group controlId="hargaJualSemi">
//                     <Form.Control
//                       type="number"
//                       name="harga_jual_semi"
//                       value={newProduct.harga_jual_semi}
//                       onChange={handleFormChange}
//                       placeholder="Harga Jual Semi"
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group controlId="hargaJualGrosir">
//                     <Form.Control
//                       type="number"
//                       name="harga_jual_grosir"
//                       value={newProduct.harga_jual_grosir}
//                       onChange={handleFormChange}
//                       placeholder="Harga Jual Grosir"
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//               <Row className="mb-3">
//                 <Col md={6}>
//                   <Form.Group controlId="namaSupplier">
//                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                       <Form.Control
//                         as="select"
//                         name="nama_supplier"
//                         value={newProduct.nama_supplier}
//                         onChange={handleFormChange}
//                         placeholder="Nama Supplier"
//                       >
//                         <option value="">Pilih Supplier</option>
//                         {suppliers.map((supplier) => (
//                           <option key={supplier._id} value={supplier._id}>
//                             {supplier.nama_supplier}
//                           </option>
//                         ))}
//                       </Form.Control>
//                       <NavLink onClick={() => setShowAddSupplierForm(true)}>
//                         <AiOutlinePlusCircle
//                           style={{
//                             cursor: 'pointer',
//                             marginLeft: '5px',
//                             color: 'blue',
//                           }}
//                         />
//                       </NavLink>
//                     </div>
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group controlId="jenisKategori">
//                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                       <Form.Control
//                         as="select"
//                         name="jenis_kategori"
//                         value={newProduct.jenis_kategori}
//                         onChange={handleFormChange}
//                         placeholder="Jenis Kategori"
//                       >
//                         <option value="">Pilih Kategori</option>
//                         {kategoris.map((kategori) => (
//                           <option key={kategori._id} value={kategori._id}>
//                             {kategori.jenis_kategori}
//                           </option>
//                         ))}
//                       </Form.Control>
//                       <NavLink onClick={() => setShowAddKategoriForm(true)}>
//                         <AiOutlinePlusCircle
//                           style={{
//                             cursor: 'pointer',
//                             marginLeft: '5px',
//                             color: 'blue',
//                           }}
//                         />
//                       </NavLink>
//                     </div>
//                   </Form.Group>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col md={6} className="d-flex justify-content-end">
//                   <Button variant="primary" onClick={handleSubmitForm}>
//                     {isAddingProduct ? 'Tambah' : 'Simpan'}
//                   </Button>
//                   <Button
//                     variant="secondary"
//                     onClick={handleCancel}
//                     className="ms-2"
//                   >
//                     Batal
//                   </Button>
//                 </Col>
//               </Row>
//             </Form>
//           </div>
//         </div>
//       )}
//       {showAddSupplierForm && (
//         <div className="overlay">
//           <div className="overlay-content" style={{ width: '800px' }}>
//             <div className="d-flex align-items-center mb-3">
//               <h2 className="me-auto"></h2>
//               <div className="form-inline">
//                 <input
//                   type="text"
//                   id="idSupplier"
//                   name="id_supplier"
//                   value={newSupplier.id_supplier}
//                   onChange={handleFormChangeSupplier}
//                   readOnly
//                   style={{
//                     border: 'none',
//                     borderBottom: '1px',
//                     marginBottom: '1px',
//                     display: 'none',
//                   }}
//                 />
//               </div>
//             </div>
//             <Form className="add-form">
//               <Row className="form-row">
//                 <Col md={6} className="mb-3 form-column">
//                   <label
//                     htmlFor="namaSupplier"
//                     style={{ marginRight: '10px', marginBottom: '25px' }}
//                   >
//                     Nama Supplier
//                   </label>
//                   <input
//                     type="text"
//                     id="namaSupplier"
//                     name="nama_supplier"
//                     value={newSupplier.nama_supplier}
//                     onChange={handleFormChangeSupplier}
//                     style={{ border: 'none', borderBottom: '1px solid black' }}
//                   />
//                 </Col>
//                 <Col md={6} className="mb-3 form-column">
//                   <label htmlFor="idSupplier" style={{ marginRight: '37px' }}>
//                     ID Supplier
//                   </label>
//                   <input
//                     type="text"
//                     id="idSupplier"
//                     name="id_supplier"
//                     value={newSupplier.id_supplier}
//                     onChange={handleFormChangeSupplier}
//                     style={{ border: 'none', borderBottom: '1px solid black' }}
//                   />
//                 </Col>
//                 <Col md={6} className="mb-3 form-column">
//                   <label
//                     htmlFor="alamatSupplier"
//                     style={{ marginRight: '30px' }}
//                   >
//                     Alamat Supplier
//                   </label>
//                   <input
//                     type="text"
//                     id="alamatSupplier"
//                     name="alamat_supplier"
//                     value={newSupplier.alamat_supplier}
//                     onChange={handleFormChangeSupplier}
//                     style={{ border: 'none', borderBottom: '1px solid black' }}
//                   />
//                 </Col>
//                 <Col md={6} className="mb-3 form-column">
//                   <label
//                     htmlFor="kontakSupplier"
//                     style={{ marginRight: '30px' }}
//                   >
//                     Telepon Supplier
//                   </label>
//                   <input
//                     type="text"
//                     id="kontakSupplier"
//                     name="kontak_supplier"
//                     value={newSupplier.kontak_supplier}
//                     onChange={handleFormChangeSupplier}
//                     style={{ border: 'none', borderBottom: '1px solid black' }}
//                   />
//                 </Col>
//               </Row>
//               <Row>
//                 <Col md={6} className="d-flex justify-content-start">
//                   <Button variant="primary" onClick={handleSubmitFormSupplier}>
//                     Tambah
//                   </Button>
//                   <Button
//                     variant="secondary"
//                     onClick={handleCancel}
//                     className="ms-2"
//                   >
//                     Batal
//                   </Button>
//                 </Col>
//               </Row>
//             </Form>
//           </div>
//         </div>
//       )}

//       {showAddKategoriForm && (
//         <div className="overlay">
//           <div className="overlay-content">
//             <Form className="add-form">
//               <Row>
//                 <Col md={6}>
//                   <Form.Group controlId="idKategori">
//                     <Form.Control
//                       type="text"
//                       name="id_kategori"
//                       value={newKategori.id_kategori}
//                       onChange={handleFormChangeKategori}
//                       placeholder="id Kategori"
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group controlId="jenisKategori">
//                     <Form.Control
//                       type="text"
//                       name="jenis_kategori"
//                       value={newKategori.jenis_kategori}
//                       onChange={handleFormChangeKategori}
//                       placeholder="Jenis Kategori"
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col md={6}>
//                   <Button variant="primary" onClick={handleSubmitFormKategori}>
//                     Tambah
//                   </Button>
//                 </Col>
//                 <Col md={6}>
//                   <Button variant="secondary" onClick={handleCancel}>
//                     Batal
//                   </Button>
//                 </Col>
//               </Row>
//             </Form>
//           </div>
//         </div>
//       )}
//       <Pagination
//         currentPage={currentPage}
//         totalPages={Math.ceil(filteredProducts.length / productsPerPage)}
//         onPageChange={handlePageChange}
//       />
//     </div>
//   )
// }
