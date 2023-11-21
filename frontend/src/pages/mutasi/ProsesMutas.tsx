import React from 'react'
import { Table } from 'antd'

import { useGetMutasisQuery } from '../../hooks/mutasiHooks'

const ProsesMutasi = () => {
  const { data: mutasis } = useGetMutasisQuery()

  const columns = [
    {
      title: 'ID Mutasi',
      dataIndex: 'id_mutasi',
      key: 'id_mutasi',
    },
    {
      title: 'ID Data Barang',
      dataIndex: 'id_data_barang',
      key: 'id_data_barang',
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Dari',
      dataIndex: 'dari',
      key: 'dari',
    },
    {
      title: 'Untuk',
      dataIndex: 'untuk',
      key: 'untuk',
    },
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      key: 'tanggal',
    },
    {
      title: 'Keterangan',
      dataIndex: 'ket',
      key: 'ket',
    },
  ]

  return (
    <div>
      <Table dataSource={mutasis} columns={columns} />
    </div>
  )
}

export default ProsesMutasi
