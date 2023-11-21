import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetoutletsQuery } from '../../hooks/outletHooks'

import { useGetPindahDetailQuery } from '../../hooks/pindahHooks'
import { useGetProductsQuery } from '../../hooks/productHooks'
import './mutasi.css'
import dayjs from 'dayjs'
import 'dayjs/locale/id'

const ComponentToPrintMutasi = React.forwardRef((props, ref) => {
  const { id_pindah } = useParams()

  const { data: pindahs } = useGetPindahDetailQuery(id_pindah as string)

  if (!pindahs) {
    return <div>Loading...</div>
  }

  const tanggalan = pindahs && pindahs.length > 0 ? pindahs[0].tanggal : ''

  const { data: outletData } = useGetoutletsQuery()
  const idOutletDari =
    pindahs && pindahs.length > 0 ? pindahs[0].id_outlet_dari : ''
  const outletDari = outletData?.find(
    (outlet) => outlet.id_outlet === idOutletDari
  )

  const idOutletTujuan =
    pindahs && pindahs.length > 0 ? pindahs[0].id_outlet_tujuan : ''
  const outletTujuan = outletData?.find(
    (outlet) => outlet.id_outlet === idOutletTujuan
  )

  function calculateStatusText(pindahs: any) {
    const qtyBeri = parseFloat(pindahs.qty_beri)
    const sisaMinta = parseFloat(pindahs.sisa_minta)

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
    // Mengatur konfigurasi dayjs ke Bahasa Indonesia
    dayjs.locale('id')

    // Mendapatkan tanggal hari ini beserta hari
    const today = dayjs()
    const formattedDate = today.format('dddd, DD MMMM YYYY')

    // Menetapkan tanggal ke state
    setCurrentDate(formattedDate)
  }, [])

  return (
    <div>
      <div>
        <span>{outletDari ? outletDari.nama_outlet : ''}</span>
      </div>
      <span>{id_pindah}</span>
      <span>{outletDari ? outletDari.nama_outlet : ''}</span>
      <span>{outletTujuan ? outletTujuan.nama_outlet : ''}</span>
      <div>{tanggalan}</div>
      <table style={{ marginBottom: 20 }}>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Nama Barang</th>
            <th>Jumlah Minta</th>
            <th>Jumlah Beri</th>
            <th>Jumlah Sisa</th>
            <th>Ket</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pindahs.map((satuan, index) => {
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
                <td> {calculateStatusText(satuan)} </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="container">
        <div className="tanggal">{currentDate}</div>

        <div className="header">
          <div className="pengirim">
            Nama Pengirim
            <div className="ttd">.................................</div>
          </div>
          <div className="driver">
            Driver
            <div className="ttd">.................................</div>
          </div>
          <div className="penerima">
            Nama Penerima
            <div className="ttd">.................................</div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ComponentToPrintMutasi
