// import React from 'react'
// import { useParams } from 'react-router-dom'
// import dayjs from 'Dayjs'
// import { useGetPenjualansQuery } from '../../hooks/penjualanHooks'

// const PenjualanDetail: React.FC = () => {
//   const { id_pos } = useParams<{ id_pos: string }>()
//   const { data, isLoading } = useGetPenjualansQuery()

//   const penjualan = data?.find((p) => p.id_pos === id_pos)

//   if (isLoading) {
//     return <div>Loading...</div>
//   }

//   if (!penjualan) {
//     return <div>Penjualan dengan ID {id_pos} tidak ditemukan.</div>
//   }

//   return (
//     <div>
//       <h2>Detail Penjualan {penjualan.id_pos}</h2>
//       <p>Total Semua: {penjualan.total_semua}</p>
//       <p>Diskon: {penjualan.diskon}</p>
//       <p>Bayar: {penjualan.bayar}</p>
//       <p>Kembalian: {penjualan.kembalian}</p>
//       <p>
//         Tanggal Mulai: {dayjs(penjualan.tanggal_mulai).format('DD/MM/YYYY')}
//       </p>
//       <p>
//         Tanggal Akhir: {dayjs(penjualan.tanggal_akhir).format('DD/MM/YYYY')}
//       </p>
//       <p>Metode Pembayaran: {penjualan.via}</p>
//       <p>Piutang: {penjualan.piutang}</p>
//       <p>ID Pelanggan: {penjualan.id_pelanggan}</p>
//     </div>
//   )
// }

// export default PenjualanDetail
