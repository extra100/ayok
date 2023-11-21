import React from 'react'

import { Table } from 'antd'
import _ from 'lodash'
import { useGetStoksQuery } from '../../hooks/stokHooks'
import { useGetoutletsQuery } from '../../hooks/outletHooks'

const PivotTable = () => {
  const { data: stoks = [] } = useGetStoksQuery()
  const namaOutlet = useGetoutletsQuery()

  const pivotedData = _.chain(stoks)
    .groupBy('id_data_barang')
    .map((group, id_data_barang) => {
      const rowData: Record<string, any> = { id_data_barang }

      group.forEach((item) => {
        rowData[item.id_outlet] = item.jumlah_stok
      })

      return rowData
    })
    .value()

  const outlets = _.chain(stoks).map('id_outlet').uniq().value()

  const columns = [
    {
      title: 'No.',
      dataIndex: 'id_data_barang',
      key: 'id_data_barang',
      width: 50,
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: 'Nama Barang',
      dataIndex: 'id_data_barang',
      key: 'id_data_barang',
    },
    ...outlets.map((outlet) => ({
      title: `Outlet ${outlet}`,
      dataIndex: outlet,
      key: outlet,
    })),
  ]

  return <Table dataSource={pivotedData} columns={columns} />
}

export default PivotTable
