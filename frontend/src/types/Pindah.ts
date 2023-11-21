export type Pindah = {
  _id: string
  id_pindah: string
  qty_minta: number
  qty_beri: number
  sisa_minta: number
  id_data_barang: string
  id_outlet_dari: string
  id_outlet_tujuan: string
  tanggal?: string
  ket: string
  tag: string
  [key: string]: any

  // qty_inputan: string
}
