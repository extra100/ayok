// import React, { useEffect, useState } from 'react'
// import { Form } from 'antd'
// import {
//   useGetBarangsQuery,
//   useUpdateBarangMutation,
//   useDeleteBarangMutation,
// } from '../../hooks/barangHooks'
// import { useGetSuppliersQuery } from '../../hooks/supplierHooks'
// import { Barang } from '../../types/Barang'
// import { useNavigate } from 'react-router-dom'
// import Search from '../Search'
// import BarangTable from './BarangTable'
// import ToggleBarang from './ToggleBarang'

// const BarangPage: React.FC = () => {
//   const navigate = useNavigate()
//   //-----------------------toggle start--------------------------------------------------------------
//   const [sebok, setShowIdBarang] = useState(true)
//   const [showA, setshowA] = useState(true)
//   const showBarangPageToggle = () => setShowIdBarang((prev) => !prev)
//   const toggleshowA = () => setshowA((prev) => !prev)

//   const getSupplierNameById = (supplierId: string) => {
//     const supplier = suppliersData?.find(
//       (supplier) => supplier._id === supplierId
//     )
//     return supplier ? supplier.nama_supplier : ''
//   }
//   //-----------------------toggle end--------------------------------------------------------------

//   const [form] = Form.useForm()
//   const { data, isLoading } = useGetBarangsQuery()
//   const { data: suppliersData } = useGetSuppliersQuery()
//   const updateBarangMutation = useUpdateBarangMutation()
//   const deleteBarangMutation = useDeleteBarangMutation()

//   const [editingKey, setEditingKey] = useState('')
//   const [searchTerm, setSearchTerm] = useState('')
//   const [filteredData, setFilteredData] = useState<Barang[]>(data || [])

//   const isEditing = (record: Barang) => record._id === editingKey
//   const edit = (record: Barang) => {
//     form.setFieldsValue({ ...record })
//     setEditingKey(record._id)
//   }
//   const cancel = () => {
//     setEditingKey('')
//   }
//   const save = async (key: string) => {
//     try {
//       const row = await form.validateFields()
//       await updateBarangMutation.mutateAsync({ ...row, _id: key })
//       setEditingKey('')
//     } catch (errInfo) {
//       console.log('Validate Failed:', errInfo)
//     }
//   }
//   const handleDelete = async (key: string) => {
//     try {
//       await deleteBarangMutation.mutateAsync(key)
//     } catch (err) {
//       console.log(err)
//     }
//   }

//   const handleSearch = (term: string) => {
//     setSearchTerm(term)
//   }

//   useEffect(() => {
//     if (data) {
//       setFilteredData(
//         data.filter((item) =>
//           Object.values(item).some((val) =>
//             val.toString().toLowerCase().includes(searchTerm.toLowerCase())
//           )
//         )
//       )
//     }
//   }, [data, searchTerm])

//   return (
//     <Form form={form} component={false}>
//       <ToggleBarang
//         onClick={() => navigate('/form-barang')}
//         buttonText=" + Barang"
//         showIdBarang={sebok}
//         showA={showA}
//         toggleShowIdBarang={showBarangPageToggle}
//         toggleshowA={toggleshowA}
//       />
//       <Search onSearch={handleSearch} />
//       <BarangTable
//         form={form}
//         data={filteredData}
//         suppliers={suppliersData || []}
//         isLoading={isLoading}
//         editingKey={editingKey}
//         isEditing={isEditing}
//         save={save}
//         cancel={cancel}
//         edit={edit}
//         handleDelete={handleDelete}
//         getSupplierNameById={getSupplierNameById}
//         showIdBarang={sebok}
//         showA={showA}
//       />
//     </Form>
//   )
// }

// export default BarangPage
