export type Mutasi = {
  id_mutasi: string
  id_data_barang: string
  qty: string
  dari: string
  untuk: string
  tanggal: string
  ket: string
  [key: string]: string | number | undefined // Define an index signature
}
