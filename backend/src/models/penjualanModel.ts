import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Penjualan {
  public _id?: string
  @prop({ required: true })
  public id_pos!: string
  @prop({ required: true })
  public total_semua!: string
  @prop({ required: true })
  public diskon!: string
  @prop({ required: true })
  public bayar!: string
  @prop({ required: true })
  // public kembalian!: string
  // @prop({ required: true })
  public tanggal_mulai!: string // Tambahkan properti ini
  @prop({ required: true })
  public tanggal_akhir!: string // Tambahkan properti ini
  @prop({ required: true })
  public via!: string
  @prop({ required: true })
  public piutang!: string
  @prop({ required: true })
  public id_pelanggan!: string
  @prop({ required: true })
  public inv!: string
  @prop({ required: true })
  selisih!: number
  @prop({ required: true })
  id_harga?: string
  @prop({ required: true })
  id_outlet?: string
  @prop({ required: true })
  catatan?: string
  @prop({ required: true })
  public sub_total!: string
  @prop({ required: true })
  public nama!: string
}

export const PenjualanModel = getModelForClass(Penjualan)
