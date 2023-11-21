import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Bank {
  public _id?: string
  @prop({ required: true })
  public id_bank!: string
  @prop({ required: true })
  public nama_bank!: string
  @prop({ required: true })
  public no_rekening!: string
  @prop({ required: true })
  public ket!: string
}

export const BankModel = getModelForClass(Bank)
