import { Table } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { useGetPembeliansQuery } from '../../hooks/pembelianHooks'
import { useGetPenjualansQuery } from '../../hooks/penjualanHooks'
import { useGetPesosQuery } from '../../hooks/pesoHooks'
const AllInOne: React.FC = () => {
  const hitungJual = useGetPenjualansQuery()
  const hitungBeli = useGetPembeliansQuery()
  const hitungPeso = useGetPesosQuery()

  const calculateTotal = (data: any[]) => {
    const totals: { [key: string]: number } = {}

    data.forEach((item) => {
      const key = `${item.via}_${item.id_outlet}`
      if (!totals[key]) {
        totals[key] = 0
      }
      totals[key] += parseFloat(item.total_semua)
    })

    return totals
  }

  const penjualanTotals = calculateTotal(hitungJual.data || [])
  const pembelianTotals = calculateTotal(hitungBeli.data || [])
  const pesoTotals = calculateTotal(hitungPeso.data || [])

  const combinedTotals = {
    ...penjualanTotals,
    ...pembelianTotals,
    ...pesoTotals,
  }

  const dataSource = Object.keys(combinedTotals).map((key, index) => ({
    no: index + 1,
    via: key.split('_')[0],
    total_semua: combinedTotals[key],
  }))

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
    },

    {
      title: 'Via',
      dataIndex: 'via',
      key: 'via',
      render: (text: string) => (
        <Link to={`/akun${text.replace(/\s+/g, '').toLowerCase()}`}>
          {text}
        </Link>
      ),
    },

    {
      title: 'Total Semua',
      dataIndex: 'total_semua',
      key: 'total_semua',
    },
  ]

  return <Table dataSource={dataSource} columns={columns} />
}

export default AllInOne
