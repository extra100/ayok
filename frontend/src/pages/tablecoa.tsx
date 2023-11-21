import React from 'react'
import { Table, Typography } from 'antd'
import { useGetCoasQuery } from '../hooks/coaHooks'
import { useGetPossQuery } from '../hooks/posHooks'

const { Text } = Typography

const TableCoa: React.FC = () => {
  const { data: dataCoa } = useGetCoasQuery()
  const { data: dataPos } = useGetPossQuery()

  const totalSum = dataPos
    ? dataPos.reduce((total: any, pos: any) => total + Number(pos.total), 0)
    : 0

  const columns = [
    {
      title: 'id',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'nama akun',
      dataIndex: 'nama_akun',
      key: 'nama_akun',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: () => <Text>{totalSum}</Text>,
    },
  ]

  return (
    <div>
      <Table dataSource={dataCoa} columns={columns} />
      <div>{totalSum}</div>
    </div>
  )
}

export default TableCoa
