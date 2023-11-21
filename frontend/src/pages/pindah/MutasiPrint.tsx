import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetoutletsQuery } from '../../hooks/outletHooks'

import { useGetProductsQuery } from '../../hooks/productHooks'

import dayjs from 'dayjs'
import 'dayjs/locale/id'

import { useGetPindahDetailQuery } from '../../hooks/pindahHooks'

const MutasiPrint = React.forwardRef((props, ref) => {
  const { id_pos } = useParams()

  const { data: poss } = useGetPindahDetailQuery(id_pos as string)

  if (!poss) {
    return <div>Loading...</div>
  }

  const { data: outletData } = useGetoutletsQuery()
  const idOutletDari = poss && poss.length > 0 ? poss[0].id_outlet_dari : ''
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
            <th>Jumlah minta</th>
            <th>Jumlah Pemberian</th>
            <th>Jumlah SIsa</th>
            <th>Ket</th>
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
                <td>{satuan.qty_minta}</td>
                <td>{satuan.qty_beri}</td>
                <td>{satuan.sisa_minta}</td>
                <td>{satuan.ket}</td>
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
            Nama Checker
            <div className="ttd">.................................</div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default MutasiPrint
