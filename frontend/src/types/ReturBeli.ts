import moment from 'moment'

export type ReturBeli = {
  _id: string
  id_beli: string
  id_data_barang: string
  harga_jual: string
  total: string
  diskon: string
  id_outlet: string
  id_satuan: string
  qty_retur: number
  uang_retur: number
}
