import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Button, Form, Input } from 'antd'
import {
  useGetStoksQuery,
  useUpdateStokMutation,
  useDeleteStokMutation,
  useImportStoksMutation,
} from '../../hooks/stokHooks'
import { useGetProductsQuery } from '../../hooks/productHooks'
import { Stok } from '../../types/Stok'
import { useNavigate } from 'react-router-dom'
import Search from '../Search'
import StokTable from './StokTable'
import ToggleStok from './ToggleStok'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import axios from 'axios'
import UserContext from '../../contexts/UserContext'

const StokPage: React.FC = () => {
  const navigate = useNavigate()

  const [showIdH, setshowIdH] = useState(true)
  const [showA, setshowA] = useState(true)
  const toggleshowIdH = () => setshowIdH((prev) => !prev)
  const toggleshowA = () => setshowA((prev) => !prev)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const importStoksMutation = useImportStoksMutation()
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (selectedFile) {
      importStoksMutation.mutate(selectedFile)
    }
  }

  const [bentuk] = Form.useForm()
  const { data, isLoading } = useGetStoksQuery()
  const { data: goodsDatas } = useGetProductsQuery()
  const { data: outletsData } = useGetoutletsQuery()

  useEffect(() => {}, [goodsDatas])

  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  if (user) {
  }

  const convertToCSV = (data: any) => {
    const csv = [
      'id_stok,jumlah_stok,id_data_barang,id_outlet,id_usaha', // CSV header
      ...data.map((stok: any) =>
        [
          stok.id_stok,
          stok.jumlah_stok,
          stok.id_data_barang,
          stok.id_outlet,
          stok.id_usaha,
        ].join(',')
      ),
    ].join('\n')
    return csv
  }

  const exportToCSV = () => {
    if (data && user) {
      let filteredData
      if (user.isAdmin) {
        filteredData = data
      } else {
        filteredData = data.filter((stok) => stok.id_outlet === user.id_outlet)
      }

      const csvData = convertToCSV(filteredData)
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'stok_data.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  const updateStokMutation = useUpdateStokMutation()
  const deleteStokMutation = useDeleteStokMutation()
  const [editingKey, setEditingKey] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<Stok[]>(data || [])
  const isEditing = (rekamHereOnly: Stok) => rekamHereOnly._id === editingKey
  const edit = (justRecordHere: Stok) => {
    bentuk.setFieldsValue({ ...justRecordHere })
    setEditingKey(justRecordHere._id)
  }
  const cancel = () => {
    setEditingKey('')
  }
  const save = async (serek: string) => {
    try {
      const row = await bentuk.validateFields()
      await updateStokMutation.mutateAsync({ ...row, _id: serek })
      setEditingKey('')
    } catch (errInfo) {}
  }
  const handleDelete = async (gembok: string) => {
    try {
      await deleteStokMutation.mutateAsync(gembok)
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

  return (
    <Form form={bentuk} component={false}>
      <ToggleStok
        onClick={() => navigate('/form-stok')}
        buttonText=" + Stok"
        showIdH={showIdH}
        showA={showA}
        toggleshowIdH={toggleshowIdH}
        toggleshowA={toggleshowA}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Search onSearch={handleSearch} />
        <form
          onSubmit={handleFormSubmit}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Input type="file" onChange={handleFileChange} />
          <Button type="primary" htmlType="submit">
            Upload CSV
          </Button>
        </form>
        <Form form={bentuk} component={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={exportToCSV}>Export CSV</Button>
          </div>
        </Form>
      </div>
      <StokTable
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

export default StokPage
