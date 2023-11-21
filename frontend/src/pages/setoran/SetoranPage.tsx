import React, { useEffect, useState } from 'react'
import { Form } from 'antd'

import { Setoran } from '../../types/Setoran'
import { useNavigate } from 'react-router-dom'
import Search from '../Search'
import SetoranTable from './SetoranTable'
import {
  useDeleteSetoranMutation,
  useGetSetoransQuery,
  useUpdateSetoranMutation,
} from '../../hooks/setoranHooks'
import ToggleSetoran from './ToggleSetoran'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import { useGetBanksQuery } from '../../hooks/bankHooks'
import { useGetProductsQuery } from '../../hooks/productHooks'

const SetoranPage: React.FC = () => {
  const navigate = useNavigate()
  //-----------------------toggle start--------------------------------------------------------------
  const [showIdH, setshowIdH] = useState(true)
  const [showA, setshowA] = useState(true)
  const [showTiga, setShowTiga] = useState(true)
  const toggleshowIdH = () => setshowIdH((prev) => !prev)
  const toggleshowA = () => setshowA((prev) => !prev)
  const toggleShowTiga = () => setShowTiga((prev) => !prev)

  const dapatkanSupById = (freeHere: string) => {
    const acok = suppliersDatas?.find((acok) => acok._id === freeHere)
    return acok ? acok.nama_outlet : ''
  }

  const dapatkanBankById = (freeHere: string) => {
    const bank = banksDatas?.find((bank) => bank._id === freeHere)
    return bank ? bank.nama_akun : ''
  }

  const dapatkanProductById = (freeHere: string) => {
    const product = productsDatas?.find((product) => product._id === freeHere)
    return product ? product.nama_barang : ''
  }
  //-----------------------toggle end--------------------------------------------------------------

  const [bentuk] = Form.useForm()
  const { data, isLoading } = useGetSetoransQuery()
  const { data: suppliersDatas } = useGetoutletsQuery()
  const { data: banksDatas } = useGetBanksQuery()
  const { data: productsDatas } = useGetProductsQuery()
  const updateSetoranMutation = useUpdateSetoranMutation()
  const deleteSetoranMutation = useDeleteSetoranMutation()

  const [editingKey, setEditingKey] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<Setoran[]>(data || [])

  const isEditing = (rekamHereOnly: Setoran) => rekamHereOnly._id === editingKey

  const edit = (justRecordHere: Setoran) => {
    bentuk.setFieldsValue({ ...justRecordHere })
    setEditingKey(justRecordHere._id)
  }
  const cancel = () => {
    setEditingKey('')
  }
  const save = async (serek: string) => {
    try {
      const row = await bentuk.validateFields()
      await updateSetoranMutation.mutateAsync({ ...row, _id: serek })
      setEditingKey('')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }
  const handleDelete = async (gembok: string) => {
    try {
      await deleteSetoranMutation.mutateAsync(gembok)
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
      <ToggleSetoran
        onClick={() => navigate('/form-setoran')}
        buttonText=" + Setoran"
        showIdH={showIdH}
        showA={showA}
        showTiga={showTiga}
        toggleshowIdH={toggleshowIdH}
        toggleshowA={toggleshowA}
        toggleShowTiga={toggleShowTiga}
      />
      <Search onSearch={handleSearch} />
      <SetoranTable
        form2hereOneAtPage={bentuk}
        asalan={filteredData}
        penyuplay={suppliersDatas || []}
        bankir={banksDatas || []}
        product={productsDatas || []}
        isLoading={isLoading}
        editingKey={editingKey}
        isEditing={isEditing}
        save={save}
        cancel={cancel}
        edit={edit}
        handleDelete={handleDelete}
        dapatkanSupById={dapatkanSupById}
        dapatkanBankById={dapatkanBankById}
        dapatkanProductById={dapatkanProductById}
        showIdH={showIdH}
        showA={showA}
        showTiga={showTiga}
      />
    </Form>
  )
}

export default SetoranPage
