import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Jual {
  public _id?: string
  @prop({ required: true })
  public id_jual!: string
  @prop({ required: true })
  public id_data_barang!: string
}

export const JualModel = getModelForClass(Jual)
