import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Multi {
  public _id?: string
  @prop({ required: true })
  public id_multi!: string
  @prop({ required: true })
  public id_data_barang!: string
  @prop({ required: true })
  public id_harga!: string
  @prop({ required: true })
  public harga_terendah!: string
  @prop({ required: true })
  public harga_tertinggi!: string
}

export const MultiModel = getModelForClass(Multi)
