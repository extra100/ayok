import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Pindah {
  public _id?: string
  @prop({ required: true })
  public id_pindah!: string
  @prop({ required: true })
  public qty_minta!: number
  @prop({ required: true })
  public qty_beri!: number
  @prop({ required: true })
  public sisa_minta!: number
  @prop({ required: true })
  public id_data_barang!: string
  @prop({ required: true })
  public id_outlet_dari!: string
  @prop({ required: true })
  public id_outlet_tujuan!: string
  @prop({ required: true })
  public tanggal!: string
  @prop({ required: true })
  public ket!: string
  @prop({ required: true })
  public tag!: string
  // @prop({ required: true })
  // public qty_pindah!: string
}

export const PindahModel = getModelForClass(Pindah)
