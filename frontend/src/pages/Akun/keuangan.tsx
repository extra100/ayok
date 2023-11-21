import React from 'react'
import { Table } from 'antd'
import { useGetAkunasQuery } from '../../hooks/akunaHooks'
import { useGetoutletsQuery } from '../../hooks/outletHooks'

const Uang: React.FC = () => {
  const { data: akunasData } = useGetAkunasQuery()
  const { data: outlets } = useGetoutletsQuery()

  const outletSums = (akunasData || []).reduce((acc: any, akuna: any) => {
    const { id_outlet, jumlah } = akuna
    acc[id_outlet] = (acc[id_outlet] || 0) + jumlah
    return acc
  }, {})

  const dataSource = Object.keys(outletSums).map((id_outlet) => ({
    id_outlet,
    jumlah: outletSums[id_outlet],
  }))

  const columns = [
    {
      title: 'Nama Outlet',
      dataIndex: 'id_outlet',
      key: 'id_outlet',
      render: (id_outlet: string) => {
        const outlet = outlets?.find((outlet: any) => outlet._id === id_outlet)
        return outlet ? outlet.nama_outlet : '-'
      },
    },
    {
      title: 'Total Jumlah',
      dataIndex: 'jumlah',
      key: 'jumlah',
    },
  ]

  return <Table dataSource={dataSource} columns={columns} pagination={true} />
}

export default Uang
