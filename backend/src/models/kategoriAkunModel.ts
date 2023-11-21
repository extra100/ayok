import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class KategoriAkun {
  public _id?: string
  @prop({ required: true })
  public kode_kategori_akun!: string
  @prop({ required: true })
  public kategori!: string
}

export const KategoriAkunModel = getModelForClass(KategoriAkun)
