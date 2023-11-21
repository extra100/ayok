import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'
@modelOptions({ schemaOptions: { timestamps: true } })
export class Supplier {
  public _id?: string
  @prop({ required: true })
  public id_supplier!: string
  @prop({ required: true })
  public nama_supplier!: string
  @prop({ required: true })
  public alamat_supplier!: string
  @prop({ required: true })
  public kontak_supplier!: string
  @prop({ required: true })
  public id_harga!: string
}
export const SupplierModel = getModelForClass(Supplier)
