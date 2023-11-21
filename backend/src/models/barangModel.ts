import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Barang {
  public _id?: string
  @prop({ required: true })
  public id_barang!: string
  @prop({ required: true })
  public nama_barang!: string
  @prop({ required: true })
  public id_satuan!: string
  @prop({ required: true })
  public harga_beli!: string
  @prop({ required: true })
  public hpp!: string
  @prop({ required: true })
  public id_supplier!: string
  @prop({ required: true })
  public status!: string
  @prop({ required: true })
  public barcode!: string
  @prop({ required: true })
  public id_usaha!: string
  @prop({ required: true })
  public id_outlet!: string
  @prop({ required: true })
  public id_kategori!: string
  @prop({ required: true })
  public harga_jual!: string
}

export const BarangModel = getModelForClass(Barang)
