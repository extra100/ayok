import moment from 'moment'

export type Pos = {
  _id: string
  id_pos: string
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
  // via: string

  tag: string[]
}
