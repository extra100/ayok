import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class ReturBeli {
  public _id?: string
  @prop({ required: true })
  public id_beli!: string
  @prop({ required: true })
  public id_data_barang!: string
  @prop({ required: true })
  public harga_jual!: string
  @prop({ required: true })
  public total!: string
  @prop({ required: true })
  public diskon!: string
  @prop({ required: true })
  public id_outlet!: string
  @prop({ required: true })
  public id_satuan!: string
  @prop({ required: true })
  public qty_retur!: number
  @prop({ required: true })
  public uang_retur!: number
}
export const ReturBeliModel = getModelForClass(ReturBeli)
