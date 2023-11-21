import React, { useEffect, useState } from 'react'
import { Form } from 'antd'
import {
  useGetBanksQuery,
  useUpdateBankMutation,
  useDeleteBankMutation,
} from '../../hooks/bankHooks'

import { Bank } from '../../types/Bank'
import { useNavigate } from 'react-router-dom'
import Search from '../Search'
import BankTable from './BankTable'
import ToggleBank from './ToggleBank'

const BankPage: React.FC = () => {
  const navigate = useNavigate()
  //-----------------------toggle start--------------------------------------------------------------
  const [showIdH, setshowIdH] = useState(true)
  const [showA, setshowA] = useState(true)
  const [showTiga, setShowTiga] = useState(true)
  const toggleshowIdH = () => setshowIdH((prev) => !prev)
  const toggleshowA = () => setshowA((prev) => !prev)
  const toggleShowTiga = () => setShowTiga((prev) => !prev)

  const [bentuk] = Form.useForm()
  const { data, isLoading } = useGetBanksQuery()

  const updateBankMutation = useUpdateBankMutation()
  const deleteBankMutation = useDeleteBankMutation()

  const [editingKey, setEditingKey] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<Bank[]>(data || [])

  const isEditing = (rekamHereOnly: Bank) => rekamHereOnly._id === editingKey

  const edit = (justRecordHere: Bank) => {
    bentuk.setFieldsValue({ ...justRecordHere })
    setEditingKey(justRecordHere._id)
  }
  const cancel = () => {
    setEditingKey('')
  }
  const save = async (serek: string) => {
    try {
      const row = await bentuk.validateFields()
      await updateBankMutation.mutateAsync({ ...row, _id: serek })
      setEditingKey('')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }
  const handleDelete = async (gembok: string) => {
    try {
      await deleteBankMutation.mutateAsync(gembok)
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
      <ToggleBank
        onClick={() => navigate('/form-bank')}
        buttonText=" + Bank"
        showIdH={showIdH}
        showA={showA}
        showTiga={showTiga}
        toggleshowIdH={toggleshowIdH}
        toggleshowA={toggleshowA}
        toggleShowTiga={toggleShowTiga}
      />
      <Search onSearch={handleSearch} />
      <BankTable
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
        showTiga={showTiga}
      />
    </Form>
  )
}

export default BankPage
