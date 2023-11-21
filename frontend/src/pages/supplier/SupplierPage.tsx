import React, { useEffect, useState } from 'react'
import { Form } from 'antd'
import {
  useGetSuppliersQuery,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} from '../../hooks/supplierHooks'

import { Supplier } from '../../types/Supplier'
import { useNavigate } from 'react-router-dom'
import Search from '../Search'
import SupplierTable from './SupplierTable'
import ToggleSupplier from './ToggleSupplier'

const SupplierPage: React.FC = () => {
  const navigate = useNavigate()
  //-----------------------toggle start--------------------------------------------------------------
  const [showIdSupplier, setShowIdSupplier] = useState(true)
  const [showA, setshowA] = useState(true)
  const toggleShowIdSupplier = () => setShowIdSupplier((prev) => !prev)
  const toggleshowA = () => setshowA((prev) => !prev)

  const getSupplierNameById = (supplierId: string) => {
    const supplier = suppliersData?.find(
      (supplier) => supplier._id === supplierId
    )
    return supplier ? supplier.nama_supplier : ''
  }
  //-----------------------toggle end--------------------------------------------------------------

  const [form] = Form.useForm()
  const { data, isLoading } = useGetSuppliersQuery()
  const { data: suppliersData } = useGetSuppliersQuery()
  const updateSupplierMutation = useUpdateSupplierMutation()
  const deleteSupplierMutation = useDeleteSupplierMutation()

  const [editingKey, setEditingKey] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<Supplier[]>(data || [])

  const isEditing = (record: Supplier) => record._id === editingKey
  const edit = (record: Supplier) => {
    form.setFieldsValue({ ...record })
    setEditingKey(record._id)
  }
  const cancel = () => {
    setEditingKey('')
  }
  const save = async (key: string) => {
    try {
      const row = await form.validateFields()
      await updateSupplierMutation.mutateAsync({ ...row, _id: key })
      setEditingKey('')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }
  const handleDelete = async (key: string) => {
    try {
      await deleteSupplierMutation.mutateAsync(key)
    } catch (err) {
      console.log(err)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  useEffect(() => {
    if (data) {
      setFilteredData(
        data.filter((item) =>
          Object.values(item).some((val) =>
            val.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      )
    }
  }, [data, searchTerm])

  return (
    <Form form={form} component={false}>
      <ToggleSupplier
        onClick={() => navigate('/form-supplier')}
        buttonText=" + Supplier"
        showIdSupplier={showIdSupplier}
        showA={showA}
        toggleShowIdSupplier={toggleShowIdSupplier}
        toggleshowA={toggleshowA}
      />
      <Search onSearch={handleSearch} />
      <SupplierTable
        form={form}
        data={filteredData}
        suppliers={suppliersData || []}
        isLoading={isLoading}
        editingKey={editingKey}
        isEditing={isEditing}
        save={save}
        cancel={cancel}
        edit={edit}
        handleDelete={handleDelete}
        getSupplierNameById={getSupplierNameById}
        showIdSupplier={showIdSupplier}
        showA={showA}
      />
    </Form>
  )
}

export default SupplierPage
