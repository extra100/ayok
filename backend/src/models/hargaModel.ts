import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Harga {
  public _id?: string
  @prop({ required: true })
  public id_harga!: string
  @prop({ required: true })
  public jenis_harga!: string
}

export const HargaModel = getModelForClass(Harga)
