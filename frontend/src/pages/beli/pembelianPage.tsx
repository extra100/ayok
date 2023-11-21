// PembelianPage.tsx
import React, { useContext, useEffect, useState } from 'react'
import { Table, message } from 'antd'
import { Link } from 'react-router-dom'

import UserContext from '../../contexts/UserContext'
import { Pembelian } from '../../types/Pembelian'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import { useGetHargasQuery } from '../../hooks/hargaHooks'
import { useGetPembeliansQuery } from '../../hooks/pembelianHooks'
import { useGetSuppliersQuery } from '../../hooks/supplierHooks'

const PembelianPage = () => {
  const { data, isLoading } = useGetPembeliansQuery()
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  const [filteredData, setFilteredData] = useState<Pembelian[]>([])
  const { data: suppliers } = useGetSuppliersQuery()
  const { data: hargas } = useGetHargasQuery()

  useEffect(() => {
    if (user && data) {
      let hasilFilterOutlet
      if (user.isAdmin) {
        hasilFilterOutlet = data
      } else {
        hasilFilterOutlet = data.filter((d) => d.id_outlet === user.id_outlet)
      }

      const hasilFilterTotal = hasilFilterOutlet.filter(
        (d) => d.total_semua !== '0'
      )

      const hasilFilterBayarPiutang = hasilFilterTotal.filter(
        (d) => !(d.bayar === '0' && d.piutang === '0')
      )

      setFilteredData(hasilFilterBayarPiutang)
    }
  }, [data, user])

  const columns = [
    {
      title: 'Total Semua',
      dataIndex: 'total_semua',
      key: 'total_semua',
    },
    {
      title: 'Piutang',
      dataIndex: 'piutang',
      key: 'piutang',
    },
    {
      title: 'Nama Supplier dsggd',
      dataIndex: 'id_supplier',
      key: 'nama_supplier',
      render: (id_supplier: string) => {
        const outlet = suppliers?.find((outlet) => outlet._id === id_supplier)
        return outlet ? outlet.nama_supplier : '-'
      },
    },

    {
      title: 'Inv',
      dataIndex: 'inv',
      key: 'inv',
      render: (text: any, record: any) => (
        <Link to={`/beliDetail/${record.id_beli}`}>{text}</Link>
      ),
    },
  ]

  return (
    <div>
      <Table columns={columns} dataSource={filteredData} rowKey="id" />
    </div>
  )
}

export default PembelianPage
