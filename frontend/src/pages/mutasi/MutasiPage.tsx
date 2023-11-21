import React, { useEffect, useState } from 'react'
import { Form } from 'antd'

import { Mutasi } from '../../types/Mutasi'
import { useNavigate } from 'react-router-dom'
import Search from '../Search'
import MutasiTable from './MutasiTable'
// import ToggleMutasi from './ToggleMutasi'

import { useGetoutletsQuery } from '../../hooks/outletHooks'
import {
  useDeleteMutasiMutation,
  useGetMutasisQuery,
  useUpdateMutasiMutation,
} from '../../hooks/mutasiHooks'

const MutasiPage: React.FC = () => {
  const navigate = useNavigate()
  //-----------------------toggle start--------------------------------------------------------------
  const [showIdH, setshowIdH] = useState(true)
  const [showA, setshowA] = useState(true)
  const toggleshowIdH = () => setshowIdH((prev) => !prev)
  const toggleshowA = () => setshowA((prev) => !prev)

  const dapatkanOutById = (freeHere: string) => {
    const terbebas = outletsData?.find((terbebas) => terbebas._id === freeHere)
    return terbebas ? terbebas.nama_outlet : ''
  }

  //-----------------------toggle end--------------------------------------------------------------

  const { data: outletsData } = useGetoutletsQuery()

  const [bentuk] = Form.useForm()

  const { data, isLoading } = useGetMutasisQuery()
  const updateMutasiMutation = useUpdateMutasiMutation()
  const deleteMutasiMutation = useDeleteMutasiMutation()

  const [editingKey, setEditingKey] = useState('')

  const isEditing = (rekamHereOnly: Mutasi) =>
    rekamHereOnly.id_mutasi === editingKey

  const edit = (justRecordHere: Mutasi) => {
    bentuk.setFieldsValue({ ...justRecordHere })
    setEditingKey(justRecordHere.id_mutasi)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (serek: string) => {
    try {
      const row = await bentuk.validateFields()
      await updateMutasiMutation.mutateAsync({ ...row, _id: serek })
      setEditingKey('')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const handleDelete = async (gembok: string) => {
    try {
      await deleteMutasiMutation.mutateAsync(gembok)
    } catch (ellor) {
      console.log(ellor)
    }
  }

  //-----------------------search start--------------------------------------------------------------
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<Mutasi[]>(data || [])
  const handleSearch = (syarat: string) => {
    setSearchTerm(syarat)
  }
  useEffect(() => {
    if (data) {
      setFilteredData(
        data.filter((kedoakm) =>
          Object.values(kedoakm).some((val: any) =>
            val.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      )
    }
  }, [data, searchTerm])
  //-----------------------search end--------------------------------------------------------------

  return (
    <Form form={bentuk} component={false}>
      {/* <ToggleMutasi
        onClick={() => navigate('/form-pelanggan')}
        buttonText=" + Mutasi"
        showIdH={showIdH}
        showA={showA}
        toggleshowIdH={toggleshowIdH}
        toggleshowA={toggleshowA}
      /> */}
      <Search onSearch={handleSearch} />
      <MutasiTable
        form2hereOneAtPage={bentuk}
        asal={filteredData}
        outlet={outletsData || []}
        isLoading={isLoading}
        editingKey={editingKey}
        isEditing={isEditing}
        save={save}
        cancel={cancel}
        edit={edit}
        handleDelete={handleDelete}
        dapatkanOutById={dapatkanOutById}
        showIdH={showIdH}
        showA={showA}
      />
    </Form>
  )
}

export default MutasiPage
