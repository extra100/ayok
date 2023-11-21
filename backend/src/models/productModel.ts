import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Product {
  public _id?: string

  @prop({ required: true })
  public id_data_barang!: string
  @prop({ required: true, unique: true })
  public nama_barang!: string
  @prop({ required: true })
  public harga_jual!: number
  @prop({ required: true })
  public jumlah_stok!: number
}
export const ProductModel = getModelForClass(Product)
