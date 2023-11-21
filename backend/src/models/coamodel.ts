import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Coa {
  public _id?: string
  @prop({ required: true })
  public nama_akun!: string
  @prop({ required: true })
  public kode_akun!: string
  @prop({ required: true })
  public kategori!: string
  @prop({ required: true })
  public deskripsi!: string
}

export const CoaModel = getModelForClass(Coa)
