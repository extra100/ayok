import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Setoran {
  public _id?: string
  @prop({ required: true })
  public id_setoran!: string
  @prop({ required: true })
  public id_outlet!: string
  @prop({ required: true })
  public tujuan_outlet!: string
  @prop({ required: true })
  public dari_akun!: string
  @prop({ required: true })
  public ke_akun!: string
  @prop({ required: true })
  public nilai!: string
  @prop({ required: true })
  public status!: string
  @prop({ required: true })
  public catatan!: string
  @prop({ required: true })
  public id_data_barang!: string
}

export const SetoranModel = getModelForClass(Setoran)
