import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetoutletsQuery } from '../../hooks/outletHooks'

import { useGetProductsQuery } from '../../hooks/productHooks'

import dayjs from 'dayjs'
import 'dayjs/locale/id'
import { useGetPosDetailQuery } from '../../hooks/posHooks'

const PosPrint = React.forwardRef((props, ref) => {
  const { id_pos } = useParams()

  const { data: poss } = useGetPosDetailQuery(id_pos as string)

  if (!poss) {
    return <div>Loading...</div>
  }

  const { data: outletData } = useGetoutletsQuery()
  const idOutletDari = poss && poss.length > 0 ? poss[0].id_outlet : ''
  const outletDari = outletData?.find(
    (outlet) => outlet.id_outlet === idOutletDari
  )

  function calculateStatusText(poss: any) {
    const qtyBeri = parseFloat(poss.qty_beri)
    const sisaMinta = parseFloat(poss.sisa_minta)

    if (
      !isNaN(qtyBeri) &&
      qtyBeri > 0 &&
      (isNaN(sisaMinta) || sisaMinta === 0)
    ) {
      return 'Completed'
    } else if (!isNaN(qtyBeri) && qtyBeri > 0) {
      return 'Sebagian'
    } else {
      return 'Checking...'
    }
  }
  const { data: products } = useGetProductsQuery()

  const [currentDate, setCurrentDate] = useState<string>('')

  useEffect(() => {
    dayjs.locale('id')

    const today = dayjs()
    const formattedDate = today.format('dddd, DD MMMM YYYY')

    setCurrentDate(formattedDate)
  }, [])

  return (
    <div>
      <div>
        <span>{outletDari ? outletDari.nama_outlet : ''}</span>
      </div>
      <span>{id_pos}</span>
      <span>{outletDari ? outletDari.nama_outlet : ''}</span>
      <table style={{ marginBottom: 20 }}>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Nama Barang</th>
            <th>Harga</th>
            <th>Jumlah</th>
            <th>Total</th>
            <th>Diskon</th>
          </tr>
        </thead>
        <tbody>
          {poss.map((satuan, index) => {
            const product = products?.find(
              (product) => product.id_data_barang === satuan.id_data_barang
            )
            return (
              <tr key={satuan._id}>
                <td>{index + 1}</td>
                <td>
                  {product
                    ? product.nama_barang
                    : 'Nama Barang Tidak Ditemukan'}
                </td>
                <td>{satuan.harga_jual}</td>
                <td>{satuan.qty_sold}</td>
                <td>{satuan.total}</td>
                <td>{satuan.diskon}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="container">
        <div className="tanggal">{currentDate}</div>

        <div className="header">
          <div className="driver">
            Driver
            <div className="ttd">.................................</div>
          </div>
          <div className="penerima">
            Nama Pembeli
            <div className="ttd">.................................</div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default PosPrint
