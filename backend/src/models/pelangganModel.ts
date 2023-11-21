import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Pelanggan {
  public _id?: string
  @prop({ required: true })
  public id_outlet!: string
  @prop({ required: true })
  public id_pelanggan!: string
  @prop({ required: true })
  public type_kontak!: string[]
  @prop({ required: true })
  public id_harga!: string
  @prop({ required: true })
  public nama!: string
  @prop({ required: true })
  public perusahaan!: string
  @prop({ required: true })
  public rt!: string
  @prop({ required: true })
  public provinsi!: string
  @prop({ required: true })
  public kabupaten!: string
  @prop({ required: true })
  public kecamatan!: string
  @prop({ required: true })
  public desa!: string
  @prop({ required: true })
  public email!: string
  @prop({ required: true })
  public hp!: string
  @prop({ required: true })
  public pengenal!: string
  @prop({ required: true })
  public no_pengenal!: string
  @prop({ required: true })
  public npwp!: string
  @prop({ required: true })
  public koordinat!: string
  @prop({ required: true })
  public tanggal!: string
}

export const PelangganModel = getModelForClass(Pelanggan)
