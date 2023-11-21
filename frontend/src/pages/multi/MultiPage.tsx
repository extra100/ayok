import React, { useEffect, useState } from 'react'
import { Form } from 'antd'
import {
  useGetMultisQuery,
  useUpdateMultiMutation,
  useDeleteMultiMutation,
} from '../../hooks/multiHooks'

import { Multi } from '../../types/Multi'
import { useNavigate } from 'react-router-dom'
import Search from '../Search'
import MultiTable from './MultiTable'
import ToggleMulti from './ToggleMutli'
import { useGetProductsQuery } from '../../hooks/productHooks'
import { useGetHargasQuery } from '../../hooks/hargaHooks'

const MultiPage: React.FC = () => {
  const navigate = useNavigate()
  //-----------------------toggle start--------------------------------------------------------------
  const [showIdMulti, setShowIdMulti] = useState(true)
  const [showA, setshowA] = useState(true)
  const toggleShowIdMulti = () => setShowIdMulti((prev) => !prev)
  const toggleshowA = () => setshowA((prev) => !prev)

  const getMultiNameById = (multiId: string) => {
    const multi = promul?.find((multi) => multi._id === multiId)
    return multi ? multi.nama_barang : ''
  }

  const getHarMultiNameById = (multiId: string) => {
    const multi = harMul?.find((multi) => multi._id === multiId)
    return multi ? multi.jenis_harga : ''
  }
  //-----------------------toggle end--------------------------------------------------------------

  const [form] = Form.useForm()
  const { data, isLoading } = useGetMultisQuery()
  const { data: multisData } = useGetMultisQuery()
  const { data: promul } = useGetProductsQuery()
  const { data: harMul } = useGetHargasQuery()
  const updateMultiMutation = useUpdateMultiMutation()
  const deleteMultiMutation = useDeleteMultiMutation()

  const [editingKey, setEditingKey] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<Multi[]>(data || [])

  const isEditing = (record: Multi) => record._id === editingKey
  const edit = (record: Multi) => {
    form.setFieldsValue({ ...record })
    setEditingKey(record._id)
  }
  const cancel = () => {
    setEditingKey('')
  }
  const save = async (key: string) => {
    try {
      const row = await form.validateFields()
      await updateMultiMutation.mutateAsync({ ...row, _id: key })
      setEditingKey('')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }
  const handleDelete = async (key: string) => {
    try {
      await deleteMultiMutation.mutateAsync(key)
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
      <ToggleMulti
        onClick={() => navigate('/form-multi')}
        buttonText=" + Multi"
        showIdMulti={showIdMulti}
        showA={showA}
        toggleShowIdMulti={toggleShowIdMulti}
        toggleshowA={toggleshowA}
      />
      <Search onSearch={handleSearch} />
      <MultiTable
        form={form}
        data={filteredData}
        promul={promul || []}
        harMul={harMul || []}
        isLoading={isLoading}
        editingKey={editingKey}
        isEditing={isEditing}
        save={save}
        cancel={cancel}
        edit={edit}
        handleDelete={handleDelete}
        getMultiNameById={getMultiNameById}
        getHarMultiNameById={getHarMultiNameById}
        showIdMulti={showIdMulti}
        showA={showA}
      />
    </Form>
  )
}

export default MultiPage
