// import moment from 'moment'

// export type ApproveBeli = {
//   _id: string
//   id_beli: string
//   id_data_barang: string
//   harga_jual: string
//   total: string
//   diskon: string
//   id_outlet: string
//   id_satuan: string
//   qty_diapprove: number
//   uang_retur: number
// }
import moment from 'moment'

export type ApproveBeli = {
  _id: string
  id_beli: string
  id_data_barang: string
  harga_jual: string
  total: string
  diskon: string
  id_harga: string
  qty_sold: number
  inv: string
  biji: number
  id_outlet: string
  id_satuan: string
  id_pajak: string
  jumlah_pajak: string
  jenis_pajak: string
  tag: string[]
}
