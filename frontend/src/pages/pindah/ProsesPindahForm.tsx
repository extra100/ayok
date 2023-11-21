import { Table, Input, Button, Dropdown, Menu } from 'antd'
import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import {
  useAddPindahMutation,
  useGetPindahDetailQuery,
  useUpdatePindahMutation,
} from '../../hooks/pindahHooks'
import { Pindah } from '../../types/Pindah'
import { MoreOutlined } from '@ant-design/icons'
import PrintComponent from '../printcoba/PrintComponent'
import { useGetStoksQuery, useUpdateStokMutations } from '../../hooks/stokHooks'
import UserContext from '../../contexts/UserContext'
import { Stok } from '../../types/Stok'
import { useGetProductsQuery } from '../../hooks/productHooks'
import { useAddCicilanMutasiMutation } from '../../hooks/cicilanMutasiHooks'
import { useAddKopiPindahMutation } from '../../hooks/kopiPindahHooks'
const ProsesPindahFormKledo = () => {
  const { id_pindah } = useParams()
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = ''
  if (user) {
    idOutletLoggedIn = user.id_outlet
  }
  const { data: pindahs } = useGetPindahDetailQuery(id_pindah as string)

  const [editedData, setEditedData] = useState<Pindah[]>([])
  useEffect(() => {
    if (pindahs) {
      setEditedData(pindahs)
    }
  }, [pindahs])

  const cicilanDataMutasis = editedData.map((item) => ({
    id_pindah: item.id_pindah || '',
    qty_minta: item.qty_minta || '',
    qty_beri: item.qty_beri || '',
    sisa_minta: item.sisa_minta || '',
    id_data_barang: item.id_data_barang || '',
    id_outlet: item.id_outlet_dari || '',
    id_outlet_tujuan: item.id_outlet_tujuan || '',
    tanggal: item.tanggal || '',
    ket: item.ket || '',
  }))

  const [inputQtyBeri, setInputQtyBeri] = useState('')
  const [qtyInputan, setQtyInputan] = useState<number>(0)

  const [isEditing, setIsEditing] = useState(false)
  const [editedQtyBeriIndex, setEditedQtyBeriIndex] = useState(-1)

  const { mutate: addCicilanMutasi } = useAddKopiPindahMutation()

  const handleEditClick = () => {
    setIsEditing(true)
  }
  const { data: products } = useGetProductsQuery()

  const mutation = useUpdatePindahMutation()
  const { data: stokku } = useGetStoksQuery()
  const stoks = useUpdateStokMutations()
  const [idePindah, setIdePindah] = useState()
  const adePindah = idePindah
  console.log(adePindah, 'idePindah')

  const handleQtyInputanChange = (index: number, newValue: number) => {
    setEditedData((prevData) =>
      prevData.map((item, itemIndex) => {
        if (itemIndex === index) {
          const qtyInputan = newValue || '0'
          if (pindahs && pindahs[index]) {
            const qtyBeriDatabase = pindahs[index].qty_beri || '0'
            const qtyMinta = pindahs[index].qty_minta || '0'
            const idPindah = pindahs[index].id_pindah || '0'
            setIdePindah(idPindah as any)
            const beriDatabase = Number(qtyBeriDatabase) + Number(qtyInputan)
            const sisaMinta = Number(qtyMinta) - beriDatabase

            pindahs[index].sisa_minta = sisaMinta
            setQtyInputan(qtyInputan as any)

            return {
              ...item,
              qty_inputan: newValue,
              qty_beri: beriDatabase,
              sisa_minta: sisaMinta,
            }
          }
        }
        return item
      })
    )
  }

  const handleSimpan = async () => {
    const stokToUpdate: Stok[] = []

    editedData.forEach((item) => {
      if (stokku) {
        const stokChange = item.qty_inputan || '0'
        const updatedStokku = stokku.map((stok) => {
          if (
            stok.id_data_barang === item.id_data_barang &&
            stok.id_outlet === item.id_outlet_dari
          ) {
            stok.jumlah_stok = stok.jumlah_stok - stokChange
          }
          if (
            stok.id_data_barang === item.id_data_barang &&
            stok.id_outlet === item.id_outlet_tujuan
          ) {
            stok.jumlah_stok = stok.jumlah_stok + stokChange
          }
          return stok
        })
        stokToUpdate.push(...updatedStokku)
      }
    })

    try {
      const updatedData = await mutation.mutateAsync(editedData)

      await stoks.mutate(stokToUpdate)

      if (mutation.isError) {
      } else {
        console.log('Data updated successfully:', updatedData)

        setIsEditing(false)
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  const menu = (
    <Menu>
      <Menu.Item key="edit" onClick={handleEditClick}>
        Edit
      </Menu.Item>
      <Menu.Item key="print">
        <PrintComponent />
      </Menu.Item>
    </Menu>
  )

  const columns = [
    {
      title: 'Nama Barang dsgrgr',
      dataIndex: 'id_data_barang',
      key: 'id_data_barang',
      render: (text: any) => {
        const product = products?.find(
          (product) => product.id_data_barang === text
        )
        return <span>{product?.nama_barang || 'Tidak Ditemukan'}</span>
      },
    },
    {
      title: 'qty Minta',
      dataIndex: 'qty_minta',
      key: 'qty_minta',
      render: (text: any) => <span>{text}</span>,
    },

    {
      title: 'Inputan',
      dataIndex: 'qty_inputan',
      key: 'qty_inputan',
      render: (text: string, record: Pindah, index: number) => {
        if (isEditing) {
          const sisaMinta = pindahs?.[index]?.sisa_minta || '0'

          const isError = sisaMinta < 0
          const errorMessage = isError ? 'Inputan melebihi permintaan!' : ''

          return (
            <div>
              <Input
                value={text}
                onChange={(e) =>
                  handleQtyInputanChange(index, e.target.value as any)
                }
              />
              <span style={{ color: 'red' }}>{errorMessage}</span>
            </div>
          )
        }

        return text
      },
    },

    {
      title: 'qty Beri',
      dataIndex: 'qty_beri',
      key: 'qty_beri',
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: 'Sisa Minta',
      dataIndex: 'sisa_minta',
      key: 'sisa_minta',
      render: (text: any) => <span>{text}</span>,
    },
  ]
  return (
    <div>
      <Dropdown overlay={menu} placement="bottomRight">
        <Button>
          <MoreOutlined />
        </Button>
      </Dropdown>
      <Table
        dataSource={editedData}
        columns={columns}
        rowKey="_id"
        pagination={false}
      />
      <Button
        type="primary"
        onClick={() => {
          const cicilanDataMutasiArray = editedData.map((acted) => ({
            id_pindah: acted.id_pindah || '',
            qty_minta: acted.qty_minta || '',
            qty_beri: acted.qty_beri || '',
            sisa_minta: acted.sisa_minta || '',
            id_data_barang: acted.id_data_barang || '',
            id_outlet: acted.id_outlet_dari || '',
            id_outlet_tujuan: acted.id_outlet_tujuan || '',
            tanggal: acted.tanggal || '',
            ket: acted.ket || '',
          }))

          addCicilanMutasi(cicilanDataMutasiArray as any)

          handleSimpan()
        }}
        disabled={editedData.some((item) => {
          const sisaMinta = item.sisa_minta || '0'
          return sisaMinta < 0
        })}
      >
        Simpan
      </Button>
    </div>
  )
}
export default ProsesPindahFormKledo
