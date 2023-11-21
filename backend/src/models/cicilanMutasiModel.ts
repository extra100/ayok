import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class CicilanMutasi {
  public _id?: string
  @prop({ required: true })
  public id_pindah!: string
  @prop({ required: true })
  public qty_minta!: string
  @prop({ required: true })
  public qty_beri!: string
  @prop({ required: true })
  public sisa_minta!: string
  @prop({ required: true })
  public id_data_barang!: string
  @prop({ required: true })
  public id_outlet!: string
  @prop({ required: true })
  public id_outlet_tujuan!: string
  @prop({ required: true })
  public tanggal!: string
  @prop({ required: true })
  public ket!: string
}

export const CicilanMutasiModel = getModelForClass(CicilanMutasi)
