import React, { useEffect, useState } from 'react'
import { Form } from 'antd'
import {
  useGetHargasQuery,
  useUpdateHargaMutation,
  useDeleteHargaMutation,
} from '../../hooks/hargaHooks'
import { useGetSuppliersQuery } from '../../hooks/supplierHooks'
import { Harga } from '../../types/Harga'
import { useNavigate } from 'react-router-dom'
import Search from '../Search'
import HargaTable from './HargaTable'
import ToggleHarga from './ToggleHarga'

const HargaPage: React.FC = () => {
  const navigate = useNavigate()
  //-----------------------toggle start--------------------------------------------------------------
  const [showIdH, setshowIdH] = useState(true)
  const [showA, setshowA] = useState(true)
  const [showTiga, setShowTiga] = useState(true)
  const toggleshowIdH = () => setshowIdH((prev) => !prev)
  const toggleshowA = () => setshowA((prev) => !prev)
  const toggleShowTiga = () => setShowTiga((prev) => !prev)

  const dapatkanSupById = (freeHere: string) => {
    const supplier = suppliersDatas?.find(
      (supplier) => supplier._id === freeHere
    )
    return supplier ? supplier.nama_supplier : ''
  }
  //-----------------------toggle end--------------------------------------------------------------

  const [bentuk] = Form.useForm()
  const { data, isLoading } = useGetHargasQuery()
  const { data: suppliersDatas } = useGetSuppliersQuery()

  const updateHargaMutation = useUpdateHargaMutation()
  const deleteHargaMutation = useDeleteHargaMutation()

  const [editingKey, setEditingKey] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<Harga[]>(data || [])

  const isEditing = (rekamHereOnly: Harga) => rekamHereOnly._id === editingKey

  const edit = (justRecordHere: Harga) => {
    bentuk.setFieldsValue({ ...justRecordHere })
    setEditingKey(justRecordHere._id)
  }
  const cancel = () => {
    setEditingKey('')
  }
  const save = async (serek: string) => {
    try {
      const row = await bentuk.validateFields()
      await updateHargaMutation.mutateAsync({ ...row, _id: serek })
      setEditingKey('')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }
  const handleDelete = async (gembok: string) => {
    try {
      await deleteHargaMutation.mutateAsync(gembok)
    } catch (ellor) {
      console.log(ellor)
    }
  }

  const handleSearch = (syarat: string) => {
    setSearchTerm(syarat)
  }

  useEffect(() => {
    if (data) {
      setFilteredData(
        data.filter((kedoakm) =>
          Object.values(kedoakm).some((val) =>
            val.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      )
    }
  }, [data, searchTerm])

  return (
    <Form form={bentuk} component={false}>
      <ToggleHarga
        onClick={() => navigate('/form-harga')}
        buttonText=" + Harga"
        showIdH={showIdH}
        showA={showA}
        showTiga={showTiga}
        toggleshowIdH={toggleshowIdH}
        toggleshowA={toggleshowA}
        toggleShowTiga={toggleShowTiga}
      />
      <Search onSearch={handleSearch} />
      <HargaTable
        form2hereOneAtPage={bentuk}
        asal={filteredData}
        penyuplay={suppliersDatas || []}
        isLoading={isLoading}
        editingKey={editingKey}
        isEditing={isEditing}
        save={save}
        cancel={cancel}
        edit={edit}
        handleDelete={handleDelete}
        dapatkanSupById={dapatkanSupById}
        showIdH={showIdH}
        showA={showA}
        showTiga={showTiga}
      />
    </Form>
  )
}

export default HargaPage
