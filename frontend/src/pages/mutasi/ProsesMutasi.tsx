import React from 'react'
import { Table } from 'antd'
import { useGetMutasisQuery } from '../../hooks/mutasiHooks'
import { Mutasi } from '../../types/Mutasi'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import { Link } from 'react-router-dom'

const ProsesMutasi = () => {
  const { data: mutasis } = useGetMutasisQuery()
  const { data: outlets } = useGetoutletsQuery()

  const columns = [
    {
      title: 'No',
      key: 'index',
      align: 'center' as 'center',
      fixed: true,
      width: '5%',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'id_mutasi',
      dataIndex: 'id_mutasi',
      key: 'id_mutasi',
      render: (text: any, record: any) => (
        <Link to={`/mutasi/${record.id_mutasi}`}>{text}</Link>
      ),
    },
    {
      title: 'tanggal',
      dataIndex: 'tanggal',
      key: 'tanggal',
    },
    {
      title: 'Dari',
      dataIndex: 'dari',
      key: 'dari',
      render: (id_outlet: string) => {
        const outlet = outlets?.find((outlet) => outlet._id === id_outlet)
        return outlet ? outlet.nama_outlet : '-'
      },
    },
    {
      title: 'untuk',
      dataIndex: 'untuk',
      key: 'untuk',
      render: (id_outlet: string) => {
        const outlet = outlets?.find((outlet) => outlet._id === id_outlet)
        return outlet ? outlet.nama_outlet : '-'
      },
    },
  ]

  return <Table<Mutasi> dataSource={mutasis || []} columns={columns} />
}

export default ProsesMutasi
