import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Button, Form, Input } from 'antd'

import { useGetProductsQuery } from '../../hooks/productHooks'
import { Pindah } from '../../types/Pindah'
import { useNavigate } from 'react-router-dom'
import Search from '../Search'
import PindahTable from './PindahTable'
import TogglePindah from './TogglePindah'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import axios from 'axios'
import UserContext from '../../contexts/UserContext'
import {
  useDeletePindahMutation,
  useGetPindahsQuery,
  useUpdatePindahMutation,
} from '../../hooks/pindahHooks'

const PindahPage: React.FC = () => {
  const navigate = useNavigate()

  const [showIdH, setshowIdH] = useState(true)
  const [showA, setshowA] = useState(true)
  const toggleshowIdH = () => setshowIdH((prev) => !prev)
  const toggleshowA = () => setshowA((prev) => !prev)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [bentuk] = Form.useForm()
  const { data, isLoading } = useGetPindahsQuery()
  const { data: goodsDatas } = useGetProductsQuery()
  const { data: outletsData } = useGetoutletsQuery()

  useEffect(() => {}, [goodsDatas])

  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  if (user) {
  }

  const updatePindahMutation = useUpdatePindahMutation()
  const deletePindahMutation = useDeletePindahMutation()
  const [editingKey, setEditingKey] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<Pindah[]>(data || [])
  const isEditing = (rekamHereOnly: Pindah) =>
    rekamHereOnly.id_pindah === editingKey
  const edit = (justRecordHere: Pindah) => {
    bentuk.setFieldsValue({ ...justRecordHere })
    setEditingKey(justRecordHere.id_pindah)
  }
  const cancel = () => {
    setEditingKey('')
  }
  const save = async (serek: string) => {
    try {
      const row = await bentuk.validateFields()
      await updatePindahMutation.mutateAsync({ ...row, _id: serek })
      setEditingKey('')
    } catch (errInfo) {}
  }
  const handleDelete = async (gembok: string) => {
    try {
      await deletePindahMutation.mutateAsync(gembok)
    } catch (ellor) {}
  }

  const dapatkanBarang = (freeHere: string) => {
    const bereng = goodsDatas?.find((bereng) => bereng._id === freeHere)

    return bereng ? bereng.nama_barang : ''
  }
  const dapatkanOutlet = (freeHere: string) => {
    const toki = outletsData?.find((toki) => toki._id === freeHere)
    return toki ? toki.nama_outlet : ''
  }

  useEffect(() => {
    if (goodsDatas) {
      if (goodsDatas.length > 0) {
      } else {
      }
    } else {
    }
  }, [goodsDatas])

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
  const handleAddPindahClick = () => {
    const prefix = 'MOVE'
    const randomNumber = Math.floor(Math.random() * 10000)
    const aneh = `${prefix}${randomNumber}`

    navigate('/form-pindah', { state: { aneh } })
  }

  const cekIn = () => {
    navigate('/terima')
  }
  const cekOut = () => {
    navigate('/pindah')
  }

  return (
    <Form form={bentuk} component={false}>
      <TogglePindah
        onClick={handleAddPindahClick}
        buttonText=" + Pindah"
        showIdH={showIdH}
        showA={showA}
        toggleshowIdH={toggleshowIdH}
        toggleshowA={toggleshowA}
      />

      <div>
        <Button onClick={cekIn} style={{ marginRight: 20 }}>
          Cek pemesanan
        </Button>
        <Button onClick={cekOut}>Eksekusi Order Masuk</Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Search onSearch={handleSearch} />
      </div>

      <PindahTable
        form2hereOneAtPage={bentuk}
        outlets={outletsData || []}
        asal={filteredData}
        stockist={goodsDatas || []}
        outletist={outletsData || []}
        isLoading={isLoading}
        editingKey={editingKey}
        isEditing={isEditing}
        save={save}
        cancel={cancel}
        edit={edit}
        handleDelete={handleDelete}
        dapatkanBAarById={dapatkanBarang}
        dapatkanOutlet={dapatkanOutlet}
        showIdH={showIdH}
        showA={showA}
      />
    </Form>
  )
}

export default PindahPage
