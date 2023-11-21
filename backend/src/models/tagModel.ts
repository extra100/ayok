import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class TagModel {
  public _id?: string
  @prop({ required: true })
  public nama_tag!: string
}

export const tagModel = getModelForClass(TagModel)
