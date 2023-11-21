import React, { useEffect, useState } from 'react'
import { Form } from 'antd'
import {
  useGetUsahasQuery,
  useUpdateUsahaMutation,
  useDeleteUsahaMutation,
} from '../../hooks/usahaHooks'
import { Usaha } from '../../types/Usaha'
import { useNavigate } from 'react-router-dom'
import Search from '../Search'
import UsahaTable from './UsahaTable'
import ToggleUsaha from './ToggleUsaha'

const UsahaPage: React.FC = () => {
  const navigate = useNavigate()
  //-----------------------toggle start--------------------------------------------------------------
  const [showIdH, setshowIdH] = useState(true)
  const [showA, setshowA] = useState(true)
  const toggleshowIdH = () => setshowIdH((prev) => !prev)
  const toggleshowA = () => setshowA((prev) => !prev)

  //   const dapatkanSupById = (freeHere: string) => {
  //     const supplier = suppliersDatas?.find(
  //       (supplier) => supplier._id === freeHere
  //     )
  //     return supplier ? supplier.nama_supplier : ''
  //   }
  //-----------------------toggle end--------------------------------------------------------------

  const [bentuk] = Form.useForm()
  const { data, isLoading } = useGetUsahasQuery()
  const updateUsahaMutation = useUpdateUsahaMutation()
  const deleteUsahaMutation = useDeleteUsahaMutation()

  const [editingKey, setEditingKey] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<Usaha[]>(data || [])

  const isEditing = (rekamHereOnly: Usaha) => rekamHereOnly._id === editingKey

  const edit = (justRecordHere: Usaha) => {
    bentuk.setFieldsValue({ ...justRecordHere })
    setEditingKey(justRecordHere._id)
  }
  const cancel = () => {
    setEditingKey('')
  }
  const save = async (serek: string) => {
    try {
      const row = await bentuk.validateFields()
      await updateUsahaMutation.mutateAsync({ ...row, _id: serek })
      setEditingKey('')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }
  const handleDelete = async (gembok: string) => {
    try {
      await deleteUsahaMutation.mutateAsync(gembok)
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
      <ToggleUsaha
        onClick={() => navigate('/form-usaha')}
        buttonText=" + Usaha"
        showIdH={showIdH}
        showA={showA}
        toggleshowIdH={toggleshowIdH}
        toggleshowA={toggleshowA}
      />
      <Search onSearch={handleSearch} />
      <UsahaTable
        form2hereOneAtPage={bentuk}
        asal={filteredData}
        isLoading={isLoading}
        editingKey={editingKey}
        isEditing={isEditing}
        save={save}
        cancel={cancel}
        edit={edit}
        handleDelete={handleDelete}
        showIdH={showIdH}
        showA={showA}
      />
    </Form>
  )
}

export default UsahaPage
