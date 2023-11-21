import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Peso {
  public _id?: string
  @prop({ required: true })
  public id_peso!: string
  @prop({ required: true })
  public id_data_barang!: string
  @prop({ required: true })
  public qty_sold!: number
  @prop({ required: true })
  public harga_jual!: string
  @prop({ required: true })
  public total_semua!: string
  @prop({ required: true })
  public id_outlet!: string
  @prop({ required: true })
  public id_satuan!: string
  @prop({ required: true })
  public tanggal!: string
  @prop({ required: true })
  public inv!: string
  @prop({ required: true })
  public via!: string
}
export const PesoModel = getModelForClass(Peso)
