import React, { useContext, useState } from 'react'
import { Table, Switch, Tooltip } from 'antd'
import _ from 'lodash'
import { useGetStoksQuery } from '../../hooks/stokHooks'
import { useGetoutletsQuery } from '../../hooks/outletHooks'

import UserContext from '../../contexts/UserContext'
import { useGetProductsQuery } from '../../hooks/productHooks'

import './styles.css'

const PivotTable = () => {
  const { data: stoks = [] } = useGetStoksQuery()
  const { data: namaOutletData = [] } = useGetoutletsQuery()
  const { data: namaBarangData = [] } = useGetProductsQuery()

  const [showAllOutlets, setShowAllOutlets] = useState(false)

  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  let idOutletLoggedIn = ''

  if (user) {
    idOutletLoggedIn = user.id_outlet
  }

  const outletNameMap = _.chain(namaOutletData)
    .keyBy('_id')
    .mapValues('nama_outlet')
    .value()

  const stokByOutlet = _.chain(stoks)
    .groupBy('id_data_barang')
    .mapValues((group) => {
      return _.chain(group).keyBy('id_outlet').mapValues('jumlah_stok').value()
    })
    .value()

  const productNameMap = _.chain(namaBarangData)
    .keyBy('_id')
    .mapValues('nama_barang')
    .value()

  const filteredOutlets = showAllOutlets
    ? _.chain(stoks).map('id_outlet').uniq().value()
    : [idOutletLoggedIn]

  if (filteredOutlets.includes(idOutletLoggedIn)) {
    _.pull(filteredOutlets, idOutletLoggedIn)

    filteredOutlets.unshift(idOutletLoggedIn)
  }

  const pivotedData = _.map(stokByOutlet, (stok, id_data_barang) => {
    const rowData: Record<string, any> = { id_data_barang }

    _.forEach(stok, (jumlah_stok, id_outlet) => {
      if (filteredOutlets.includes(id_outlet)) {
        rowData[outletNameMap[id_outlet]] = jumlah_stok
      }
    })

    return rowData
  })

  const detailColumn = {
    title: 'Detail',
    dataIndex: 'id_data_barang',
    key: 'detail',
    render: (id_data_barang: string) => {
      const productData = stokByOutlet[id_data_barang]

      const tooltipContent = (
        <div>
          <div>{productNameMap[id_data_barang]}</div>
          {Object.entries(productData).map(([key, value]) => (
            <div key={key}>
              {outletNameMap[key]}: {value}
            </div>
          ))}
        </div>
      )

      return (
        <Tooltip title={tooltipContent} overlayClassName="custom-tooltip">
          <a>Show Detail</a>
        </Tooltip>
      )
    },
  }

  const columns = [
    {
      title: 'No.',
      dataIndex: 'id_data_barang',
      key: 'id_data_barang',
      width: 50,
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: 'Nama Barang sesss',
      dataIndex: 'id_data_barang',
      key: 'id_data_barang',
      render: (id_data_barang: string) => productNameMap[id_data_barang],
    },
    {
      title: `Outlet ${outletNameMap[idOutletLoggedIn]}`,
      dataIndex: idOutletLoggedIn,
      key: idOutletLoggedIn,
    },
    ...filteredOutlets.map((outlet) => ({
      title: `Outlet ${outletNameMap[outlet]}`,
      dataIndex: outletNameMap[outlet],
      key: outletNameMap[outlet],
    })),
    detailColumn,
  ]

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        Tampilkan Semua Outlet:{' '}
        <Switch
          checked={showAllOutlets}
          onChange={(checked) => setShowAllOutlets(checked)}
        />
      </div>
      <Table dataSource={pivotedData} columns={columns} />
    </div>
  )
}

export default PivotTable
