import { Table, Input, Button, Dropdown, Menu } from 'antd'
import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import {
  useGetPindahDetailQuery,
  useUpdatePindahMutation,
} from '../../hooks/pindahHooks'
import { Pindah } from '../../types/Pindah'
import { MoreOutlined } from '@ant-design/icons'
import PrintComponent from '../printcoba/PrintComponent'
import { useGetStoksQuery, useUpdateStokMutations } from '../../hooks/stokHooks'
import UserContext from '../../contexts/UserContext'
import { Stok } from '../../types/Stok'
import {
  useGetKopiPindahDetailQuery,
  useUpdateKopiPindahMutation,
} from '../../hooks/kopiPindahHooks'
import { KopiPindah } from '../../types/KopiPindah'

const ProsesPindahForm = () => {
  const { id_pindah } = useParams()
  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  let idOutletLoggedIn = ''

  if (user) {
    idOutletLoggedIn = user.id_outlet
  }

  const { data: pindahs } = useGetPindahDetailQuery(id_pindah as string)
  const { data: kopians } = useGetKopiPindahDetailQuery(id_pindah as string)

  const mutation = useUpdatePindahMutation()
  const updateKopian = useUpdateKopiPindahMutation()

  const { data: stokku } = useGetStoksQuery()
  const stoks = useUpdateStokMutations()

  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<Pindah[]>([])
  const [hasError, setHasError] = useState<boolean[]>([])
  const [inputQtyBeri, setInputQtyBeri] = useState('')

  // const [editedDataText, setEditedDataText] = useState<string>('')
  // const [pindahsText, setPindahsText] = useState<string>('')
  // const [kopiansText, setKopiansText] = useState<string>('')
  // const [setress, setSetress] = useState<string>('')

  const [editedQtyBeriIndex, setEditedQtyBeriIndex] = useState(-1)

  const handleEditChange = (
    value: string,
    field: keyof Pindah,
    index: number
  ) => {
    if (editedData) {
      const updatedData = [...editedData]
      ;(updatedData[index][field] as any) = parseFloat(value) || 0

      if (field === 'qty_minta' || field === 'qty_beri') {
        const qtyMinta = updatedData[index].qty_minta || 0
        const newQtyBeri = parseFloat(value || '0') as number

        ;(updatedData[index].sisa_minta as any) = qtyMinta - newQtyBeri

        kopians?.forEach((kopian) => {
          if (kopian.id_data_barang === updatedData[index].id_data_barang) {
            kopian.qty_beri = newQtyBeri.toString()
          }
        })

        setEditedData(updatedData)
        updateKopian.mutate(kopians!)

        if (field === 'qty_beri') {
          setInputQtyBeri(value)
          setEditedQtyBeriIndex(index)
          const newHasError = [...hasError]
          newHasError[index] = false
          setHasError(newHasError)
        }
      }
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSimpan = async () => {
    const stokToUpdate: Stok[] = []

    editedData.forEach(async (pindahBaris, index) => {
      if (index === editedQtyBeriIndex) {
        const qtyKopianFromKopians = parseFloat(
          kopians?.find(
            (kopian) =>
              kopian.id_data_barang === pindahBaris.id_data_barang &&
              kopian.id_outlet_dari === idOutletLoggedIn
          )?.qty_beri || '0'
        )
        console.log('qty beri kopian', qtyKopianFromKopians)

        if (qtyKopianFromKopians !== parseFloat(inputQtyBeri)) {
          const stokBaris = stokku?.find(
            (stok) =>
              stok.id_data_barang === pindahBaris.id_data_barang &&
              stok.id_outlet === idOutletLoggedIn
          )

          if (stokBaris) {
            const perubahanJumlahStok =
              pindahBaris.qty_beri || 0 - qtyKopianFromKopians
            console.log('Perubahan jumlah stok:', perubahanJumlahStok)

            stokBaris.jumlah_stok -= perubahanJumlahStok

            stokToUpdate.push(stokBaris)
          }
        }
      }
    })

    try {
      await stoks.mutate(stokToUpdate)
    } catch (error) {}

    if (pindahs) {
      try {
        await mutation.mutate(pindahs)
        await updateKopian.mutate(editedData as any)
        console.log('Data setelah disimpan - pindahs:', pindahs)
        console.log('Data setelah disimpan - kopians:', kopians)

        setEditedQtyBeriIndex(-1)
        setInputQtyBeri('') // Setel inputQtyBeri ke nilai kosong
      } catch (error) {}
    } else {
    }
  }

  const idOutletDari =
    pindahs && pindahs.length > 0 ? pindahs[0].id_outlet_dari : ''
  const idOutletTujuan =
    pindahs && pindahs.length > 0 ? pindahs[0].id_outlet_tujuan : ''
  const tanggalan = pindahs && pindahs.length > 0 ? pindahs[0].tanggal : ''
  useEffect(() => {
    if (pindahs && kopians) {
      const updatedKopians = [...pindahs]
      setEditedData(updatedKopians)
    }
  }, [pindahs])
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
      title: 'Qty Beri',
      dataIndex: 'qty_beri',
      key: 'qty_beri',
      render: (text: any, record: any, index: any) => (
        <div>
          <Input
            value={text}
            onChange={(e) => {
              if (isEditing) {
                const newQtyBeri = parseFloat(e.target.value || '0')
                const qtyMinta = parseFloat(record.qty_minta || '0')

                if (newQtyBeri > qtyMinta) {
                  const newHasError = [...hasError]
                  newHasError[index] = true
                  setHasError(newHasError)
                } else {
                  const newHasError = [...hasError]
                  newHasError[index] = false
                  setHasError(newHasError)
                  record.qty_beri = newQtyBeri

                  handleEditChange(e.target.value, 'qty_beri', index)
                }
              }
            }}
            disabled={!isEditing}
          />
          {hasError[index] && (
            <div style={{ color: 'red' }}>Melebihi Permintaan</div>
          )}
        </div>
      ),
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
      <div>
        <span>
          Qty Beri yang Diketik: {inputQtyBeri} (Index Baris:{' '}
          {editedQtyBeriIndex})
        </span>
      </div>
      <div>
        {' '}
        <span>Qty Beri dari Kopian: {kopians && kopians[0]?.qty_beri}</span>
      </div>

      <span>{id_pindah}</span>
      <div>{idOutletDari}</div>
      <div>{idOutletTujuan}</div>
      <div>{tanggalan}</div>

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
      <Button type="primary" onClick={handleSimpan}>
        Simpan se
      </Button>
      {/* <div>
        <h4>Data Edited:</h4>
        <pre>{editedDataText}</pre>
      </div>
      <div>
        <h4>Data Pindahs:</h4>
        <pre>{pindahsText}</pre>
      </div>
      <div>
        <h4>Data Kopians:</h4>
        <pre>{kopiansText}</pre>
      </div> */}
    </div>
  )
}

export default ProsesPindahForm
