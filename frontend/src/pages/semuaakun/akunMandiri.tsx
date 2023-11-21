import React from 'react'
import { Table } from 'antd'
import { useGetPesosQuery } from '../../hooks/pesoHooks'
import { useGetPenjualansQuery } from '../../hooks/penjualanHooks'
import { useGetPembeliansQuery } from '../../hooks/pembelianHooks'

const AkunMandiri: React.FC = () => {
  const hitungJual = useGetPenjualansQuery()
  const hitungBeli = useGetPembeliansQuery()
  const hitungPeso = useGetPesosQuery()

  const filterViaRekeningMandiri = (data: any[]) => {
    return data.filter((item) => item.via === 'Rekening Mandiri')
  }

  const jualData = filterViaRekeningMandiri(hitungJual.data || [])
  const beliData = filterViaRekeningMandiri(hitungBeli.data || [])
  const pesoData = filterViaRekeningMandiri(hitungPeso.data || [])

  const combinedData = [...jualData, ...beliData, ...pesoData]

  const dataSource = combinedData.map((item, index) => ({
    key: index,
    no: index + 1,
    via: item.via,
    total_semua: item.total_semua,
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
    },
    {
      title: 'Jumlah',
      dataIndex: 'total_semua',
      key: 'total_semua',
    },
  ]

  return <Table dataSource={dataSource} columns={columns} />
}

export default AkunMandiri
