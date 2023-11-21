import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Kind {
  public _id?: string

  @prop({ required: true })
  public id_kategori!: string

  @prop({ required: true })
  public jenis_kategori!: string
}

export const KindModel = getModelForClass(Kind)
