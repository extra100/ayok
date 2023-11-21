import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Akuna {
  public _id?: string
  @prop({ required: true })
  public id_akuna!: string
  @prop({ required: true })
  public id_outlet!: string
  @prop({ required: true })
  public kategori!: string
  @prop({ required: true })
  public akun!: string
  @prop({ required: true })
  public jumlah!: number
  @prop({ required: true })
  public ket!: string
  @prop({ required: true })
  public tag!: string
  @prop({ required: true })
  public pesan!: string
  @prop({ required: true })
  public tanggal!: string
  @prop({ required: true })
  public penerima!: string
}

export const AkunaModel = getModelForClass(Akuna)
