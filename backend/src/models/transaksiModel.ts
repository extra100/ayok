import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Transaksi {
  public _id?: string
  @prop({ required: true })
  public id_transaksi!: string
  @prop({ required: true })
  public status!: string
  @prop({ required: true })
  public total_harga!: number
  @prop({ required: true })
  public id_pelanggan!: number
  @prop({ required: true })
  public id_outlet!: number
  @prop({ required: true })
  public terhutang!: number
  @prop({ required: true })
  public id_harga!: number
}

export const TransaksiModel = getModelForClass(Transaksi)
