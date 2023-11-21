import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class CicilanBeli {
  public _id?: string
  @prop({ required: true })
  public id_beli!: string
  @prop({ required: true })
  public id_bank!: string
  @prop({ required: true })
  public cicil!: number
  @prop({ required: true })
  public tanggal!: string
  @prop({ required: true })
  public piutang!: number
}

export const CicilanBeliModel = getModelForClass(CicilanBeli)
