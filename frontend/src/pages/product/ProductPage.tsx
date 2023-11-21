// import React, { useEffect, useState } from 'react'
// import { Form } from 'antd'
// import {
//   useGetProductsQuery,
//   useUpdateProductMutation,
//   useDeleteProductMutation,
// } from '../../hooks/productHooks'

// import { Product } from '../../types/Product'
// import { useNavigate } from 'react-router-dom'
// import Search from '../Search'
// import ProductTable from './ProductTable'
// import ToggleProduct from './ToggleProduct'

// const ProductPage: React.FC = () => {
//   const navigate = useNavigate()
//   //-----------------------toggle start--------------------------------------------------------------
//   const [showIdH, setshowIdH] = useState(true)
//   const [showA, setshowA] = useState(true)
//   const toggleshowIdH = () => setshowIdH((prev) => !prev)
//   const toggleshowA = () => setshowA((prev) => !prev)

//   //-----------------------toggle end--------------------------------------------------------------

//   const [bentuk] = Form.useForm()
//   const { data, isLoading } = useGetProductsQuery()

//   const updateProductMutation = useUpdateProductMutation()
//   const deleteProductMutation = useDeleteProductMutation()

//   const [editingKey, setEditingKey] = useState('')
//   const [searchTerm, setSearchTerm] = useState('')
//   const [filteredData, setFilteredData] = useState<Product[]>(data || [])

//   const isEditing = (rekamHereOnly: Product) => rekamHereOnly._id === editingKey

//   const edit = (justRecordHere: Product) => {
//     bentuk.setFieldsValue({ ...justRecordHere })
//     setEditingKey(justRecordHere._id)
//   }
//   const cancel = () => {
//     setEditingKey('')
//   }
//   const save = async (serek: string) => {
//     try {
//       const row = await bentuk.validateFields()
//       await updateProductMutation.mutateAsync({ ...row, _id: serek })
//       setEditingKey('')
//     } catch (errInfo) {
//       console.log('Validate Failed:', errInfo)
//     }
//   }
//   const handleDelete = async (gembok: string) => {
//     try {
//       await deleteProductMutation.mutateAsync(gembok)
//     } catch (ellor) {
//       console.log(ellor)
//     }
//   }

//   const handleSearch = (syarat: string) => {
//     setSearchTerm(syarat)
//   }

//   useEffect(() => {
//     if (data) {
//       setFilteredData(
//         data.filter((kedoakm) =>
//           Object.values(kedoakm).some((val) =>
//             val.toString().toLowerCase().includes(searchTerm.toLowerCase())
//           )
//         )
//       )
//     }
//   }, [data, searchTerm])

//   return (
//     <Form form={bentuk} component={false}>
//       <ToggleProduct
//         onClick={() => navigate('/form-product')}
//         buttonText=" + Product"
//         showIdH={showIdH}
//         showA={showA}
//         toggleshowIdH={toggleshowIdH}
//         toggleshowA={toggleshowA}
//       />
//       <Search onSearch={handleSearch} />
//       <ProductTable
//         form2hereOneAtPage={bentuk}
//         asal={filteredData}
//         isLoading={isLoading}
//         editingKey={editingKey}
//         isEditing={isEditing}
//         save={save}
//         cancel={cancel}
//         edit={edit}
//         handleDelete={handleDelete}
//         showIdH={showIdH}
//         showA={showA}
//       />
//     </Form>
//   )
// }

// export default ProductPage
