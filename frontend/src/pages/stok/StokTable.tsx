import React, { useContext, useState } from 'react'
import { Table, Switch, Tooltip } from 'antd'
import _ from 'lodash'
import { useGetStoksQuery } from '../../hooks/stokHooks'
import { useGetoutletsQuery } from '../../hooks/outletHooks'

import UserContext from '../../contexts/UserContext'
import { useGetProductsQuery } from '../../hooks/productHooks'
import { Link, useLocation, useParams } from 'react-router-dom'

import { useGetPosDetailQuery } from '../../hooks/posHooks'

import { useGetReturBeliByIdQuery } from '../../hooks/returBeliHooks'
import { useGetReturByIdQuery } from '../../hooks/returHooks'
import { useGetPesoDetailQuery } from '../../hooks/pesoHooks'
import { useGetPindahByIdQuery } from '../../hooks/pindahHooks'
import {
  useGetApproveBeliByIdQuery,
  useGetApprovebelisQuery,
} from '../../hooks/approveBeliHooks'
import { useGetMultisQuery } from '../../hooks/multiHooks'

const PivotTable = () => {
  const { data: stoks = [] } = useGetStoksQuery()
  const { data: namaOutletData = [] } = useGetoutletsQuery()
  const { data: namaBarangData = [] } = useGetProductsQuery()
  const { data: hargaBeliData = [] } = useGetApprovebelisQuery()
  const { id_pos } = useParams<{ id_pos?: string }>()
  const { id_beli } = useParams<{ id_beli?: string }>()
  const { id_retur } = useParams<{ id_retur?: string }>()
  const { id_peso } = useParams<{ id_peso?: string }>()
  const { id_pindah } = useParams<{ id_pindah?: string }>()

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

  const hargaJualMap = _.chain(namaBarangData)
    .keyBy('_id')
    .mapValues('harga_jual')
    .value()
  const beliByOutlet = _.chain(hargaBeliData)
    .keyBy('id_data_barang')
    .mapValues('harga_jual')
    .value()
  console.log({ beliByOutlet })

  const filteredOutlets = showAllOutlets
    ? _.chain(stoks).map('id_outlet').uniq().value()
    : [idOutletLoggedIn]

  if (filteredOutlets.includes(idOutletLoggedIn)) {
    _.pull(filteredOutlets, idOutletLoggedIn)

    filteredOutlets.unshift(idOutletLoggedIn)
  }

  const { data: posDetailData = [] } = useGetPosDetailQuery(id_pos || '')
  const { data: beliDetailData = [] } = useGetApproveBeliByIdQuery(
    id_beli || ''
  )
  const { data: returJualDetailData = [] } = useGetReturByIdQuery(id_pos || '')
  const { data: returBeliDetailData = [] } = useGetReturBeliByIdQuery(
    id_retur || ''
  )
  const { data: pesoDetailData = [] } = useGetPesoDetailQuery(id_peso || '')
  const { data: pindahDetailData = [] } = useGetPindahByIdQuery(id_pindah || '')

  const pivotedData = _.map(stokByOutlet, (stok, id_data_barang) => {
    const rowData: Record<string, any> = { id_data_barang }

    let totalStok = 0
    let totalQtySold = 0

    _.forEach(stok, (jumlah_stok, id_outlet, id_outlet_dari) => {
      if (filteredOutlets.includes(id_outlet)) {
        const posDetail = posDetailData.find(
          (saling) =>
            saling.id_data_barang === id_data_barang &&
            saling.id_outlet === id_outlet
        )
        const beliDetail = beliDetailData.find(
          (buying: any) =>
            buying.id_data_barang === id_data_barang &&
            buying.id_outlet === id_outlet
        )
        const returJualDetail = returJualDetailData.find(
          (returSelling: any) =>
            returSelling.id_data_barang === id_data_barang &&
            returSelling.id_outlet === id_outlet
        )

        const returBuyDetail = returBeliDetailData.find(
          (returBuying: any) =>
            returBuying.id_data_barang === id_data_barang &&
            returBuying.id_outlet === id_outlet
        )

        const pesoDetail = pesoDetailData.find(
          (pes: any) =>
            pes.id_data_barang === id_data_barang && pes.id_outlet === id_outlet
        )

        const pindahDetailDari = pindahDetailData.find(
          (move: any) =>
            move.id_data_barang === id_data_barang &&
            move.id_outlet_dari === id_outlet
        )

        const pindahDetailTujuan = pindahDetailData.find(
          (move: any) =>
            move.id_data_barang === id_data_barang &&
            move.id_outlet_tujuan === id_outlet
        )

        const selisihStok =
          jumlah_stok -
          (posDetail ? posDetail.qty_sold : 0) -
          (returBuyDetail ? returBuyDetail.qty_retur : 0) +
          (returJualDetail ? returJualDetail.qty_retur : 0) +
          (beliDetail ? beliDetail.qty_sold : 0) +
          (pesoDetail ? pesoDetail.qty_sold : 0) +
          (pindahDetailDari ? pindahDetailDari.qty_beri : 0) -
          (pindahDetailTujuan ? pindahDetailTujuan.qty_beri : 0)

        rowData[outletNameMap[id_outlet]] = selisihStok

        totalStok += jumlah_stok
        totalQtySold += selisihStok
      }
    })
    rowData['Total Stok'] = totalStok
    rowData['Qty Sold Sale'] = totalQtySold

    return rowData
  })
  const prefix = 'MOVE'
  const randomNumber = Math.floor(Math.random() * 10000)
  const idpindahdarilinktooltip = `${prefix}${randomNumber}`

  const detailColumn = {
    title: 'Detail',
    dataIndex: 'id_data_barang',
    key: 'detail',
    render: (id_data_barang: string) => {
      const productData = stokByOutlet[id_data_barang]

      const tooltipContent = (
        <div>
          <div>{productNameMap[id_data_barang]}</div>
          {/* {Object.entries(productData).map(([key, value]) => (
            <div key={key}>
              <Link
                to={`/form-pindah/${id_data_barang}/${key}/${idpindahdarilinktooltip}`}
              >
                {outletNameMap[key]}
              </Link>
              : {value}
            </div>
          ))} */}
        </div>
      )

      return (
        // <Tooltip title={tooltipContent} overlayClassName="custom-tooltip">
        <a>Show Detail</a>
        // </Tooltip>
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
      title: 'Nama Barang',
      dataIndex: 'id_data_barang',
      key: 'id_data_barang',
      render: (id_data_barang: string) => productNameMap[id_data_barang],
    },
    ...filteredOutlets.map((outlet) => ({
      title: `${outletNameMap[outlet]}`,
      dataIndex: outletNameMap[outlet],
      key: outletNameMap[outlet],
    })),

    {
      title: 'Stok',
      dataIndex: 'Qty Sold Sale',
      key: 'Qty Sold Sale',
    },
    {
      title: 'Harga Jual',
      dataIndex: 'id_data_barang',
      key: 'harga_jual',
      render: (id_data_barang: string) => hargaJualMap[id_data_barang],
    },
    {
      title: 'Harga Beli',
      dataIndex: 'id_data_barang',
      key: 'harga_jual ',
      render: (id_data_barang: string) => beliByOutlet[id_data_barang],
    },

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
      <Table dataSource={pivotedData} columns={columns} rowKey="_id" />
    </div>
  )
}

export default PivotTable
