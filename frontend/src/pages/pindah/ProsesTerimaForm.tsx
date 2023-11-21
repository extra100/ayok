import { Table, Input, Button, Menu } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import UserContext from '../../contexts/UserContext'
import {
  useGetPindahDetailQuery,
  useUpdatePindahMutation,
} from '../../hooks/pindahHooks'
import {
  useGetStoksQuery,
  useUpdateStokMutation,
  useUpdateStokMutations,
} from '../../hooks/stokHooks'
import { Pindah } from '../../types/Pindah'
import PrintComponent from '../printcoba/PrintComponent'

const ProsesTerimaForm = () => {
  const { id_pindah } = useParams()
  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  let idOutletLoggedIn = ''

  if (user) {
    idOutletLoggedIn = user.id_outlet
  }

  const mutation = useUpdatePindahMutation()
  const handleEditClick = () => {
    setIsEditing(true)
  }
  const { data: pindahs } = useGetPindahDetailQuery(id_pindah as string)
  console.log(pindahs)

  const { data: stokku } = useGetStoksQuery()
  const stoks = useUpdateStokMutations()
  const qtyBeriHistory: Record<string, number> = {}

  const handleSimpan = async () => {
    if (pindahs && pindahs.length > 0 && stokku) {
      const updatedStokku = [...stokku]

      pindahs.forEach((pindah) => {
        const matchingStokIndex = updatedStokku.findIndex(
          (stok) =>
            stok.id_data_barang === pindah.id_data_barang &&
            stok.id_outlet === idOutletLoggedIn
        )

        if (matchingStokIndex !== -1) {
          const previousQtyBeri = qtyBeriHistory[pindah.id_data_barang] || 0
          const currentQtyBeri = pindah.qty_beri

          if (currentQtyBeri > previousQtyBeri) {
            const qtyChange = currentQtyBeri - previousQtyBeri

            updatedStokku[matchingStokIndex].jumlah_stok += qtyChange

            qtyBeriHistory[pindah.id_data_barang] = currentQtyBeri
          }
        }
      })

      try {
        await stoks.mutateAsync(updatedStokku)

        mutation.mutateAsync(editedData).then(() => {
          setIsEditing(false)
        })
      } catch (error) {
        console.error('Gagal mengupdate stok:', error)
      }
    }
  }

  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<Pindah[]>(pindahs ?? [])
  useEffect(() => {
    if (pindahs) {
      setEditedData(pindahs)
    }
  }, [pindahs])

  const idOutletDari =
    pindahs && pindahs.length > 0 ? pindahs[0].id_outlet_dari : ''
  const idOutletTujuan =
    pindahs && pindahs.length > 0 ? pindahs[0].id_outlet_tujuan : ''
  const tanggalan = pindahs && pindahs.length > 0 ? pindahs[0].tanggal : ''
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
      title: 'Nama Barang',
      dataIndex: 'id_data_barang',
      key: 'id_data_barang',
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: 'qty Minta',
      dataIndex: 'qty_minta',
      key: 'qty_minta',
      render: (text: any) => <span>{text}</span>,
    },

    {
      title: 'qty beri',
      dataIndex: 'qty_beri',
      key: 'qty_beri',
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: 'qty Sisa',
      dataIndex: 'sisa_minta',
      key: 'sisa_minta',
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: 'Ket',
      dataIndex: 'ket',
      key: 'ket',
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: Pindah) => {
        const qtyBeri = record.qty_beri
        const sisaMinta = record.sisa_minta
        let statusText = ''
        let statusColor = ''

        if (
          !isNaN(qtyBeri) &&
          qtyBeri > 0 &&
          (isNaN(sisaMinta) || sisaMinta === 0)
        ) {
          statusText = 'Completed'
          statusColor = 'green'
        } else if (!isNaN(qtyBeri) && qtyBeri > 0) {
          statusText = 'Sebagian'
          statusColor = 'blue'
        } else {
          statusText = 'Checking...'
          statusColor = 'red'
        }

        return <span style={{ color: statusColor }}>{statusText}</span>
      },
    },
  ]

  return (
    <div>
      <span>{id_pindah}</span>
      <div>{idOutletDari}</div>
      <div>{idOutletTujuan}</div>
      <div>{tanggalan}</div>
      <Table
        dataSource={editedData}
        columns={columns}
        rowKey="_id"
        pagination={false}
      />
      <Button type="primary" onClick={handleSimpan}>
        Masukkan Stok
      </Button>{' '}
    </div>
  )
}

export default ProsesTerimaForm
