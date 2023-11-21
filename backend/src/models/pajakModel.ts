import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Pajak {
  public _id?: string
  @prop({ required: true })
  public id_pajak!: string
  @prop({ required: true })
  public jenis_pajak!: string
  @prop({ required: true })
  public jumlah_pajak!: string
}

export const PajakModel = getModelForClass(Pajak)
