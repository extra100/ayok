import React, { useEffect, useState } from 'react'
import { Form } from 'antd'

import { Pelanggan } from '../../types/Pelanggan'
import { useNavigate } from 'react-router-dom'
import Search from '../Search'
import PelangganTable from './PelangganTable'
import TogglePelanggan from './TogglePelanggan'
import {
  useDeletePelangganMutation,
  useGetPelanggansQuery,
  useUpdatePelangganMutation,
} from '../../hooks/pelangganHooks'
import { useGetHargasQuery } from '../../hooks/hargaHooks'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import { useGetUsahasQuery } from '../../hooks/usahaHooks'
import TypeKontakForm from '../typeKontak/typeKontak'

const PelangganPage: React.FC = () => {
  const navigate = useNavigate()
  //-----------------------toggle start--------------------------------------------------------------
  const [showIdH, setshowIdH] = useState(true)
  const [showA, setshowA] = useState(true)
  const toggleshowIdH = () => setshowIdH((prev) => !prev)
  const toggleshowA = () => setshowA((prev) => !prev)

  const dapatkanSupById = (freeHere: string) => {
    const bebaskan = hargasData?.find((bebaskan) => bebaskan._id === freeHere)
    return bebaskan ? bebaskan.jenis_harga : ''
  }

  const dapatkanOutById = (freeHere: string) => {
    const terbebas = outletsData?.find((terbebas) => terbebas._id === freeHere)
    return terbebas ? terbebas.nama_outlet : ''
  }

  const dapatkanUsaById = (freeHere: string) => {
    const terbebas = usahasData?.find((terbebas) => terbebas._id === freeHere)
    return terbebas ? terbebas.nama_usaha : ''
  }
  //-----------------------toggle end--------------------------------------------------------------
  const { data: hargasData } = useGetHargasQuery()
  const { data: outletsData } = useGetoutletsQuery()
  const { data: usahasData } = useGetUsahasQuery()

  const [bentuk] = Form.useForm()

  const { data, isLoading } = useGetPelanggansQuery()
  const updatePelangganMutation = useUpdatePelangganMutation()
  const deletePelangganMutation = useDeletePelangganMutation()

  const [editingKey, setEditingKey] = useState('')

  const isEditing = (rekamHereOnly: Pelanggan) =>
    rekamHereOnly._id === editingKey

  const edit = (justRecordHere: Pelanggan) => {
    bentuk.setFieldsValue({ ...justRecordHere })
    setEditingKey(justRecordHere._id)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (serek: string) => {
    try {
      const row = await bentuk.validateFields()
      await updatePelangganMutation.mutateAsync({ ...row, _id: serek })
      setEditingKey('')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const handleDelete = async (gembok: string) => {
    try {
      await deletePelangganMutation.mutateAsync(gembok)
    } catch (ellor) {
      console.log(ellor)
    }
  }

  //-----------------------search start--------------------------------------------------------------
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<Pelanggan[]>(data || [])

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
  //-----------------------search end--------------------------------------------------------------

  return (
    <Form form={bentuk} component={false}>
      <TogglePelanggan
        onClick={() => navigate('/form-pelanggan')}
        buttonText=" + Pelanggan"
        showIdH={showIdH}
        showA={showA}
        toggleshowIdH={toggleshowIdH}
        toggleshowA={toggleshowA}
      />
      <Search onSearch={handleSearch} />
      <PelangganTable
        form2hereOneAtPage={bentuk}
        asal={filteredData}
        price={hargasData || []}
        outlet={outletsData || []}
        struggle={usahasData || []}
        isLoading={isLoading}
        editingKey={editingKey}
        isEditing={isEditing}
        save={save}
        cancel={cancel}
        edit={edit}
        handleDelete={handleDelete}
        dapatkanSupById={dapatkanSupById}
        dapatkanOutById={dapatkanOutById}
        dapatkanUsaById={dapatkanUsaById}
        showIdH={showIdH}
        showA={showA}
      />
    </Form>
  )
}

export default PelangganPage
