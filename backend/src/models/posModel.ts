import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Pos {
  public _id?: string
  @prop({ required: true })
  public id_pos!: string
  @prop({ required: true })
  public id_data_barang!: string
  @prop({ required: true })
  public qty_sold!: number
  @prop({ required: true })
  public harga_jual!: string
  @prop({ required: true })
  public total!: string
  @prop({ required: true })
  public diskon!: string
  @prop({ required: true })
  public id_harga!: string
  @prop({ required: true })
  public inv!: string
  @prop({ required: true })
  public biji!: number
  @prop({ required: true })
  public id_outlet!: string
  @prop({ required: true })
  public id_satuan!: string
  @prop({ required: true })
  public id_pajak!: string
  @prop({ required: true })
  public jumlah_pajak!: string
  @prop({ required: true })
  public jenis_pajak!: string
  // @prop({ required: true })
  // public via!: string

  @prop({ required: true })
  public tag!: string[]
}
export const PosModel = getModelForClass(Pos)
