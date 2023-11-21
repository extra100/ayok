import React from 'react'
import { Table, Spin, Space } from 'antd'
import { useGetCoasQuery } from '../hooks/coaHooks'
import { useGetPossQuery } from '../hooks/posHooks'

const CoaTable: React.FC = () => {
  const { data: coasData } = useGetCoasQuery()
  const { data: posData } = useGetPossQuery()
  const semuaTotalPos = posData
    ? posData.reduce((e: any, value: any) => e + Number(value.total), 0)
    : 0

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id_coa',
      key: 'id_coa',
    },
    {
      title: 'Nama Akun',
      dataIndex: 'nama_akun',
      key: 'nama_akun',
    },
    {
      title: 'Kode Akun',
      dataIndex: 'kode_akun',
      key: 'kode_akun',
    },
    {
      title: 'Coa',
      dataIndex: 'coa',
      key: 'coa',
    },
    {
      title: 'Total',
      dataIndex: 'total_semua',
      key: 'total_semua',
      render: () => <span>{semuaTotalPos}</span>,
    },
  ]

  return (
    <div>
      <Table dataSource={coasData} columns={columns} />
      <div>{semuaTotalPos}</div>
    </div>
  )
}

export default CoaTable
