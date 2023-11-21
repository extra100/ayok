import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Mutasi {
  public _id?: string
  @prop({ required: true })
  public id_mutasi!: string
  @prop({ required: true })
  public id_data_barang!: string
  @prop({ required: true })
  public dari!: string
  @prop({ required: true })
  public untuk!: string
  @prop({ required: true })
  public qty!: string
  @prop({ required: true })
  public tanggal!: string
  @prop({ required: true })
  public ket!: string
}

export const MutasiModel = getModelForClass(Mutasi)
