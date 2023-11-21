import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Cicilan {
  public _id?: string
  @prop({ required: true })
  public id_pos!: string
  @prop({ required: true })
  public id_bank!: string
  @prop({ required: true })
  public cicil!: number
  @prop({ required: true })
  public tanggal!: string
  @prop({ required: true })
  public piutang!: number
}

export const CicilanModel = getModelForClass(Cicilan)
